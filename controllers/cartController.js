const Cart = require('../models/Cart');
const Meal = require('../models/Meal');
const Order = require('../models/Order');

// Helper: recalc total
function recalcTotal(cart) {
  return cart.items.reduce((s, it) => s + (it.price * it.quantity), 0);
}

// GET /api/cart  — get current user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    let cart = await Cart.findOne({ user: userId }).populate({
      path: 'items.meal',
      populate: { path: 'category', select: 'name' }
    });
    if (!cart) return res.json({ items: [], totalAmount: 0 });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/cart  — add item to cart (body: { meal: "<id>", quantity: number })
exports.addItemToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { meal: mealId, quantity = 1 } = req.body;
    if (!mealId) return res.status(400).json({ message: 'meal id required' });

    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ message: 'Meal not found' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [], totalAmount: 0 });

    const idx = cart.items.findIndex(i => i.meal.toString() === mealId);
    if (idx > -1) {
      // item exists -> increase quantity
      cart.items[idx].quantity += Number(quantity);
      cart.items[idx].price = meal.price; // refresh snapshot price
    } else {
      cart.items.push({ meal: mealId, quantity: Number(quantity), price: meal.price });
    }

    cart.totalAmount = recalcTotal(cart);
    await cart.save();

    cart = await cart.populate({ path: 'items.meal', populate: { path: 'category', select: 'name' } });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/cart  — update quantity for a meal (body: { meal: "<id>", quantity: n })
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { meal: mealId, quantity } = req.body;
    if (!mealId || typeof quantity !== 'number') return res.status(400).json({ message: 'meal and numeric quantity required' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i => i.meal.toString() === mealId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.meal.toString() !== mealId);
    } else {
      item.quantity = quantity;
    }

    cart.totalAmount = recalcTotal(cart);
    await cart.save();

    const populated = await cart.populate({ path: 'items.meal', populate: { path: 'category', select: 'name' } });
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart/:id  — remove an item by meal id
exports.removeItem = async (req, res) => {
  try {
    const userId = req.userId;
    const mealId = req.params.id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i => i.meal.toString() !== mealId);
    cart.totalAmount = recalcTotal(cart);
    await cart.save();

    const populated = await cart.populate({ path: 'items.meal', populate: { path: 'category', select: 'name' } });
    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart  — clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    await Cart.findOneAndDelete({ user: userId });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/cart/checkout  — create an order from the cart and clear the cart
exports.checkout = async (req, res) => {
  try {
    const userId = req.userId;
    const { deliveryAddress = '', paymentMethod = 'cod' } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart is empty' });

    const orderItems = cart.items.map(i => ({ meal: i.meal, quantity: i.quantity, price: i.price }));
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'pending' : 'pending'
    });

    await order.save();
    await Order.populate(order, { path: 'items.meal', populate: { path: 'category', select: 'name' } });

    // clear cart
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

