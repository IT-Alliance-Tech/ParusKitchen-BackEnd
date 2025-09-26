const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  meal: { type: mongoose.Schema.Types.ObjectId, ref: 'Meal', required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true } // snapshot price
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'],
    default: 'pending'
  },
  deliveryAddress: String,
  paymentMethod: String, // e.g. "cod", "online"
  paymentStatus: { type: String, enum: ['pending','paid','failed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
