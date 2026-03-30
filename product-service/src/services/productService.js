const Product = require("../models/productModel");

const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

const getAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 });
};

const getProductById = async (id) => {
  return await Product.findById(id);
};

const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
};

const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
