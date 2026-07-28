const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roleCheck');

// Every route in this file is admin-only
router.use(requireAuth, requireRole('admin'));

router.post('/agents', adminController.createAgent);
router.get('/agents', adminController.getAllAgents);
router.get('/agents/:id/workload', adminController.getAgentWorkload);

module.exports = router;