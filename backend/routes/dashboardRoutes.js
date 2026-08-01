const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const dashboardController = require('../controllers/seller/dashboardController');

router.use(requireAuth);

router.get('/', dashboardController.getDashboardSummary);

module.exports = router;