// backend/routes/adminUserSubscriptionRoutes.js
const express = require("express");
const router = express.Router();
const adminUserSubscriptionController = require("../controllers/adminUserSubscriptionController");
const auth = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Only admin can access these routes
router.use(auth);
router.use(adminMiddleware);

// Routes
router.get("/", adminUserSubscriptionController.getAllUserSubscriptions);
router.get("/:id", adminUserSubscriptionController.getUserSubscriptionById);
router.put("/:id", adminUserSubscriptionController.updateUserSubscription);
router.patch("/:id/status", adminUserSubscriptionController.changeUserSubscriptionStatus);
router.delete("/:id", adminUserSubscriptionController.deleteUserSubscription);

module.exports = router;
