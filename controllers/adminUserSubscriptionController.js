// backend/controllers/adminUserSubscriptionController.js
const UserSubscription = require("../models/UserSubscription");

// ✅ GET all user subscriptions (admin view)
exports.getAllUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await UserSubscription.find()
      .populate("user", "name email")
      .populate("plan", "name price");
    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ GET single user subscription by ID
exports.getUserSubscriptionById = async (req, res) => {
  try {
    const subscription = await UserSubscription.findById(req.params.id)
      .populate("user", "name email")
      .populate("plan", "name price");
    if (!subscription) return res.status(404).json({ message: "Not found" });
    res.status(200).json(subscription);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ UPDATE a user subscription (edit details)
exports.updateUserSubscription = async (req, res) => {
  try {
    const updatedSubscription = await UserSubscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("user", "name email")
      .populate("plan", "name price");

    if (!updatedSubscription)
      return res.status(404).json({ message: "Subscription not found" });

    res.status(200).json(updatedSubscription);
  } catch (err) {
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
};

// ✅ CHANGE STATUS (pause / resume / cancel)
exports.changeUserSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "paused", "cancelled"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const subscription = await UserSubscription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("plan", "name");

    if (!subscription)
      return res.status(404).json({ message: "Subscription not found" });

    res.status(200).json({
      message: `Subscription ${status} successfully`,
      subscription,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ DELETE a user subscription
exports.deleteUserSubscription = async (req, res) => {
  try {
    const deleted = await UserSubscription.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Subscription not found" });

    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
