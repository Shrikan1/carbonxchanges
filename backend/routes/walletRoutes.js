const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const walletController = require('../controllers/shared/walletController');

router.use(requireAuth);

router.get('/', walletController.getWalletDetails);
router.post('/connect', walletController.connectWallet);
router.post('/disconnect', walletController.disconnectWallet);

module.exports = router;