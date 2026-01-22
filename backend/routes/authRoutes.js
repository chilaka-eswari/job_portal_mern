const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ✅ User Registration
router.post('/register', authController.register);

// ✅ User Login
router.post('/login', authController.login);

// ✅ Get User Profile
router.get('/profile/:id', authController.getUserProfile);

// ✅ Update User Profile
router.put('/profile/:id', authController.updateUserProfile);

// ✅ Get All Users
router.get('/users', authController.getAllUsers);

// ✅ Delete User
router.delete('/users/:id', authController.deleteUser);

module.exports = router;
