const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/shared/roleController');
const { requireAuth } = require('../../middleware/auth');

router.use(requireAuth);

router.post('/request', roleController.requestRoleUpgrade);
router.post('/verify', roleController.verifyRoleUpgrade);

module.exports = router;