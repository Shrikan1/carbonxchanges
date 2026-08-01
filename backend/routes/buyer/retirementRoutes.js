const express = require('express');
const router = express.Router();
const retirementController = require('../../controllers/buyer/retirementController');
const { requireAuth } = require('../../middleware/auth');
const { ensureBuyer } = require('../../middleware/capabilityGate');

router.use(requireAuth, ensureBuyer);

router.post('/retire', retirementController.retireCredits);
router.get('/certificates', retirementController.getMyCertificates);
router.get('/certificates/:id/download', retirementController.downloadCertificate);

module.exports = router;