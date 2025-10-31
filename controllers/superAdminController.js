const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create a new admin user
exports.createAdminUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin user created successfully", user: newAdmin });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
