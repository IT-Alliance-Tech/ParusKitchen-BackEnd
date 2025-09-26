const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware");

// Add a review (only logged-in users)
router.post("/", auth, reviewController.createReview);

// Get all reviews for a meal
router.get("/:mealId", reviewController.getMealReviews);

module.exports = router;
