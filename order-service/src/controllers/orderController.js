const orderService = require("../services/orderService");

const createCart = async (req, res, next) => {
  try {
    const cart = await orderService.createCart(req.body.customerId);
    res.status(201).json(cart);
  } catch (error) { next(error); }
};

const getCartByCustomer = async (req, res, next) => {
  try {
    const cart = await orderService.getCartByCustomer(req.params.customerId);
    res.json(cart);
  } catch (error) { next(error); }
};

const addItem = async (req, res, next) => {
  try {
    const cart = await orderService.addItemToCart(req.params.cartId, req.body);
    res.json(cart);
  } catch (error) { next(error); }
};

const updateItem = async (req, res, next) => {
  try {
    const cart = await orderService.updateCartItem(req.params.cartId, req.params.itemId, req.body.quantity);
    res.json(cart);
  } catch (error) { next(error); }
};

const removeItem = async (req, res, next) => {
  try {
    const cart = await orderService.removeCartItem(req.params.cartId, req.params.itemId);
    res.json(cart);
  } catch (error) { next(error); }
};

const checkout = async (req, res, next) => {
  try {
    const order = await orderService.checkoutCart(req.body.cartId, {
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod
    });
    res.status(201).json(order);
  } catch (error) { next(error); }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) { next(error); }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) { next(error); }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
    res.json(order);
  } catch (error) { next(error); }
};

module.exports = {
  createCart,
  getCartByCustomer,
  addItem,
  updateItem,
  removeItem,
  checkout,
  getOrders,
  getOrder,
  updateStatus
};
