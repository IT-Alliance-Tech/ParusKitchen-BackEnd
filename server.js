require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin/dashboard', require('./routes/adminDashboardRoutes'));
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
app.use('/api/admin', adminDashboardRoutes);


// Commented out because file doesn't exist
// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/admin", adminRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/paroose_kitchen';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.send('Paroose Kitchen Backend is running 🚀');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
