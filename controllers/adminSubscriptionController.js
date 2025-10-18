const SubscriptionPlan = require('../models/SubscriptionPlan');

// Get all subscription plans
exports.getAllSubscriptions = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get subscription plan by ID
exports.getSubscriptionById = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Subscription plan not found" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new subscription plan
exports.createSubscription = async (req, res) => {
  try {
    const { name, price, mealsIncluded, deliveryAddOn } = req.body;
    if (!name || !price || !mealsIncluded) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPlan = new SubscriptionPlan({ name, price, mealsIncluded, deliveryAddOn });
    await newPlan.save();
    res.status(201).json({ message: "Subscription plan created successfully", plan: newPlan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a subscription plan
exports.updateSubscription = async (req, res) => {
  try {
    const { name, price, mealsIncluded, deliveryAddOn, isActive } = req.body;
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Subscription plan not found" });

    if (name) plan.name = name;
    if (price) plan.price = price;
    if (mealsIncluded) plan.mealsIncluded = mealsIncluded;
    if (deliveryAddOn !== undefined) plan.deliveryAddOn = deliveryAddOn;
    if (isActive !== undefined) plan.isActive = isActive;

    await plan.save();
    res.json({ message: "Subscription plan updated successfully", plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete / deactivate a subscription plan
exports.deleteSubscription = async (req, res) => {
  try {
    const plan = await SubscriptionPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Subscription plan not found" });

    plan.isActive = false; // just deactivate instead of deleting
    await plan.save();
    res.json({ message: "Subscription plan deactivated successfully", plan });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
