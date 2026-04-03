const express = require("express");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const productRoute = require("./routes/productRoute");
const customerRoute = require("./routes/customerRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const reviewRoute = require("./routes/reviewRoute");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const API_BASE = process.env.API_BASE || "http://localhost:4000/api";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "E-Commerce Microservices (API Gateway)",
    version: "1.0.0",
    description:
      "Gateway-proxied endpoints for product, customer, order, payment and review services",
  },
  servers: [{ url: API_BASE }],
  tags: [
    { name: "Products", description: "Product management" },
    { name: "Customers", description: "Customer registration and auth" },
    { name: "Orders", description: "Cart and order operations" },
    { name: "Payments", description: "Payment creation and processing" },
    { name: "Reviews", description: "Product reviews" },
  ],
};

// ===== Replaced swagger generation with full OpenAPI 3.0 spec =====
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "E-Commerce Microservices (API Gateway)",
    version: "1.0.0",
    description: "Gateway-proxied endpoints for product, customer, order, payment and review services",
  },
  servers: [{ url: API_BASE }],
  tags: [
    { name: "Products", description: "Product management" },
    { name: "Customers", description: "Customer registration and auth" },
    { name: "Orders", description: "Cart and order operations" },
    { name: "Payments", description: "Payment creation and processing" },
    { name: "Reviews", description: "Product reviews" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Product: {
        type: "object",
        properties: {
          _id: { type: "string", example: "605c5d2f2f8fb814c89d4a3b" },
          name: { type: "string", example: "Sample Product" },
          description: { type: "string", example: "Auto test product" },
          price: { type: "number", example: 35 },
          stock: { type: "integer", example: 10 },
          imageUrl: { type: "string", example: "https://example.com/image.png" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ProductInput: {
        type: "object",
        required: ["name", "description", "price", "stock"],
        properties: {
          name: { type: "string", example: "Sample Product" },
          description: { type: "string", example: "Auto test product" },
          price: { type: "number", example: 35 },
          stock: { type: "integer", example: 10 },
          imageUrl: { type: "string", example: "https://example.com/image.png" },
        },
      },
      CustomerRegister: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Automation User" },
          email: { type: "string", example: "auto@example.com" },
          password: { type: "string", example: "password123" },
        },
      },
      CustomerLogin: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "auto@example.com" },
          password: { type: "string", example: "password123" },
        },
      },
      CustomerProfile: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
        },
      },
      CartCreate: {
        type: "object",
        required: ["customerId"],
        properties: { customerId: { type: "string", example: "605c5d2f2f8fb814c89d4a3b" } },
      },
      CartItem: {
        type: "object",
        required: ["productId", "name", "price", "quantity"],
        properties: {
          productId: { type: "string", example: "605c5d2f2f8fb814c89d4a3b" },
          name: { type: "string", example: "Sample Product" },
          price: { type: "number", example: 42 },
          quantity: { type: "integer", example: 2 },
          imageUrl: { type: "string", example: "https://example.com/image.png" },
        },
      },
      UpdateCartItem: {
        type: "object",
        required: ["quantity"],
        properties: { quantity: { type: "integer", example: 3 } },
      },
      Checkout: {
        type: "object",
        required: ["cartId", "shippingAddress", "paymentMethod"],
        properties: {
          cartId: { type: "string", example: "605c5d2f2f8fb814c89d4a3b" },
          shippingAddress: {
            type: "object",
            properties: {
              street: { type: "string", example: "123 Main St" },
              city: { type: "string", example: "Test" },
              zip: { type: "string", example: "12345" },
            },
          },
          paymentMethod: { type: "string", example: "card" },
        },
      },
      Order: {
        type: "object",
        properties: {
          _id: { type: "string" },
          customerId: { type: "string" },
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/CartItem" },
          },
          totalAmount: { type: "number" },
          status: { type: "string", example: "pending" },
          shippingAddress: { type: "object" },
          paymentMethod: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      OrderStatusUpdate: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
            example: "confirmed",
          },
        },
      },
      PaymentCreate: {
        type: "object",
        required: ["orderId", "method", "amount"],
        properties: {
          orderId: { type: "string", example: "605c5d2f2f8fb814c89d4a3b" },
          method: { type: "string", example: "card" },
          amount: { type: "number", example: 84 },
          metadata: { type: "object", example: { source: "test" } },
        },
      },
      Payment: {
        type: "object",
        properties: {
          _id: { type: "string" },
          orderId: { type: "string" },
          method: { type: "string" },
          paymentStatus: { type: "string", enum: ["pending", "success", "failed"] },
          amount: { type: "number" },
          metadata: { type: "object" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ReviewCreate: {
        type: "object",
        required: ["productId", "userId", "rating"],
        properties: {
          productId: { type: "string", example: "605c5d2f2f8fb814c89d4a3b" },
          userId: { type: "string", example: "605c5d2f2f8fb814c89d4a3c" },
          rating: { type: "integer", example: 5, minimum: 1, maximum: 5 },
          comment: { type: "string", example: "Great product" },
        },
      },
      Review: {
        type: "object",
        properties: {
          _id: { type: "string" },
          productId: { type: "string" },
          userId: { type: "string" },
          rating: { type: "integer" },
          comment: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/customers/register": {
      post: {
        tags: ["Customers"],
        summary: "Register customer",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CustomerRegister" } } },
        },
        responses: {
          "201": { description: "Customer created", content: { "application/json": { schema: { $ref: "#/components/schemas/CustomerProfile" } } } },
          "400": { description: "Bad request" },
        },
      }
    },
    "/customers/login": {
      post: {
        tags: ["Customers"],
        summary: "Login customer",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CustomerLogin" } } },
        },
        responses: {
          "200": { description: "Authenticated", content: { "application/json": { schema: { type: "object", properties: { token: { type: "string" }, _id: { type: "string" }, name: { type: "string" }, email: { type: "string" } } } } } },
          "401": { description: "Unauthorized" },
        },
      }
    },
    "/customers/profile": {
      get: {
        tags: ["Customers"],
        summary: "Fetch profile (requires JWT)",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Profile", content: { "application/json": { schema: { $ref: "#/components/schemas/CustomerProfile" } } } }, "401": { description: "Unauthorized" } },
      }
    },
    "/products": {
      get: {
        tags: ["Products"],
        summary: "Get all products",
        responses: { "200": { description: "List", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Product" } } } } } },
      },
      post: {
        tags: ["Products"],
        summary: "Create product",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProductInput" } } } },
        responses: { "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } } }
      }
    },
    "/products/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Product id" }],
      get: {
        tags: ["Products"],
        summary: "Get product by id",
        responses: { "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } }, "404": { description: "Not found" } },
      },
      put: {
        tags: ["Products"],
        summary: "Update product",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ProductInput" } } } },
        responses: { "200": { description: "Updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" } } } }, "404": { description: "Not found" } },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        responses: { "204": { description: "Deleted" }, "404": { description: "Not found" } },
      }
    },
    "/orders/carts": {
      post: {
        tags: ["Orders"],
        summary: "Create cart",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CartCreate" } } } },
        responses: { "201": { description: "Cart created", content: { "application/json": { schema: { type: "object", properties: { _id: { type: "string" }, customerId: { type: "string" }, items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } }, totalPrice: { type: "number" } } } } } } }
      }
    },
    "/orders/carts/{customerId}": {
      parameters: [{ name: "customerId", in: "path", required: true, schema: { type: "string" }, description: "Customer id" }],
      get: {
        tags: ["Orders"],
        summary: "Get cart by customer",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Cart", content: { "application/json": { schema: { type: "object", properties: { _id: { type: "string" }, customerId: { type: "string" }, items: { type: "array", items: { $ref: "#/components/schemas/CartItem" } }, totalPrice: { type: "number" } } } } } }, "404": { description: "Not found" } },
      }
    },
    "/orders/carts/{cartId}/items": {
      parameters: [{ name: "cartId", in: "path", required: true, schema: { type: "string" }, description: "Cart id" }],
      post: {
        tags: ["Orders"],
        summary: "Add item to cart",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CartItem" } } } },
        responses: { "200": { description: "Cart updated", content: { "application/json": { schema: { type: "object" } } } }, "404": { description: "Cart not found" } },
      }
    },
    "/orders/carts/{cartId}/items/{itemId}": {
      parameters: [
        { name: "cartId", in: "path", required: true, schema: { type: "string" }, description: "Cart id" },
        { name: "itemId", in: "path", required: true, schema: { type: "string" }, description: "Cart item id" },
      ],
      patch: {
        tags: ["Orders"],
        summary: "Update cart item quantity",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateCartItem" } } } },
        responses: { "200": { description: "Cart updated", content: { "application/json": { schema: { type: "object" } } } } }
      },
      delete: {
        tags: ["Orders"],
        summary: "Remove cart item",
        responses: { "200": { description: "Item removed", content: { "application/json": { schema: { type: "object" } } } }, "404": { description: "Not found" } },
      }
    },
    "/orders/checkout": {
      post: {
        tags: ["Orders"],
        summary: "Checkout cart",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Checkout" } } } },
        responses: { "201": { description: "Order created", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } }, "400": { description: "Bad request" } }
      }
    },
    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "Get all orders",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Orders", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Order" } } } } } }
      },
      post: {
        tags: ["Orders"],
        summary: "Create cart (alias)",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CartCreate" } } } },
        responses: { "201": { description: "Cart created" } }
      }
    },
    "/orders/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Order id" }],
      get: {
        tags: ["Orders"],
        summary: "Get order by id",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Order", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } }, "404": { description: "Not found" } },
      }
    },
    "/orders/{id}/status": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Order id" }],
      patch: {
        tags: ["Orders"],
        summary: "Update order status",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/OrderStatusUpdate" } } } },
        responses: { "200": { description: "Order updated", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } }, "404": { description: "Not found" } },
      }
    },
    "/payments": {
      post: {
        tags: ["Payments"],
        summary: "Create payment",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/PaymentCreate" } } } },
        responses: { "201": { description: "Payment created", content: { "application/json": { schema: { $ref: "#/components/schemas/Payment" } } } } }
      }
    },
    "/payments/{id}/process": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Payment id" }],
      post: {
        tags: ["Payments"],
        summary: "Process payment",
        responses: { "200": { description: "Processed", content: { "application/json": { schema: { $ref: "#/components/schemas/Payment" } } } }, "404": { description: "Not found" } }
      }
    },
    "/payments/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" }, description: "Payment id" }],
      get: {
        tags: ["Payments"],
        summary: "Get payment by id",
        responses: { "200": { description: "Payment", content: { "application/json": { schema: { $ref: "#/components/schemas/Payment" } } } }, "404": { description: "Not found" } },
      }
    },
    "/payments/order/{orderId}": {
      parameters: [{ name: "orderId", in: "path", required: true, schema: { type: "string" }, description: "Order id" }],
      get: {
        tags: ["Payments"],
        summary: "Get payments by order",
        responses: { "200": { description: "Payments", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Payment" } } } } } }
      }
    },
    "/reviews": {
      post: {
        tags: ["Reviews"],
        summary: "Add product review",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewCreate" } } } },
        responses: { "201": { description: "Review created", content: { "application/json": { schema: { $ref: "#/components/schemas/Review" } } } } }
      }
    },
    "/reviews/product/{productId}": {
      parameters: [{ name: "productId", in: "path", required: true, schema: { type: "string" }, description: "Product id" }],
      get: {
        tags: ["Reviews"],
        summary: "Get product reviews",
        responses: { "200": { description: "List of reviews", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Review" } } } } } }
      }
    }
  }
};

// create express app before using it
const app = express();

// mount swagger UI on gateway (after app is defined)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/products", productRoute);
app.use("/api/customers", customerRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/reviews", reviewRoute);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
