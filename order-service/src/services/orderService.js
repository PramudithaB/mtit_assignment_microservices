const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

const calculateTotal = (items) => items.reduce((sum, i) => sum + i.price * i.quantity, 0);

const createCart = async (customerId) => {
  const existing = await Cart.findOne({ customerId, status: "active" });
  if (existing) return existing;
  return await Cart.create({ customerId, items: [], totalPrice: 0 });
};

const getCartByCustomer = async (customerId) => {
  const cart = await Cart.findOne({ customerId, status: "active" });
  if (!cart) throw { status: 404, message: "Active cart not found" };
  return cart;
};

const addItemToCart = async (cartId, item) => {
  const cart = await Cart.findById(cartId);
  if (!cart || cart.status !== "active") throw { status: 404, message: "Cart not available" };

  const existingItem = cart.items.find((i) => i.productId.toString() === item.productId);
  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  cart.totalPrice = calculateTotal(cart.items);
  return await cart.save();
};

const updateCartItem = async (cartId, itemId, quantity) => {
  const cart = await Cart.findById(cartId);
  if (!cart || cart.status !== "active") throw { status: 404, message: "Cart not available" };

  const item = cart.items.id(itemId);
  if (!item) throw { status: 404, message: "Item not found" };
  if (quantity <= 0) throw { status: 400, message: "Quantity must be above 0" };

  item.quantity = quantity;
  cart.totalPrice = calculateTotal(cart.items);
  return await cart.save();
};

const removeCartItem = async (cartId, itemId) => {
  const cart = await Cart.findById(cartId);
  if (!cart || cart.status !== "active") throw { status: 404, message: "Cart not available" };

  const item = cart.items.id(itemId);
  if (!item) throw { status: 404, message: "Item not found" };

  cart.items.pull(itemId);
  cart.totalPrice = calculateTotal(cart.items);
  return await cart.save();
};

const checkoutCart = async (cartId, { shippingAddress = {}, paymentMethod = "unknown" }) => {
  const cart = await Cart.findById(cartId);
  if (!cart || cart.status !== "active") throw { status: 404, message: "Cart not available" };
  if (!cart.items.length) throw { status: 400, message: "Cart is empty" };

  const order = await Order.create({
    customerId: cart.customerId,
    items: cart.items,
    totalAmount: cart.totalPrice,
    shippingAddress,
    paymentMethod,
    status: "pending"
  });

  cart.status = "checkedout";
  await cart.save();

  return order;
};

const getAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 });
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: "Order not found" };
  return order;
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);
  if (!order) throw { status: 404, message: "Order not found" };
  order.status = status;
  return await order.save();
};

module.exports = {
  createCart,
  getCartByCustomer,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  checkoutCart,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};
