const express = require('express');
const router = express.Router();
const marketplaceController = require('../../controllers/seller/marketplaceController');
const { requireAuth } = require('../../middleware/auth');
const { ensureSeller } = require('../../middleware/capabilityGate');

router.use(requireAuth, ensureSeller);

router.post('/listings', marketplaceController.createCreditListing);
router.put('/listings/:id/price', marketplaceController.updateCreditPrice);
router.delete('/listings/:id', marketplaceController.cancelListing);
router.get('/listings/mine', marketplaceController.getMyListings);

module.exports = router;