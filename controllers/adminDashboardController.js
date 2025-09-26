const Order = require('../models/Order');
const Meal = require('../models/Meal');
const User = require('../models/User');

// Total orders
exports.getTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Total meals
exports.getTotalMeals = async (req, res) => {
  try {
    const totalMeals = await Meal.countDocuments();
    res.json({ totalMeals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Total users
exports.getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Total revenue (sum of all order totals)
exports.getRevenue = async (req, res) => {
  try {
    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;
    res.json({ totalRevenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

