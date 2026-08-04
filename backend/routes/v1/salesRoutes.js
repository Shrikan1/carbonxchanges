const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../middleware/auth');
const salesController = require('../../controllers/seller/salesController');

router.use(requireAuth);

router.get('/history', salesController.getSalesHistory);
router.get('/report/download', salesController.downloadSalesReport);

module.exports = router;