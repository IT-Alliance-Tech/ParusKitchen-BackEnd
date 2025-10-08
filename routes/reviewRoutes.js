const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/authMiddleware");

// Add a review (only logged-in users)
router.post("/", auth, reviewController.createReview);

// Get reviews for a specific meal (public)
router.get("/:mealId", reviewController.getMealReviews);

// Get all reviews (public)
router.get("/", reviewController.getAllReviews);

module.exports = router;
