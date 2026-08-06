const express = require('express');
const router = express.Router();
const buyerTransactionController = require('../../../controllers/buyer/buyerTransactionController');
const { requireAuth } = require('../../../middleware/auth');
const { ensureBuyer } = require('../../../middleware/capabilityGate');

router.get('/', requireAuth, ensureBuyer, buyerTransactionController.getTransactionHistory);

module.exports = router;