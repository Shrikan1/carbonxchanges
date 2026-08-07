const express = require('express');
const router = express.Router();
const buyerPurchaseController = require('../../../controllers/buyer/buyerPurchaseController');
const { requireAuth } = require('../../../middleware/auth');
const { ensureBuyer } = require('../../../middleware/capabilityGate');
const { purchaseLimiter } = require('../../../middleware/rateLimiter');

router.post('/', requireAuth, ensureBuyer, purchaseLimiter, buyerPurchaseController.purchaseCredits);

module.exports = router;
