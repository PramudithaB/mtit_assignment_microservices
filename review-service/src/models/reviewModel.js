const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product"
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Customer"
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"]
    },
    comment: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
