const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
