// backend/routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

// ====================== USER-FACING SUBSCRIPTIONS ======================

// Get all active subscription plans
router.get("/", subscriptionController.getAllSubscriptions);

// Get all add-ons
router.get("/addons", subscriptionController.getAllAddOns);

// Get a specific subscription by ID
router.get("/:id", subscriptionController.getSubscriptionById);

module.exports = router;