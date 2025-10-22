// backend/controllers/subscriptionController.js
const SubscriptionPlan = require("../models/SubscriptionPlan");

// GET all active subscriptions (for front-end users)
exports.getAllSubscriptions = async (req, res) => {
  console.log("Subscription successfull")
 res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
res.setHeader("Pragma", "no-cache");
res.setHeader("Expires", "0");
res.setHeader("Surrogate-Control", "no-store");
  try {
    const subscriptions = await SubscriptionPlan.find({ isActive: true });
    console.log(subscriptions)
    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET all add-ons (for front-end users)
exports.getAllAddOns = async (req, res) => {
  try {
    const addOns = await SubscriptionPlan.find({ type: "addon",isActive : true });
    res.status(200).json(addOns);
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