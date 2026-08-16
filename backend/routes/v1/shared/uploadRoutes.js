const express = require('express');
const router = express.Router();
const multer = require('multer');
const { requireAuth } = require('../../../middleware/auth');
const uploadController = require('../../../controllers/shared/uploadController');
const uploadMediaController = require('../../../controllers/shared/uploadMediaController');
const uploadKycController = require('../../../controllers/shared/uploadKycController');

// memoryStorage — file stays in RAM as a buffer, never written to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB absolute cap (video uploads need headroom)
});

// ── Existing IPFS upload (still used for agent field photos going into the verification PDF) ──
// POST /api/upload
router.post('/', requireAuth, upload.single('file'), uploadController.uploadFile);

// ── Supabase Storage: public post media (images + videos) ──
// POST /api/upload/media
router.post('/media', requireAuth, upload.single('file'), uploadMediaController.uploadMedia);

// ── Supabase Storage: private KYC documents (Aadhaar, land deed, verification photo) ──
// POST /api/upload/kyc
router.post('/kyc', requireAuth, upload.single('file'), uploadKycController.uploadKycDocument);

module.exports = router;