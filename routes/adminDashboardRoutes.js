const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const auth = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Protect all routes
router.use(auth);
router.use(adminMiddleware);

// Dashboard stats
router.get('/total-orders', adminDashboardController.getTotalOrders);
router.get('/total-meals', adminDashboardController.getTotalMeals);
router.get('/total-users', adminDashboardController.getTotalUsers);
router.get('/revenue', adminDashboardController.getRevenue);

// User management
router.get('/users', adminDashboardController.getAllUsers);
router.put('/users/:id', adminDashboardController.updateUser);
router.delete('/users/:id', adminDashboardController.deleteUser);

module.exports = router;
