// backend/models/SubscriptionPlan.js
const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: {
      monthly: { type: Number, required: true },
      weekly: { type: Number, required: true },
    },
    originalPrice: {
      monthly: { type: Number },
      weekly: { type: Number },
    },
    meals: { type: String },
    features: [{ type: String }],
    popular: { type: Boolean, default: false },
    color: { type: String, default: "gray" },
    status: { type: String, enum: ["active", "paused"], default: "active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
