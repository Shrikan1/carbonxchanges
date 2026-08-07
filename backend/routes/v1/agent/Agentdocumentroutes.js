const express = require('express');
const router = express.Router();
const agentDocumentController = require('../../../controllers/agent/agentDocumentController');
const { requireAuth } = require('../../../middleware/auth');
const { requireRole } = require('../../../middleware/roleCheck');

router.get('/:id/documents', requireAuth, requireRole('agent'), agentDocumentController.getProjectDocuments);

module.exports = router;