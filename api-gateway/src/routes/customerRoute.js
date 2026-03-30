const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services.config");
const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: services.customers,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/customers/" },
    logLevel: "silent"
  })
);

module.exports = router;
