const Cart = require('../models/Cart');
const Meal = require('../models/Meal');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Order = require('../models/Order');

// Helper: recalc total
function recalcTotal(cart) {
  return cart.items.reduce((s, it) => s + it.price * it.quantity, 0);
}

// GET /api/cart  — get current user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;
    let cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.meal',
        populate: { path: 'category', select: 'name' }
      })
      .populate({
        path: 'items.subscription'
      });
    if (!cart) return res.json({ items: [], totalAmount: 0 });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/cart  — add item to cart (body: { itemType: "meal"|"subscription", itemId, quantity })
exports.addItemToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemType, itemId, quantity = 1 } = req.body;

    if (!itemType || !itemId) {
      return res.status(400).json({ message: 'itemType and itemId required' });
    }

    let item;
    if (itemType === 'meal') {
      item = await Meal.findById(itemId);
      if (!item) return res.status(404).json({ message: 'Meal not found' });
    } else if (itemType === 'subscription') {
      item = await SubscriptionPlan.findById(itemId);
      if (!item) return res.status(404).json({ message: 'Subscription not found' });
    } else {
      return res.status(400).json({ message: 'Invalid itemType' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [], totalAmount: 0 });

    // Check if item already exists
    const idx = cart.items.findIndex(i =>
      (itemType === 'meal' && i.meal?.toString() === itemId) ||
      (itemType === 'subscription' && i.subscription?.toString() === itemId)
    );

    if (idx > -1) {
      // item exists -> increase quantity
      cart.items[idx].quantity += Number(quantity);
      cart.items[idx].price = item.price; // refresh snapshot price
    } else {
      const newItem = { quantity: Number(quantity), price: item.price };
      if (itemType === 'meal') newItem.meal = itemId;
      if (itemType === 'subscription') newItem.subscription = itemId;
      cart.items.push(newItem);
    }

    cart.totalAmount = recalcTotal(cart);
    await cart.save();

    cart = await cart
      .populate({ path: 'items.meal', populate: { path: 'category', select: 'name' } })
      .populate({ path: 'items.subscription' });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/cart  — update quantity for a cart item (body: { itemType, itemId, quantity })
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemType, itemId, quantity } = req.body;

    if (!itemType || !itemId || typeof quantity !== 'number') {
      return res.status(400).json({ message: 'itemType, itemId, and numeric quantity required' });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.find(i =>
      (itemType === 'meal' && i.meal?.toString() === itemId) ||
      (itemType === 'subscription' && i.subscription?.toString() === itemId)
    );

    if (!item) return res.status(404).json({ message: 'Item not in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i =>
        !((itemType === 'meal' && i.meal?.toString() === itemId) ||
          (itemType === 'subscription' && i.subscription?.toString() === itemId))
      );
    } else {
      item.quantity = quantity;
    }

    cart.totalAmount = recalcTotal(cart);
    await cart.save();

    const populated = await cart
      .populate({ path: 'items.meal', populate: { path: 'category', select: 'name' } })
      .populate({ path: 'items.subscription' });

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart/:itemType/:itemId — remove a specific item
exports.removeItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemType, itemId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(i =>
      !((itemType === 'meal' && i.meal?.toString() === itemId) ||
        (itemType === 'subscription' && i.subscription?.toString() === itemId))
    );

    cart.totalAmount = recalcTotal(cart);
    await cart.save();

    const populated = await cart
      .populate({ path: 'items.meal', populate: { path: 'category', select: 'name' } })
      .populate({ path: 'items.subscription' });

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart — clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId;
    await Cart.findOneAndDelete({ user: userId });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/cart/checkout — create an order from the cart and clear the cart
exports.checkout = async (req, res) => {
  try {
    const userId = req.userId;
    const { deliveryAddress = '', paymentMethod = 'cod' } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items.length) return res.status(400).json({ message: 'Cart is empty' });

    const orderItems = cart.items.map(i => ({
      meal: i.meal,
      subscription: i.subscription,
      quantity: i.quantity,
      price: i.price
    }));

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'pending' : 'pending'
    });

    await order.save();
    await Order.populate(order, [
      { path: 'items.meal', populate: { path: 'category', select: 'name' } },
      { path: 'items.subscription' }
    ]);

    // clear cart
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
