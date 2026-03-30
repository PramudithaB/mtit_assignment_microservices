const reviewService = require("../services/reviewService");

const addReview = async (req, res, next) => {
  try {
    const created = await reviewService.addReview(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

const getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await reviewService.getReviewsByProductId(req.params.productId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getReviewsByProduct
};
