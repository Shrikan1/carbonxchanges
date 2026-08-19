const { uploadFile, BUCKETS } = require('../../services/supabaseStorageService');

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;  // 10 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB

/**
 * POST /api/upload/media
 * Uploads post images/videos to Supabase public bucket.
 * Returns a permanent public URL (not an IPFS CID).
 */
async function uploadMedia(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { mimetype, buffer, size, originalname } = req.file;
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimetype);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimetype);

    if (!isImage && !isVideo) {
      return res.status(400).json({
        error: `Unsupported file type: ${mimetype}. Allowed: images (jpeg/png/webp/gif) and videos (mp4/webm/ogg/mov).`,
      });
    }

    if (isImage && size > MAX_IMAGE_SIZE) {
      return res.status(400).json({ error: `Image too large — max 10 MB, got ${(size / 1024 / 1024).toFixed(1)} MB` });
    }
    if (isVideo && size > MAX_VIDEO_SIZE) {
      return res.status(400).json({ error: `Video too large — max 100 MB, got ${(size / 1024 / 1024).toFixed(1)} MB` });
    }

    const url = await uploadFile(buffer, originalname, mimetype, BUCKETS.POST_MEDIA);
    const mediaType = isImage ? 'image' : 'video';

    res.status(201).json({ message: 'Media uploaded successfully', url, mediaType });
  } catch (err) {
    console.error('Media upload error:', err.message);

    res.status(500).json({ error: `Failed to upload media: ${err.message}` });
  }
}

module.exports = { uploadMedia };
