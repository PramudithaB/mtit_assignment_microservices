const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/payment-service";
    await mongoose.connect(mongoUri);
    console.log("Payment Service MongoDB connected");
  } catch (error) {
    console.error("Payment Service MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
