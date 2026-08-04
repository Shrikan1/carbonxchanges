const express = require('express');
const router = express.Router();
const adminProjectController = require('../../../controllers/admin/adminProjectController');
const { requireAuth } = require('../../../middleware/auth');
const { requireRole } = require('../../../middleware/roleCheck');

router.use(requireAuth, requireRole('admin'));

router.get('/', adminProjectController.getReviewQueue);
router.get('/:id', adminProjectController.getProjectDetails);
router.put('/:id/approve', adminProjectController.approveProject);
router.put('/:id/reject', adminProjectController.rejectProject);
router.put('/:id/assign-agent', adminProjectController.assignAgent);
router.put('/:id/remove-agent', adminProjectController.removeAgent);

module.exports = router;