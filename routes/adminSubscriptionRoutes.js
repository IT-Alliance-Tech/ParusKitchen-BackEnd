// backend/routes/adminSubscriptionRoutes.js
const express = require("express");
const router = express.Router();
const adminSubscriptionController = require("../controllers/adminSubscriptionController");
const auth = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Protect all routes — only admin
router.use(auth);
router.use(adminMiddleware);

router.get("/", adminSubscriptionController.getAllSubscriptions);
router.get("/:id", adminSubscriptionController.getSubscriptionById);
router.post("/", adminSubscriptionController.createSubscription);
router.put("/:id", adminSubscriptionController.updateSubscription);
router.delete("/:id", adminSubscriptionController.deleteSubscription);
router.patch("/:id/status", adminSubscriptionController.updateSubscriptionStatus);

module.exports = router;
