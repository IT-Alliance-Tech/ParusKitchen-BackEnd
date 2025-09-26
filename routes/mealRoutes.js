const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const auth = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public routes (anyone can view meals)
router.get('/', mealController.getMeals);
router.get('/:id', mealController.getMealById);

// Admin-only routes
router.post('/', auth, adminMiddleware, mealController.createMeal);
router.put('/:id', auth, adminMiddleware, mealController.updateMeal);
router.delete('/:id', auth, adminMiddleware, mealController.deleteMeal);

// Optional: Delete all meals (temporary, admin only)
router.delete('/', auth, adminMiddleware, async (req, res) => {
  try {
    await require('../models/Meal').deleteMany({});
    res.json({ message: 'All meals deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
