const express = require('express');
const router = express.Router();
const marketplaceController = require('../../controllers/seller/marketplaceController');
const { requireAuth } = require('../../middleware/auth');
const { ensureSeller } = require('../../middleware/capabilityGate');
const { writeLimiter } = require('../../middleware/rateLimiter');

router.use(requireAuth, ensureSeller);

router.post('/listings', writeLimiter, marketplaceController.createCreditListing);
router.put('/listings/:id/price', writeLimiter, marketplaceController.updateCreditPrice);
router.delete('/listings/:id', writeLimiter, marketplaceController.cancelListing);
router.get('/listings/mine', marketplaceController.getMyListings);

module.exports = router;