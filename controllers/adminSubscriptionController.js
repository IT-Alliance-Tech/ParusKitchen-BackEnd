// backend/controllers/adminSubscriptionController.js
const SubscriptionPlan = require("../models/SubscriptionPlan");

// GET all subscriptions (admin)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await SubscriptionPlan.find();
    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET single subscription by ID (admin)
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await SubscriptionPlan.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: "Not found" });
    res.status(200).json(subscription);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// CREATE subscription (admin)
exports.createSubscription = async (req, res) => {
  try {
    const newPlan = new SubscriptionPlan(req.body);
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// UPDATE subscription (admin)
exports.updateSubscription = async (req, res) => {
  try {
    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlan) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updatedPlan);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// DELETE subscription (admin)
exports.deleteSubscription = async (req, res) => {
  try {
    const deletedPlan = await SubscriptionPlan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PAUSE/RESUME subscription (admin)
exports.updateSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "paused"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedPlan) return res.status(404).json({ message: "Not found" });
    res.status(200).json(updatedPlan);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
