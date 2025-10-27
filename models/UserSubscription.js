// backend/models/UserSubscription.js
const mongoose = require("mongoose");

const userSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    planName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // in days
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    remainingDays: {
      type: Number,
      default: 0,
    },
    mealsIncluded: [
      {
        mealName: String,
        deliveryDate: Date,
      },
    ],
    paymentHistory: [
      {
        amount: Number,
        date: Date,
        invoiceUrl: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserSubscription", userSubscriptionSchema);
