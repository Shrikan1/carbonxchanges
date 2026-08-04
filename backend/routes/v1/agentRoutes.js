const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roleCheck');
const agentDashboardController = require('../../controllers/agent/agentDashboardController');
const agentProjectController = require('../../controllers/agent/agentProjectController');
const agentVerificationController = require('../../controllers/agent/agentVerificationController');

router.use(requireAuth, requireRole('agent'));

router.get('/dashboard', agentDashboardController.getDashboardSummary);
router.get('/projects', agentProjectController.getAssignedProjects);
router.get('/projects/due-for-completion', agentProjectController.getDueForCompletion);
router.get('/projects/:id', agentProjectController.getAssignedProjectDetails);
router.post('/projects/:id/verify/initial', agentVerificationController.submitInitialVerification);
router.post('/projects/:id/verify/completion', agentVerificationController.submitCompletionVerification);

module.exports = router;