const Order = require('../models/Order');
const Meal = require('../models/Meal');

// Create a new order (protected)
exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, deliveryAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain items' });
    }

    // get meal docs for given IDs
    const mealIds = items.map(i => i.meal);
    const meals = await Meal.find({ _id: { $in: mealIds } });

    // map mealId -> price
    const priceMap = {};
    meals.forEach(m => { priceMap[m._id.toString()] = m.price; });

    let total = 0;
    const orderItems = items.map(i => {
      const mealId = i.meal;
      const qty = i.quantity && i.quantity > 0 ? i.quantity : 1;
      const price = priceMap[mealId];
      if (price === undefined) throw new Error(`Meal not found: ${mealId}`);
      total += price * qty;
      return { meal: mealId, quantity: qty, price };
    });

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount: total,
      deliveryAddress: deliveryAddress || '',
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: (paymentMethod === 'online') ? 'pending' : 'pending'
    });

    await order.save();
    await order.populate('items.meal');

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get orders for logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.meal',
        populate: {
          path: 'category',
          select: 'name description'
        }
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single order details (only owner)
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'items.meal',
        populate: {
          path: 'category',
          select: 'name description'
        }
      })
      .populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};