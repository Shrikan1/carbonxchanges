// backend/utils/cache.js
const NodeCache = require('node-cache');

// Standard in-memory cache with 30s default TTL
const memoryCache = new NodeCache({ stdTTL: 30, checkperiod: 60 });

/**
 * Invalidate all cached keys starting with a specific prefix.
 * Example: invalidateCache('marketplace') clears all cached marketplace queries.
 */
function invalidateCache(prefix) {
  try {
    const keys = memoryCache.keys();
    for (const key of keys) {
      if (key.startsWith(prefix)) {
        memoryCache.del(key);
      }
    }
  } catch (err) {
    console.error('Cache invalidation error:', err);
  }
}

module.exports = { memoryCache, invalidateCache };
