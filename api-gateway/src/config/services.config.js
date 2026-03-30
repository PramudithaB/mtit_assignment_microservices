const services = {
  products: process.env.PRODUCT_SERVICE_URL || "http://localhost:4001",
  customers: process.env.CUSTOMER_SERVICE_URL || "http://localhost:4002",
  orders: process.env.ORDER_SERVICE_URL || "http://localhost:4003",
  payments: process.env.PAYMENT_SERVICE_URL || "http://localhost:4004",
  reviews: process.env.REVIEW_SERVICE_URL || "http://localhost:4005"
};

module.exports = services;
