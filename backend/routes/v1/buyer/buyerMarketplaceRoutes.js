const express = require('express');
const router = express.Router();
const buyerMarketplaceController = require('../../../controllers/buyer/buyerMarketplaceController');

// Deliberately public — browsing doesn't require being logged in as a
// buyer (or logged in at all). Only purchasing requires ensureBuyer.
router.get('/', buyerMarketplaceController.browseMarketplace);
router.get('/:listingId', buyerMarketplaceController.getListingDetails);

module.exports = router;