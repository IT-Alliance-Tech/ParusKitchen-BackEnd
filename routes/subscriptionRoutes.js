// backend/routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");

// ====================== USER-FACING SUBSCRIPTIONS ======================
router.get("/", subscriptionController.getAllSubscriptions);
router.get("/addons", subscriptionController.getAllAddOns);
router.get("/:id", subscriptionController.getSubscriptionById);

// ====================== TESTING: CREATE USER SUBSCRIPTION ======================
router.post("/user-subscriptions", subscriptionController.createUserSubscription);

module.exports = router;
