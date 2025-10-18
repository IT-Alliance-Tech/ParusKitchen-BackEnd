// backend/controllers/subscriptionController.js
const SubscriptionPlan = require("../models/SubscriptionPlan");

// GET all active subscriptions (for front-end users)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await SubscriptionPlan.find({ status: "active" });
    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET subscription by ID (for front-end users)
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await SubscriptionPlan.findById(req.params.id);
    if (!subscription || subscription.status !== "active")
      return res.status(404).json({ message: "Not found" });
    res.status(200).json(subscription);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
