const express = require('express');
const router = express.Router();
const adminDashboardController = require('../../controllers/admin/adminDashboardController');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roleCheck');

router.get('/', requireAuth, requireRole('admin'), adminDashboardController.getDashboardSummary);

module.exports = router;