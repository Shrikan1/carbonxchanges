const express = require('express');
const router = express.Router();
const notificationController = require('../../../controllers/shared/notificationController');
const { requireAuth } = require('../../../middleware/auth');

router.use(requireAuth);

router.get('/', notificationController.getNotifications);
router.patch('/:id/read', notificationController.markAsRead);

module.exports = router;
