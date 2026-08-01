const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const profileController = require('../controllers/shared/profileController');

router.use(requireAuth);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.put('/password', profileController.changePassword);

module.exports = router;