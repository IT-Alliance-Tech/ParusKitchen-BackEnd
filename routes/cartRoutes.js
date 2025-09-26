const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

// get cart
router.get('/', auth, cartController.getCart);

// add item
router.post('/', auth, cartController.addItemToCart);

// update item quantity
router.put('/', auth, cartController.updateCartItem);

// remove by meal id
router.delete('/:id', auth, cartController.removeItem);

// clear cart
router.delete('/', auth, cartController.clearCart);

// checkout (create order and clear cart)
router.post('/checkout', auth, cartController.checkout);

module.exports = router;
