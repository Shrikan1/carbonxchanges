const express = require('express');
const router = express.Router();
const agentDashboardController = require('../../../controllers/agent/agentDashboardController');
const { requireAuth } = require('../../../middleware/auth');
const { requireRole } = require('../../../middleware/roleCheck');

router.get('/', requireAuth, requireRole('agent'), agentDashboardController.getDashboardSummary);

module.exports = router;