const express = require('express');
const router = express.Router();
const { createPurchaseIntent, getMyPurchaseIntents } = require('../../../controllers/buyer/buyerPurchaseController');
const { requireAuth } = require('../../../middleware/auth');
const { ensureBuyer } = require('../../../middleware/capabilityGate');
const { purchaseLimiter } = require('../../../middleware/rateLimiter');

router.post('/intent',   requireAuth, ensureBuyer, purchaseLimiter, createPurchaseIntent);
router.get('/intents',   requireAuth, ensureBuyer, getMyPurchaseIntents);

module.exports = router;
