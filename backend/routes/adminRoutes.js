const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');

// Every route in this file is admin-only
router.use(requireAuth, requireRole('admin'));

router.post('/agents', adminController.createAgent);

module.exports = router;