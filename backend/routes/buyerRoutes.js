const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const buyerMarketplaceController = require('../controllers/buyer/buyerMarketplaceController');

router.use(requireAuth);

router.get('/marketplace', buyerMarketplaceController.browseMarketplace);
router.get('/marketplace/:listingId', buyerMarketplaceController.getListingDetails);

module.exports = router;