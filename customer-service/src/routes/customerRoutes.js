const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", customerController.register);
router.post("/login", customerController.login);
router.get("/profile", protect, customerController.profile);

module.exports = router;
