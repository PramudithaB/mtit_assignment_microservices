const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  imageUrl: { type: String, default: "" }
});

const cartSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    items: [cartItemSchema],
    totalPrice: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "checkedout"], default: "active" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
