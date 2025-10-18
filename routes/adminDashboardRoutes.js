const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const auth = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// ✅ Protect all routes
router.use(auth);
router.use(adminMiddleware);

// ✅ Dashboard stats
router.get('/total-orders', adminDashboardController.getTotalOrders);
router.get('/total-meals', adminDashboardController.getTotalMeals);
router.get('/total-users', adminDashboardController.getTotalUsers);
router.get('/revenue', adminDashboardController.getRevenue);

// ✅ User management
router.get('/users', adminDashboardController.getAllUsers);
router.put('/users/:id', adminDashboardController.updateUser);
router.delete('/users/:id', adminDashboardController.deleteUser);

// ✅ Meals management (admin only)
router.get('/meals', auth, adminMiddleware, adminDashboardController.getAllMealsForAdmin);

// ✅ ADDITION: Orders route (required by frontend)
router.get('/orders', adminDashboardController.getAllOrders); // <-- NEW

// ✅ ADDITION: Menus management routes (for menu CRUD in admin)
router.get('/menus', adminDashboardController.getAllMenus); // <-- NEW
router.post('/menus', adminDashboardController.addMenuItem); // <-- NEW
router.put('/menus/:id', adminDashboardController.updateMenuItem); // <-- NEW
router.delete('/menus/:id', adminDashboardController.deleteMenuItem); // <-- NEW
// Get all orders
router.get('/orders', adminDashboardController.getAllOrders);

router.post('/subscriptions', adminDashboardController.createSubscriptions);


module.exports = router;
