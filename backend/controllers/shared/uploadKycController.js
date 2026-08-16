const { uploadFile, BUCKETS } = require('../../services/supabaseStorageService');

const ALLOWED_KYC_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'application/pdf',
];
const MAX_KYC_SIZE = 15 * 1024 * 1024; // 15 MB

const VALID_DOC_PURPOSES = ['aadhaar', 'land_deed', 'verification_photo'];

/**
 * POST /api/upload/kyc
 * Uploads sensitive identity documents (Aadhaar, land deeds, verification photos)
 * to a PRIVATE Supabase bucket.
 *
 * Body (multipart/form-data):
 *   - file: the document
 *   - purpose: one of 'aadhaar' | 'land_deed' | 'verification_photo'
 *
 * Returns the storage path (not a public URL) — the admin endpoint generates
 * time-limited signed URLs on demand when viewing a project.
 */
async function uploadKycDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { mimetype, buffer, size, originalname } = req.file;
    const purpose = req.body.purpose;

    if (!VALID_DOC_PURPOSES.includes(purpose)) {
      return res.status(400).json({
        error: `Invalid purpose. Must be one of: ${VALID_DOC_PURPOSES.join(', ')}`,
      });
    }

    if (!ALLOWED_KYC_TYPES.includes(mimetype)) {
      return res.status(400).json({
        error: `Unsupported file type: ${mimetype}. KYC docs must be images (jpeg/png/webp) or PDF.`,
      });
    }

    if (size > MAX_KYC_SIZE) {
      return res.status(400).json({
        error: `File too large — max 15 MB for KYC documents.`,
      });
    }

    // Verification photos go to verification-photos bucket; ID docs to kyc-documents
    const bucket = purpose === 'verification_photo' ? BUCKETS.VERIFY_PHOTOS : BUCKETS.KYC_DOCS;

    // uploadFile returns a storage path for private buckets (not a URL)
    const storagePath = await uploadFile(buffer, originalname, mimetype, bucket);

    res.status(201).json({
      message: 'Document uploaded successfully',
      storagePath,
      bucket,
      purpose,
    });
  } catch (err) {
    console.error('KYC document upload error:', err.message);

    if (err.message.includes('SUPABASE_URL') || err.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return res.status(503).json({
        error: 'Storage system is temporarily unavailable. Please try again later.',
      });
    }

    res.status(500).json({ error: `Failed to upload document: ${err.message}` });
  }
}

module.exports = { uploadKycDocument };
