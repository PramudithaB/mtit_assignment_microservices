const paymentService = require("../services/paymentService");

const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
};

const processPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.processPayment(req.params.id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

const getPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentById(req.params.id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
};

const getPaymentsByOrder = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentsByOrderId(req.params.orderId);
    res.json(payments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  processPayment,
  getPayment,
  getPaymentsByOrder
};
