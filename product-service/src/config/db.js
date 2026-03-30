const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/product-service";
    await mongoose.connect(mongoUri);
    console.log("Product Service MongoDB connected");
  } catch (error) {
    console.error("Product Service MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
