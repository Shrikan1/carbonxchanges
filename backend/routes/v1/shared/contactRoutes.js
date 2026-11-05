// backend/routes/v1/shared/contactRoutes.js
const express = require('express');
const router = express.Router();
const { writeLimiter } = require('../../../middleware/rateLimiter');
const contactController = require('../../../controllers/shared/contactController');

// POST /api/v1/contact (Public with rate limiting)
router.post('/', writeLimiter, contactController.submitContactMessage);

module.exports = router;
