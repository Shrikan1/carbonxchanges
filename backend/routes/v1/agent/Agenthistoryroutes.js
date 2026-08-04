const express = require('express');
const router = express.Router();
const agentHistoryController = require('../../../controllers/agent/agentHistoryController');
const { requireAuth } = require('../../../middleware/auth');
const { requireRole } = require('../../../middleware/roleCheck');

router.get('/', requireAuth, requireRole('agent'), agentHistoryController.getVerificationHistory);

module.exports = router;