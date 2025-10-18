require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ====================== MIDDLEWARE ======================
app.use(cors());
app.use(express.json());

// ====================== ROUTES ======================
// Meals
app.use('/api/meals', require('./routes/mealRoutes'));

// Categories
app.use('/api/categories', require('./routes/categoryRoutes'));

// Users
app.use('/api/users', require('./routes/userRoutes'));

// Orders
app.use('/api/orders', require('./routes/orderRoutes'));

// Cart
app.use('/api/cart', require('./routes/cartRoutes'));

// Reviews
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Admin Dashboard
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
app.use('/api/admin/dashboard', adminDashboardRoutes);

// Admin Subscription (for admin controls)
const adminSubscriptionRoutes = require('./routes/adminSubscriptionRoutes');
app.use('/api/admin/subscriptions', adminSubscriptionRoutes);

// Frontend Subscription (for general users to view plans)
const subscriptionRoutes = require('./routes/subscriptionRoutes');
app.use('/api/subscriptions', subscriptionRoutes);

// ====================== MONGODB CONNECTION ======================
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/paroose_kitchen';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ====================== BASIC ROUTE ======================
app.get('/', (req, res) => {
  res.send('Paroose Kitchen Backend is running 🚀');
});

// ====================== START SERVER ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
