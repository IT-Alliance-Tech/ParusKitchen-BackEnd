// controllers/adminDashboardController.js
const Order = require('../models/Order');
const Meal = require('../models/Meal');
const User = require('../models/User');
const Subscription = require('../models/SubscriptionPlan');
// =======================
// TOTAL STATS
// =======================

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

// =======================
// USER MANAGEMENT (ADMIN)
// =======================

// Get all users (excluding password)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a user
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

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// ADMIN MEAL MANAGEMENT
// =======================

// Get all meals for admin
exports.getAllMealsForAdmin = async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single meal by ID
exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: "Meal not found" });
    res.json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new meal
exports.createMeal = async (req, res) => {
  try {
    const { name, category, ingredients, options, price, subscriptionPlan, special, imageUrl, rotationalDay } = req.body;

    if (!name || !category || !ingredients || !options || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMeal = new Meal({
      name,
      category,
      ingredients,
      options,
      price,
      subscriptionPlan,
      special: special || false,
      imageUrl,
      rotationalDay
    });

    await newMeal.save();
    res.status(201).json({ message: "Meal created successfully", meal: newMeal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a meal
exports.updateMeal = async (req, res) => {
  try {
    const { name, category, ingredients, options, price, subscriptionPlan, special, imageUrl, rotationalDay } = req.body;
    const meal = await Meal.findById(req.params.id);
    if (!meal) return res.status(404).json({ message: "Meal not found" });

    if (name) meal.name = name;
    if (category) meal.category = category;
    if (ingredients) meal.ingredients = ingredients;
    if (options) meal.options = options;
    if (price) meal.price = price;
    if (subscriptionPlan) meal.subscriptionPlan = subscriptionPlan;
    if (special !== undefined) meal.special = special;
    if (imageUrl) meal.imageUrl = imageUrl;
    if (rotationalDay) meal.rotationalDay = rotationalDay;

    await meal.save();
    res.json({ message: "Meal updated successfully", meal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a meal
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) return res.status(404).json({ message: "Meal not found" });
    res.json({ message: "Meal deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// ORDERS
// =======================

// Get all orders (real implementation)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error.message);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// =======================
// MENU PLACEHOLDER FUNCTIONS (keep as-is for now)
// =======================

// Get all menus
exports.getAllMenus = async (req, res) => {
  try {
    res.status(200).json({ message: "getAllMenus placeholder — working fine" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new menu item
exports.addMenuItem = async (req, res) => {
  try {
    res.status(200).json({ message: "addMenuItem placeholder — working fine" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    res.status(200).json({ message: "updateMenuItem placeholder — working fine" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    res.status(200).json({ message: "deleteMenuItem placeholder — working fine" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Create one or multiple subscriptions
exports.createSubscriptions = async (req, res) => {
  try {
    const data = req.body;

    // Check if body is an array or a single object
    const subscriptionsArray = Array.isArray(data) ? data : [data];

    const createdSubscriptions = [];

    for (let sub of subscriptionsArray) {
      const { name, price, mealsIncluded, deliveryAddOn } = sub;

      if (!name || !price || !mealsIncluded) {
        return res.status(400).json({ message: "Missing required fields in one of the subscriptions" });
      }

      const newSub = new Subscription({
        name,
        price,
        mealsIncluded,
        deliveryAddOn: deliveryAddOn || 0
      });

      await newSub.save();
      createdSubscriptions.push(newSub);
    }

    res.status(201).json({ message: "Subscriptions created successfully", subscriptions: createdSubscriptions });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};