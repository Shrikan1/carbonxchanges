const { createClient } = require('@supabase/supabase-js');

// Use service role key so the backend can write to any bucket,
// including private ones (kyc-documents, verification-photos).
// NEVER expose this key on the frontend.

// Lazy initialization — client is created on first use so that module
// loading doesn't crash if env vars aren't present yet (e.g. during tests).
let _supabase = null;
function getClient() {
  if (!_supabase) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error(
        'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env to use Supabase Storage.'
      );
    }
    _supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  }
  return _supabase;
}

const BUCKETS = {
  POST_MEDIA: 'project-post-media',      // public bucket — post images/videos
  KYC_DOCS:   'kyc-documents',           // private bucket — Aadhaar, land deeds
  VERIFY_PHOTOS: 'verification-photos',  // private bucket — agent field photos
};

/**
 * Upload a file buffer to a Supabase Storage bucket.
 * @param {Buffer} buffer - File data
 * @param {string} originalName - Original filename (used to derive extension)
 * @param {string} mimeType - MIME type e.g. 'image/jpeg'
 * @param {string} bucket - One of BUCKETS.*
 * @returns {Promise<string>} Public or signed URL
 */
async function uploadFile(buffer, originalName, mimeType, bucket) {
  const ext = originalName.split('.').pop() || 'bin';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await getClient().storage
    .from(bucket)
    .upload(path, buffer, { contentType: mimeType, upsert: false });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  // Public buckets — get a permanent public URL
  if (bucket === BUCKETS.POST_MEDIA) {
    const { data } = getClient().storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  // Private buckets — return the path; callers request signed URLs on demand
  return path; // stored in DB, converted to signed URL at read time
}

/**
 * Generate a time-limited signed URL for a private bucket file.
 * @param {string} bucket - Bucket name
 * @param {string} path - File path within the bucket
 * @param {number} expiresIn - Seconds until URL expires (default: 3600 = 1 hour)
 */
async function getSignedUrl(bucket, path, expiresIn = 3600) {
  const { data, error } = await getClient().storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) throw new Error(`Failed to generate signed URL: ${error.message}`);
  return data.signedUrl;
}

/**
 * Delete a file from a bucket by its stored path.
 */
async function deleteFile(bucket, path) {
  const { error } = await getClient().storage.from(bucket).remove([path]);
  if (error) console.error(`Supabase delete warning: ${error.message}`);
}

module.exports = { uploadFile, getSignedUrl, deleteFile, BUCKETS };
