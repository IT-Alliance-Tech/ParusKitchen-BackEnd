const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal' },
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true } // snapshot price when added
}, { _id: false }); // optional: prevents Mongoose from creating _id for each item

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
