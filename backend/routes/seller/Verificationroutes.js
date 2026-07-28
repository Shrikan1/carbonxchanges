const express = require('express');
const router = express.Router();
const verificationController = require('../../controllers/seller/verificationController');
const { requireAuth } = require('../../middleware/auth');
const { ensureSeller } = require('../../middleware/capabilityGate');

router.use(requireAuth, ensureSeller);

router.get('/:projectId/status', verificationController.getVerificationStatus);
router.get('/:projectId/agent', verificationController.viewAssignedAgent);
router.post('/:projectId/documents', verificationController.uploadProjectDocuments);
router.put('/reports/:reportId/response', verificationController.submitSellerResponse);
router.get('/reports/:reportId/messages', verificationController.getReportThread);
router.post('/reports/:reportId/messages', verificationController.sendMessage);

module.exports = router;