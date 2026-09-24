const express = require('express');
const router = express.Router();
const salesController = require('../../../controllers/seller/salesController');
const pendingSalesController = require('../../../controllers/seller/pendingSalesController');
const { requireAuth } = require('../../../middleware/auth');
const { ensureSeller } = require('../../../middleware/capabilityGate');

router.use(requireAuth, ensureSeller);

router.get('/history', salesController.getSalesHistory);
router.get('/report/download', salesController.downloadSalesReport);

// Pending Sales Flow
router.get('/pending', pendingSalesController.getPendingSales);
router.post('/:saleId/complete', pendingSalesController.completeSale);
router.post('/:saleId/reject', pendingSalesController.rejectSale);

module.exports = router;