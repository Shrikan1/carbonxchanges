const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireAuth } = require('../../middleware/auth');
const uploadController = require('../../controllers/shared/uploadController');

// memoryStorage — file stays in RAM as a buffer, never written to disk
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB cap

router.post('/', requireAuth, upload.single('file'), uploadController.uploadFile);

module.exports = router;