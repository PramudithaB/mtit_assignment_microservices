const express = require("express");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const productRoute = require("./routes/productRoute");
const customerRoute = require("./routes/customerRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const reviewRoute = require("./routes/reviewRoute");

const app = express();

app.use("/api/products", productRoute);
app.use("/api/customers", customerRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/reviews", reviewRoute);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
