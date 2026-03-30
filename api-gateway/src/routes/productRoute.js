const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services.config");
const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: services.products,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/products/" },
    logLevel: "silent"
  })
);

module.exports = router;
