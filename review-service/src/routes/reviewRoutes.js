const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.post("/", reviewController.addReview);
router.get("/:productId", reviewController.getReviewsByProduct);

module.exports = router;
