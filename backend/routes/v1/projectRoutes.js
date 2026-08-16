const express = require('express');
const router = express.Router();

const { requireRole } = require('../../middleware/roleCheck');


const { requireAuth } = require('../../middleware/auth');
const { ensureSeller } = require('../../middleware/capabilityGate');
const projectController = require('../../controllers/seller/projectController');

// Public routes
router.get('/public/:id', projectController.getPublicProjectById);

// Authenticated routes
router.use(requireAuth);

router.get('/mine', ensureSeller, projectController.getMyProjects);
router.get('/all', requireRole('admin'), projectController.getAllProject);
router.post('/', ensureSeller, projectController.createProject);
router.put('/:id/submit', ensureSeller, projectController.submitProjectForReview);
router.get('/:id', projectController.getProjectById); // ownership check lives inside the controller — correct as-is
router.delete('/:id', ensureSeller, projectController.deleteProject);

module.exports = router;