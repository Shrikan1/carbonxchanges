const express = require('express');
const router = express.Router();
const portfolioController = require('../../../controllers/buyer/portfolioController');
const { requireAuth } = require('../../../middleware/auth');
const { ensureBuyer } = require('../../../middleware/capabilityGate');

router.get('/', requireAuth, ensureBuyer, portfolioController.getPortfolio);

module.exports = router;