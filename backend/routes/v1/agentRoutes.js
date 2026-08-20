const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roleCheck');
const agentDashboardController = require('../../controllers/agent/agentDashboardController');
const agentProjectController = require('../../controllers/agent/agentProjectController');
const agentVerificationController = require('../../controllers/agent/agentVerificationController');
const agentHistoryController = require('../../controllers/agent/Agenthistorycontroller');
const agentReinspectionController = require('../../controllers/agent/agentReinspectionController');
const agentCommunicationController = require('../../controllers/agent/agentCommunicationController');
const agentDocumentController = require('../../controllers/agent/agentDocumentController');

router.use(requireAuth, requireRole('agent'));

router.get('/dashboard', agentDashboardController.getDashboardSummary);
router.get('/projects', agentProjectController.getAssignedProjects);
router.get('/projects/due-for-completion', agentProjectController.getDueForCompletion);
router.get('/projects/:id', agentProjectController.getAssignedProjectDetails);
router.post('/projects/:id/verify/initial', agentVerificationController.submitInitialVerification);
router.post('/projects/:id/verify/completion', agentVerificationController.submitCompletionVerification);
router.post('/projects/:id/flag', agentVerificationController.flagProject);
router.put('/projects/:id/progress', agentProjectController.updateReviewProgress);

// Document Review Routes
router.post('/projects/:id/kyc-review', agentDocumentController.reviewKycDocument);
router.post('/projects/:id/documents/:docId/review', agentDocumentController.reviewDocument);
router.get('/projects/:id/documents', agentDocumentController.getProjectDocuments);

// Missing routes
router.get('/history', agentHistoryController.getVerificationHistory);
router.post('/projects/:id/reinspect', agentReinspectionController.submitReinspection);
router.get('/projects/:id/reinspections', agentReinspectionController.getProjectReinspections);
router.get('/reports/:reportId/messages', agentCommunicationController.getReportThread);
router.post('/reports/:reportId/messages', agentCommunicationController.sendMessage);

module.exports = router;