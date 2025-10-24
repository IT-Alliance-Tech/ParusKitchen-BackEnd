const mongoose = require('mongoose');
const Meal = require('../models/Meal');
const Category = require('../models/Category');

// Get all meals (with optional category filter by id or name)
exports.getMeals = async (req, res) => {

  console.log("Mealllll");
  
  try {
    const { category } = req.query;
    let filter = {};

    if (category) {
      if (mongoose.isValidObjectId(category)) {
        filter.category = category;
      } else {
        const cat = await Category.findOne({ name: { $regex: `^${category}$`, $options: 'i' } });
        if (!cat) return res.json([]);
        filter.category = cat._id;
      }
    }

    const meals = await Meal.find(filter).populate("category");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single meal by ID
exports.getMealById = async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id).populate("category");
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new meal (admin only)
exports.createMeal = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const meals = await Meal.insertMany(req.body);
      res.status(201).json(meals);
    } else {
      const meal = new Meal(req.body);
      await meal.save();
      res.status(201).json(meal);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update meal (admin only)
exports.updateMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json(meal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete meal (admin only)
exports.deleteMeal = async (req, res) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });
    res.json({ message: 'Meal deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
