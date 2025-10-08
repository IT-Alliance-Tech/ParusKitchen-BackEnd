const Review = require("../models/Review");
const Meal = require("../models/Meal");

// Create a new review (only logged-in users)
exports.createReview = async (req, res) => {
  try {
    const { mealId, rating, comment } = req.body;
    const userId = req.userId; // from auth middleware

    if (!mealId || !rating) {
      return res.status(400).json({ message: "Meal ID and rating are required" });
    }

    // Check if meal exists
    const meal = await Meal.findById(mealId);
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }

    // Prevent multiple reviews from same user for the same meal
    const existingReview = await Review.findOne({ user: userId, meal: mealId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this meal" });
    }

    const review = new Review({
      user: userId,
      meal: mealId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reviews for a specific meal (public)
exports.getMealReviews = async (req, res) => {
  try {
    const mealId = req.params.mealId;

    const reviews = await Review.find({ meal: mealId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reviews (public)
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .populate("meal", "name"); // optional: show meal name
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
