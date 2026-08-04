const express = require('express');
const router = express.Router();
const agentProjectController = require('../../controllers/agent/agentProjectController');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roleCheck');

router.use(requireAuth, requireRole('agent'));

router.get('/', agentProjectController.getAssignedProjects);
router.get('/due-for-completion', agentProjectController.getDueForCompletion);
router.get('/:id', agentProjectController.getAssignedProjectDetails);

module.exports = router;