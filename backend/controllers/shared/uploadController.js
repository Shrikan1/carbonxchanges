const { uploadFileToIPFS } = require('../../services/ipfsService');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed.',
      });
    }

    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ error: 'File size exceeds maximum allowed limit (10MB)' });
    }

    const cid = await uploadFileToIPFS(req.file.buffer, req.file.originalname);

    res.status(201).json({
      message: 'File uploaded to IPFS',
      cid,
      url: `https://gateway.pinata.cloud/ipfs/${cid}`,
    });
  } catch (err) {
    console.error('IPFS upload error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to upload file to IPFS' });
  }
}

module.exports = { uploadFile };