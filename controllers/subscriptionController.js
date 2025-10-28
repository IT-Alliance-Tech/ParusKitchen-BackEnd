// backend/controllers/subscriptionController.js
const SubscriptionPlan = require("../models/SubscriptionPlan");
const UserSubscription = require("../models/UserSubscription");

// ====================== GET ALL ACTIVE SUBSCRIPTIONS ======================
exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await SubscriptionPlan.find({ isActive: true });
    res.status(200).json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ====================== GET ALL ADD-ONS ======================
exports.getAllAddOns = async (req, res) => {
  try {
    const addOns = await SubscriptionPlan.find({ type: "addon", isActive: true });
    res.status(200).json(addOns);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ====================== GET SUBSCRIPTION BY ID ======================
exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await SubscriptionPlan.findById(req.params.id);
    if (!subscription || !subscription.isActive)
      return res.status(404).json({ message: "Subscription not found" });

    res.status(200).json(subscription);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ====================== CREATE USER SUBSCRIPTION (Manual for Testing) ======================
exports.createUserSubscription = async (req, res) => {
  try {
    const { user, plan, planName, price, duration, startDate, endDate, remainingDays, status } = req.body;

    // Check required fields
    if (!user || !plan || !planName || !price || !duration || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new UserSubscription document
    const newUserSub = new UserSubscription({
      user,
      plan,
      planName,
      price,
      duration,
      startDate,
      endDate,
      remainingDays,
      status: status || "active",
    });

    await newUserSub.save();
    res.status(201).json({
      message: "User subscription created successfully",
      subscription: newUserSub,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
