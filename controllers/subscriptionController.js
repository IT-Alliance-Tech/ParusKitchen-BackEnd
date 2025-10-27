const SubscriptionPlan = require("../models/SubscriptionPlan");
const Subscription = require("../models/SubscriptionPlan"); // Your model file name
const mongoose = require("mongoose");

// ====================== GET ALL ACTIVE SUBSCRIPTIONS ======================
exports.getAllSubscriptions = async (req, res) => {
  console.log("Fetching all active subscriptions...");
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

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
    if (!subscription || subscription.status !== "active")
      return res.status(404).json({ message: "Subscription not found" });
    res.status(200).json(subscription);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ====================== CREATE NEW SUBSCRIPTION ======================
exports.createSubscription = async (req, res) => {
  try {
    const { user, planName, price, duration, startDate, endDate, status } = req.body;

    if (!user || !planName || !price || !duration) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newSubscription = new Subscription({
      user: new mongoose.Types.ObjectId(user),
      planName,
      price,
      duration,
      startDate: startDate || new Date(),
      endDate:
        endDate ||
        new Date(new Date().setDate(new Date().getDate() + duration)),
      status: status || "active",
    });

    await newSubscription.save();

    res.status(201).json({
      message: "Subscription added successfully",
      subscription: newSubscription,
    });
  } catch (err) {
    console.error("❌ Error creating subscription:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
