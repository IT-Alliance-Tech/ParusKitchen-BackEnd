const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2) return res.status(401).json({ message: 'Invalid auth format' });

    const [scheme, token] = parts;
    if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Invalid auth format' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    // Fetch user from DB to get role
    const user = await User.findById(decoded.userId).select('role email');
    if (!user) return res.status(404).json({ message: 'User not found' });

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    req.userRole = user.role || 'user'; // ✅ default role is 'user'

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

