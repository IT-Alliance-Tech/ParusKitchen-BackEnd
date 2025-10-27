const User = require('../models/User');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const UserSubscription = require('../models/UserSubscription');
const Order = require('../models/Order');
const Menu = require('../models/Meal');

// Helper: Calculate remaining days
function getRemainingDays(endDate) {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end - today;
  return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
}

// ✅ GET /dashboard/current-subscription
exports.getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;

    const subscription = await UserSubscription.findOne({ user: userId })
      .populate('plan');

    if (!subscription)
      return res.status(404).json({ message: 'No active subscription found' });

    res.json({
      planName: subscription.planName || subscription.plan?.name,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      remainingDays: getRemainingDays(subscription.endDate),
      price: subscription.price,
      duration: subscription.duration,
      status: subscription.status,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET /dashboard/upcoming-menu
exports.getUpcomingMenu = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const subscription = await UserSubscription.findOne({ user: userId }).populate('plan');

    if (!subscription)
      return res.status(404).json({ message: 'No active subscription found' });

    const menus = await Menu.find({
      date: { $gte: new Date() },
      planType: subscription.planName || subscription.plan?.name,
    }).sort('date');

    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ POST /dashboard/subscription/pause
exports.pauseSubscription = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const subscription = await UserSubscription.findOne({ user: userId });
    if (!subscription)
      return res.status(404).json({ message: 'Subscription not found' });

    subscription.status = 'paused';
    await subscription.save();

    res.json({ status: subscription.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ POST /dashboard/subscription/resume
exports.resumeSubscription = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const subscription = await UserSubscription.findOne({ user: userId });
    if (!subscription)
      return res.status(404).json({ message: 'Subscription not found' });

    subscription.status = 'active';
    await subscription.save();

    res.json({ status: subscription.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ POST /dashboard/subscription/cancel
exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const subscription = await UserSubscription.findOne({ user: userId });
    if (!subscription)
      return res.status(404).json({ message: 'Subscription not found' });

    subscription.status = 'cancelled';
    await subscription.save();

    res.json({ status: subscription.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ POST /dashboard/subscription/renew
exports.renewSubscription = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const subscription = await UserSubscription.findOne({ user: userId }).populate('plan');
    if (!subscription)
      return res.status(404).json({ message: 'Subscription not found' });

    const newStartDate = new Date();
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + subscription.duration);

    subscription.status = 'active';
    subscription.startDate = newStartDate;
    subscription.endDate = newEndDate;
    await subscription.save();

    res.json({
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET /dashboard/invoices
exports.getInvoices = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const orders = await Order.find({ user: userId }).sort('-createdAt');

    const invoices = orders.map((order) => ({
      date: order.createdAt,
      amount: order.totalAmount,
      invoiceLink: `/invoices/${order._id}`,
    }));

    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ PUT /dashboard/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.userId;
    const { name, phone, address } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
