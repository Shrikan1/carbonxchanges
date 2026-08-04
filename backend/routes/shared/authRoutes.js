const express = require('express');
const router = express.Router();

const authController = require('../../controllers/shared/authController');
const { requireAuth } = require('../../middleware/auth');
const {otpLimiter , loginLimiter} = require('../../middleware/rateLimiter')


router.post('/signup',otpLimiter, authController.signup);
router.post('/verify-otp',otpLimiter, authController.verifyOtp);
router.post('/login',loginLimiter, authController.login);
router.get('/me', requireAuth, authController.getProfile);

module.exports = router;
