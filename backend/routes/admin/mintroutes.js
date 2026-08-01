const express = require('express');
const router = express.Router();
const mintController = require('../../controllers/admin/mintController');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roleCheck');

router.use(requireAuth, requireRole('admin'));

router.get('/queue', mintController.getMintableProjects);
router.post('/:id/retry', mintController.retryMint);

module.exports = router;