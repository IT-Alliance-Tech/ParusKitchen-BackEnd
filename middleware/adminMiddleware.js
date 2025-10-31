// middleware/adminMiddleware.js
module.exports = (req, res, next) => {
  // Allow both 'admin' and 'superadmin' roles to access admin routes
  if (req.userRole !== "admin" && req.userRole !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
