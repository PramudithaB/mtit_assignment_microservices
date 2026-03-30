const Review = require("../models/reviewModel");

const addReview = async (reviewData) => {
  const review = new Review(reviewData);
  return await review.save();
};

const getReviewsByProductId = async (productId) => {
  return await Review.find({ productId })
    .sort({ createdAt: -1 })
    .lean()
    .exec();
};

module.exports = {
  addReview,
  getReviewsByProductId
};
