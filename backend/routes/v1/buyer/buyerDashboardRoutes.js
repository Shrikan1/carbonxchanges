const express = require('express');
const router = express.Router();
const buyerDashboardController = require('../../controllers/buyer/buyerDashboardController');
const { requireAuth } = require('../../middleware/auth');
const { ensureBuyer } = require('../../middleware/capabilityGate');

router.get('/', requireAuth, ensureBuyer, buyerDashboardController.getDashboardSummary);

module.exports = router;