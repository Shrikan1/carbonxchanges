const express = require('express');
const router = express.Router();

const authController = require('../controllers/shared/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.get('/me', requireAuth, authController.getProfile);

module.exports = router;