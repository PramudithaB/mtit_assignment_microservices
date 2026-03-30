try {
  require("dotenv").config();
} catch (e) {
  if (e.code !== "MODULE_NOT_FOUND") throw e;
  // dotenv not installed; proceed with process.env values already set
}

const API_BASE = process.env.API_BASE || "http://localhost:4000/api";
const DEFAULT_WAIT_MS = Number(process.env.TEST_WAIT_MS || 250);

const ensureFetch = () => {
  if (typeof fetch === "undefined") {
    throw new Error("Node fetch not available. Use Node 18+ or install a fetch polyfill.");
  }
};

let authHeader = {};
const setAuth = (token) => {
  if (token) authHeader = { Authorization: `Bearer ${token}` };
};

const request = async (path, options = {}) => {
  const url = `${API_BASE}${path}`;
  const defaultHeaders = { "Content-Type": "application/json", ...authHeader };

  if (options.body && typeof options.body !== "string") {
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, {
    ...options,
    headers: { ...defaultHeaders, ...(options.headers || {}) }
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch (e) {
    json = text;
  }

  if (!res.ok) {
    throw { status: res.status, body: json, url, method: options.method || "GET" };
  }

  return json;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const step = async (msg, fn) => {
  console.log(`--> ${msg}`);
  const result = await fn();
  await wait(DEFAULT_WAIT_MS);
  return result;
};

const run = async () => {
  ensureFetch();
  console.log("------------ API endpoint test started ------------");

  const testCustomer = {
    name: "Automation User",
    email: `auto${Date.now()}@example.com`,
    password: "password123"
  };

  const register = await step("Register customer", () =>
    request("/customers/register", { method: "POST", body: testCustomer })
  );

  const login = await step("Login customer", () =>
    request("/customers/login", {
      method: "POST",
      body: { email: testCustomer.email, password: testCustomer.password }
    })
  );
  setAuth(login.token);

  const profile = await step("Fetch customer profile", () =>
    request("/customers/profile", { method: "GET" })
  );

  const productPayload = {
    name: "Sample Product",
    description: "Auto test product",
    price: 35,
    stock: 10,
    imageUrl: "https://example.com/image.png"
  };
  const createdProduct = await step("Create product", () =>
    request("/products", { method: "POST", body: productPayload })
  );

  const allProducts = await step("Get all products", () => request("/products", { method: "GET" }));

  const fetchedProduct = await step("Get product by ID", () =>
    request(`/products/${createdProduct._id}`, { method: "GET" })
  );

  const updatedProduct = await step("Update product", () =>
    request(`/products/${createdProduct._id}`, {
      method: "PUT",
      body: { price: 42, stock: 12 }
    })
  );

  const cart = await step("Create cart", () =>
    request("/orders/carts", {
      method: "POST",
      body: { customerId: profile._id }
    })
  );

  const cartItem = {
    productId: createdProduct._id,
    name: createdProduct.name,
    price: updatedProduct.price,
    quantity: 2,
    imageUrl: createdProduct.imageUrl
  };
  await step("Add item to cart", () =>
    request(`/orders/carts/${cart._id}/items`, { method: "POST", body: cartItem })
  );

  const cartAfterAdd = await step("Get cart by customer", () =>
    request(`/orders/carts/${profile._id}`, { method: "GET" })
  );
  const lineItem = cartAfterAdd.items[0];

  await step("Update cart item quantity", () =>
    request(`/orders/carts/${cart._id}/items/${lineItem._id}`, {
      method: "PATCH",
      body: { quantity: 3 }
    })
  );

  await step("Remove cart item", () =>
    request(`/orders/carts/${cart._id}/items/${lineItem._id}`, { method: "DELETE" })
  );

  await step("Re-add item to cart", () =>
    request(`/orders/carts/${cart._id}/items`, { method: "POST", body: cartItem })
  );

  const checkedOut = await step("Checkout cart", () =>
    request("/orders/checkout", {
      method: "POST",
      body: {
        cartId: cart._id,
        shippingAddress: { street: "123 Main St", city: "Test", zip: "12345" },
        paymentMethod: "card"
      }
    })
  );

  const orders = await step("Get all orders", () => request("/orders", { method: "GET" }));

  const orderById = await step("Get order by ID", () =>
    request(`/orders/${checkedOut._id || checkedOut.id}`, { method: "GET" })
  );

  const actualOrderId = checkedOut._id || checkedOut.id || orderById._id || orderById.id;
  if (!actualOrderId) throw new Error("Unable to determine orderId for payment test (checkout returned empty id)");

  const updatedOrder = await step("Update order status", () =>
    request(`/orders/${actualOrderId}/status`, {
      method: "PATCH",
      body: { status: "confirmed" }
    })
  );

  const payment = await step("Create payment", () =>
    request("/payments", {
      method: "POST",
      body: {
        orderId: actualOrderId,
        method: "card",
        amount: orderById.totalAmount || checkedOut.totalAmount || 0,
        metadata: { source: "test" }
      }
    })
  );

  const processedPayment = await step("Process payment", () =>
    request(`/payments/${payment._id}/process`, { method: "POST" })
  );

  await step("Get payment by ID", () =>
    request(`/payments/${payment._id}`, { method: "GET" })
  );

  await step("Get payments by order", () =>
    request(`/payments/order/${checkedOut._id}`, { method: "GET" })
  );

  const customerId = profile._id || profile.id || register._id || register.id;
  if (!customerId) {
    throw new Error("Unable to determine userId for review; profile/register did not return id.");
  }

  const review = await step("Add product review", () =>
    request("/reviews", {
      method: "POST",
      body: { productId: createdProduct._id, userId: customerId, rating: 5, comment: "Great product" }
    })
  );

  await step("Get product reviews", () =>
    request(`/reviews/product/${createdProduct._id}`, { method: "GET" })
  );

  await step("Delete product", () =>
    request(`/products/${createdProduct._id}`, { method: "DELETE" })
  );

  console.log("------------ API endpoint test completed ------------");
};

run().catch((error) => {
  console.error("Test script failed:", JSON.stringify(error, null, 2));
  process.exit(1);
});
