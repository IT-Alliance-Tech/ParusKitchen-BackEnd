const express = require('express'); 
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { signup, login, getUsers, getProfile, updateProfile } = require('../controllers/userController');

// Signup
router.post('/signup', userController.signup);

// Login
router.post('/login', userController.login);

// Get all users
router.get('/', auth, adminMiddleware, userController.getUsers);

// Get own profile
router.get('/me', auth, userController.getProfile);

// Update own profile
router.put('/me', auth, userController.updateProfile);

// Delete a user (admin only)
router.delete('/:id', auth, adminMiddleware, userController.deleteUser);

// Update a user (admin only)
router.put('/:id', auth, adminMiddleware, userController.updateUser);

// Get logged-in user's profile
router.get('/profile', auth, getProfile);

// Update logged-in user's profile
router.put('/profile', auth, updateProfile);

// Get single user by ID (admin only)
router.get('/:id', auth, adminMiddleware, userController.getUserById);



module.exports = router;
