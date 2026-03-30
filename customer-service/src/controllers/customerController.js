const customerService = require("../services/customerService");

const register = async (req, res, next) => {
  try {
    const result = await customerService.registerCustomer(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await customerService.loginCustomer(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const customer = await customerService.getCustomerById(req.customer.id);
    res.json(customer);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, profile };
