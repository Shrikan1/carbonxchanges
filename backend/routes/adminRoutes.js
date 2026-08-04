const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/roleCheck');
const { writeLimiter } = require('../middleware/rateLimiter');
const adminController = require('../controllers/admin/adminController');
const adminDashboardController = require('../controllers/admin/adminDashboardController');
const adminProjectController = require('../controllers/admin/adminProjectController');
const mintController = require('../controllers/admin/mintController');
const oversightController = require('../controllers/admin/oversightController');

// Every route in this file is admin-only
router.use(requireAuth, requireRole('admin'));

router.post('/agents', writeLimiter, adminController.createAgent);
router.get('/agents', adminController.getAllAgent);
router.get('/agents/:id/workload', adminController.getAgentWorkload);
router.delete('/projects/:id', adminController.deleteProjectByAdmin);

router.get('/dashboard', adminDashboardController.getDashboardSummary);

router.get('/projects', adminProjectController.getReviewQueue);
router.get('/projects/:id', adminProjectController.getProjectDetails);
router.put('/projects/:id/approve', adminProjectController.approveProject);
router.put('/projects/:id/reject', adminProjectController.rejectProject);
router.put('/projects/:id/assign-agent', adminProjectController.assignAgent);
router.put('/projects/:id/remove-agent', adminProjectController.removeAgent);

router.get('/mint/queue', mintController.getMintableProjects);
router.post('/mint/:id/retry', writeLimiter, mintController.retryMint);

router.get('/oversight/users', oversightController.getAllUsers);
router.get('/oversight/projects', oversightController.getAllProjects);
router.get('/oversight/transactions', oversightController.getAllTransactions);

module.exports = router;