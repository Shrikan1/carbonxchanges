const express = require('express');
const router = express.Router();
const agentVerificationController = require('../../controllers/agent/agentVerificationController');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roleCheck');

router.use(requireAuth, requireRole('agent'));

router.post('/:id/verify/initial', agentVerificationController.submitInitialVerification);
router.post('/:id/verify/completion', agentVerificationController.submitCompletionVerification);

module.exports = router;