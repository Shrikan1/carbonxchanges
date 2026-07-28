const express = require('express');
const router = express.Router();
const walletController = require('../../controllers/shared/walletController');
const { requireAuth } = require('../../middleware/auth');

router.use(requireAuth);

router.post('/connect', walletController.connectWallet);
router.post('/disconnect', walletController.disconnectWallet);
router.get('/', walletController.getWalletDetails);

module.exports = router;