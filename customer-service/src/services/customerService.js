const Customer = require("../models/customerModel");
const jwt = require("jsonwebtoken");

const generateToken = (customer) => {
  const payload = { id: customer._id };
  return jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
};

const registerCustomer = async ({ name, email, password }) => {
  const exists = await Customer.findOne({ email });
  if (exists) throw { status: 400, message: "Email already registered" };

  const customer = await Customer.create({ name, email, password });
  return {
    _id: customer._id,
    name: customer.name,
    email: customer.email,
    token: generateToken(customer),
  };
};

const loginCustomer = async ({ email, password }) => {
  const customer = await Customer.findOne({ email });
  if (!customer || !(await customer.matchPassword(password))) {
    throw { status: 401, message: "Invalid email or password" };
  }
  return {
    _id: customer._id,
    name: customer.name,
    email: customer.email,
    token: generateToken(customer),
  };
};

const getCustomerById = async (id) => {
  const customer = await Customer.findById(id).select("-password");
  if (!customer) throw { status: 404, message: "Customer not found" };
  return customer;
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerById,
};
