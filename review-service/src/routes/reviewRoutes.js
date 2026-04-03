const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     summary: Add a review for a product
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               userId:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Review created
 */
router.post("/", reviewController.addReview);

/**
 * @openapi
 * /api/reviews/{productId}:
 *   get:
 *     summary: Get reviews for a product
 *     tags:
 *       - Reviews
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of reviews
 */
router.get("/:productId", reviewController.getReviewsByProduct);

module.exports = router;
