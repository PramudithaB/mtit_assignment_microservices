const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../config/services.config");
const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: services.reviews,
    changeOrigin: true,
    pathRewrite: { "^/": "/api/reviews/" },
    logLevel: "silent"
  })
);

module.exports = router;
