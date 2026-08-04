const express = require('express');
const router = express.Router();
const ogController = require('../../../controllers/ogController');

// Public — no requireAuth. Link crawlers (Facebook, WhatsApp, LinkedIn)
// can't send auth headers, so this must stay open.
router.get('/projects/:id', ogController.getProjectOgPage);

module.exports = router;