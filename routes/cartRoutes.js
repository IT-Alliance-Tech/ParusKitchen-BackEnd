const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

// ✅ Get all cart items
router.get('/', auth, cartController.getCart);

// ✅ Add an item (meal or subscription)
router.post('/', auth, cartController.addItemToCart);

// ✅ Update item quantity
router.put('/', auth, cartController.updateCartItem);

// ⚠️ Fixed: remove by both itemType and itemId
router.delete('/:itemType/:itemId', auth, cartController.removeItem);

// ✅ Clear entire cart
router.delete('/', auth, cartController.clearCart);

// ✅ Checkout (create order and clear cart)
router.post('/checkout', auth, cartController.checkout);

module.exports = router;
