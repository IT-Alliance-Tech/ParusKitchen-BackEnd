const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware'); // 👈 imported as auth

// Create order (user must be logged in)
router.post('/', auth, orderController.createOrder);

// Get orders of logged-in user
router.get('/', auth, orderController.getUserOrders);

// Get purchase history for logged-in user
router.get('/history', auth, orderController.getUserOrders);

// Get a single order by id (only owner)
router.get('/:id', auth, orderController.getOrderById);

module.exports = router;
