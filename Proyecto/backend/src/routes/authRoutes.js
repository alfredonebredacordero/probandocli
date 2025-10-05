const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, registerLimiter } = require('../middleware/rateLimiter');

// Apply rate limiters to routes
router.post('/register', registerLimiter, register);
router.post('/login', authLimiter, login);

// Protected routes
router.get('/me', protect, getCurrentUser);

module.exports = router;