const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../middleware/auth');
const verificationController = require('../../controllers/seller/verificationController');

router.use(requireAuth);

router.get('/:projectId/status', verificationController.getVerificationStatus);
router.get('/:projectId/agent', verificationController.viewAssignedAgent);
router.post('/:projectId/documents', verificationController.uploadProjectDocuments);
router.put('/reports/:reportId/response', verificationController.submitSellerResponse);

module.exports = router;