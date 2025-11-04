require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminUserSubscriptionRoutes = require("./routes/adminUserSubscriptionRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");





const app = express();

// ====================== MIDDLEWARE ======================
app.use(cors());
app.use(express.json());


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
connectDB().then(() => {

// ====================== ROUTES ======================
// Add this line before other routes
app.use('/api/dashboard', dashboardRoutes);
  // Auth (forgot/reset password)
  app.use('/api/auth', require('./routes/authRoutes'));
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
app.use('/api/admin/dashboard', require('./routes/adminDashboardRoutes'));

// Admin Subscriptions
app.use('/api/admin/subscriptions', require('./routes/adminSubscriptionRoutes'));

// Frontend Subscriptions (for users)
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

app.use("/api/admin/user-subscriptions", adminUserSubscriptionRoutes);


app.use("/api/superadmin", superAdminRoutes);


})

// ====================== MONGODB CONNECTION ======================
// const MONGO_URI = process.env.MONGO_URI;
// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => console.error('❌ MongoDB connection error:', err));

// ====================== BASIC ROUTE ======================
app.get('/', (req, res) => {
  res.send('Paroose Kitchen Backend is running 🚀');
});

// ====================== START SERVER ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("Connected DB:", mongoose.connection.name);

});
