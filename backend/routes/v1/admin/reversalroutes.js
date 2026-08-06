const express = require('express');
const router = express.Router();
const reversalController = require('../../../controllers/admin/reversalController');
const { requireAuth } = require('../../../middleware/auth');
const { requireRole } = require('../../../middleware/roleCheck');

router.use(requireAuth, requireRole('admin'));

router.get('/queue', reversalController.getFlaggedReversals);
router.put('/:reportId/resolve', reversalController.resolveReversal);

module.exports = router;