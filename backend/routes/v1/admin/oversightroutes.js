const express = require('express');
const router = express.Router();
const oversightController = require('../../../controllers/admin/oversightController');
const { requireAuth } = require('../../../middleware/auth');
const { requireRole } = require('../../../middleware/roleCheck');

router.use(requireAuth, requireRole('admin'));

router.get('/users', oversightController.getAllUsers);
router.get('/projects', oversightController.getAllProjects);
router.get('/transactions', oversightController.getAllTransactions);

module.exports = router;