const express = require('express');
const router = express.Router();
const creditController = require('../../controllers/seller/creditController');
const { requireAuth } = require('../../middleware/auth');
const { ensureSeller } = require('../../middleware/capabilityGate');

router.use(requireAuth, ensureSeller);

router.get('/issued', creditController.getIssuedCredits);
router.get('/history', creditController.viewCreditHistory);
router.get('/balance', creditController.viewCreditBalance);

module.exports = router;