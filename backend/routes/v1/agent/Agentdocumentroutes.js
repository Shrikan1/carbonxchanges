const express = require('express');
const router = express.Router();
const agentDocumentController = require('../../../controllers/agent/agentDocumentController');
const { requireAuth } = require('../../../middleware/auth');
const { requireRole } = require('../../../middleware/roleCheck');

router.get('/:id/documents', requireAuth, requireRole('agent'), agentDocumentController.getProjectDocuments);
router.post('/:id/documents/:docId/review', requireAuth, requireRole('agent'), agentDocumentController.reviewDocument);
router.post('/:id/kyc-review', requireAuth, requireRole('agent'), agentDocumentController.reviewKycDocument);

module.exports = router;