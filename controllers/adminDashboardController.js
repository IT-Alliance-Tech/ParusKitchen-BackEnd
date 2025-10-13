// controllers/adminDashboardController.js
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

// Total revenue
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

// Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update any user (admin)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a user (admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
