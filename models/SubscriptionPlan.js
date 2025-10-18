const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },               // e.g., "Breakfast + Lunch + Dinner"
  price: { type: Number, required: true },             // e.g., 6500
  mealsIncluded: [{ type: String, required: true }],   // e.g., ["Breakfast", "Lunch", "Dinner"]
  deliveryAddOn: { type: Number, default: 500 },       // delivery fee
  isActive: { type: Boolean, default: true }           // active/inactive
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
