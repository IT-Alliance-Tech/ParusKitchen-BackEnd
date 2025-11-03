const crypto = require('crypto');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Load env
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Create transporter (Gmail or Mailtrap)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No user found with that email' });

    // Generate token (plain to send by email)
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token before saving to DB for security
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiry (15 minutes)
    user.resetPasswordToken = hash;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    // Build reset URL
    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;

    // Send email if SMTP credentials available; otherwise, in non-production return resetUrl for local testing
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password reset request',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}\n\nIf you didn't request this, ignore this email.`,
      html: `<p>You requested a password reset.</p><p>Click the link to reset your password (valid for 15 minutes):</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('SMTP credentials are not set (EMAIL_USER / EMAIL_PASS).');
      // In development, return the reset URL in the response so developers can test without SMTP
      if ((process.env.NODE_ENV || 'development') !== 'production') {
        return res.json({ message: 'Password reset link (development)', resetUrl });
      }
      return res.status(500).json({ message: 'SMTP credentials not configured on server' });
    }

    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Password reset email sent' });
    } catch (mailErr) {
      console.error('Error sending reset email:', mailErr);
      // If in development, return the reset link so dev can continue testing
      if ((process.env.NODE_ENV || 'development') !== 'production') {
        return res.status(200).json({ message: 'Error sending reset email (dev fallback)', resetUrl, detail: mailErr.message });
      }
      return res.status(500).json({ message: 'Error sending reset email', detail: mailErr.message });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Error sending reset email' });
  }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) return res.status(400).json({ message: 'Token is required' });
    if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Token is invalid or has expired' });

    // Hash new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Error resetting password' });
  }
};
