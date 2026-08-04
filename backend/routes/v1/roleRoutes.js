const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../middleware/auth');
const roleController = require('../../controllers/shared/roleController');

router.use(requireAuth);

router.post('/request', roleController.requestRoleUpgrade);
router.post('/verify', roleController.verifyRoleUpgrade);

module.exports = router;