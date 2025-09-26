const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const auth = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Total orders
router.get('/total-orders', auth, adminMiddleware, adminDashboardController.getTotalOrders);

// Total meals
router.get('/total-meals', auth, adminMiddleware, adminDashboardController.getTotalMeals);

// Total users
router.get('/total-users', auth, adminMiddleware, adminDashboardController.getTotalUsers);

// Optional: Revenue stats
router.get('/revenue', auth, adminMiddleware, adminDashboardController.getRevenue);


module.exports = router;
