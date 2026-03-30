const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createCart);
router.get("/carts/:customerId", orderController.getCartByCustomer);
router.post("/carts/:cartId/items", orderController.addItem);
router.patch("/carts/:cartId/items/:itemId", orderController.updateItem);
router.delete("/carts/:cartId/items/:itemId", orderController.removeItem);
router.post("/checkout", orderController.checkout);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrder);
router.put("/:id", orderController.updateStatus);
router.patch("/:id/status", orderController.updateStatus); // backward-compatible route

module.exports = router;
