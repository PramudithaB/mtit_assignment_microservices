const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services.config");
const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: services.orders,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/orders/" },
    logLevel: "silent"
  })
);

module.exports = router;
