const Payment = require("../models/paymentModel");

const createPayment = async ({ orderId, method, amount, metadata }) => {
  const payment = new Payment({ orderId, method, amount, paymentStatus: "pending", metadata });
  return await payment.save();
};

const processPayment = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw { status: 404, message: "Payment record not found" };
  if (payment.paymentStatus !== "pending") throw { status: 400, message: "Payment already processed" };

  const successRate = Number(process.env.PAYMENT_SUCCESS_RATE || 0.8);
  const isSuccess = Math.random() <= successRate;
  payment.paymentStatus = isSuccess ? "success" : "failed";

  await payment.save();
  return payment;
};

const getPaymentById = async (paymentId) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw { status: 404, message: "Payment not found" };
  return payment;
};

const getPaymentsByOrderId = async (orderId) => {
  return await Payment.find({ orderId }).sort({ createdAt: -1 });
};

module.exports = {
  createPayment,
  processPayment,
  getPaymentById,
  getPaymentsByOrderId
};
