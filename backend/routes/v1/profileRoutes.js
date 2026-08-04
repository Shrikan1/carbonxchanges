const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../middleware/auth');
const { passwordLimiter } = require('../../middleware/rateLimiter');
const profileController = require('../../controllers/shared/profileController');

router.use(requireAuth);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.put('/password', passwordLimiter, profileController.changePassword);

module.exports = router;
