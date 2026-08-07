const express = require('express');
const router = express.Router();
const agentCommunicationController = require('../../../controllers/agent/agentCommunicationController');
const { requireAuth } = require('../../../middleware/auth');
const { requireRole } = require('../../../middleware/roleCheck');

router.use(requireAuth, requireRole('agent'));

router.get('/:reportId/messages', agentCommunicationController.getReportThread);
router.post('/:reportId/messages', agentCommunicationController.sendMessage);

module.exports = router;