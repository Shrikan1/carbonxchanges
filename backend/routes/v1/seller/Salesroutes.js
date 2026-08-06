const express = require('express');
const router = express.Router();
const salesController = require('../../../controllers/seller/salesController');
const { requireAuth } = require('../../../middleware/auth');
const { ensureSeller } = require('../../../middleware/capabilityGate');

router.use(requireAuth, ensureSeller);

router.get('/history', salesController.getSalesHistory);
router.get('/report/download', salesController.downloadSalesReport);

module.exports = router;