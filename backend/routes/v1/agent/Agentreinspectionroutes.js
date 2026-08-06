const express = require('express');
const router = express.Router();
const agentReinspectionController = require('../../../controllers/agent/agentReinspectionController');
const { requireAuth } = require('../../../middleware/auth');
const { requireRole } = require('../../../middleware/roleCheck');

router.use(requireAuth, requireRole('agent'));

router.post('/:id/reinspect', agentReinspectionController.submitReinspection);
router.get('/:id/reinspections', agentReinspectionController.getProjectReinspections);

module.exports = router;