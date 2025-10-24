const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageURL: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true, collection: 'meals' });

module.exports = mongoose.model('Meal', mealSchema);
;
