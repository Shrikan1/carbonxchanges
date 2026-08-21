const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../middleware/auth');

// Public Marketplace
const buyerMarketplaceController = require('../../controllers/buyer/buyerMarketplaceController');
router.get('/marketplace', buyerMarketplaceController.browseMarketplace);

// Protected routes
router.use(requireAuth);
router.get('/marketplace/:listingId', buyerMarketplaceController.getListingDetails);

router.use('/dashboard', require('./buyer/buyerDashboardRoutes'));
router.use('/portfolio', require('./buyer/portfolioRoutes'));
router.use('/transactions', require('./buyer/buyerTransactionRoutes'));
router.use('/purchases', require('./buyer/buyerPurchaseRoutes'));
router.use('/retirements', require('./buyer/retirementRoutes'));

module.exports = router;