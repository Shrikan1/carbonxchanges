const express = require('express');
const router = express.Router();
const buyerPurchaseController = require('../../controllers/buyer/buyerPurchaseController');
const { requireAuth } = require('../../middleware/auth');
const { ensureBuyer } = require('../../middleware/capabilityGate');

router.post('/', requireAuth, ensureBuyer, buyerPurchaseController.purchaseCredits);

module.exports = router;