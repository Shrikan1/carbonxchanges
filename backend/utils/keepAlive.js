const { query } = require('../config/db');

/**
 * Supabase Keep-Alive Service
 * 
 * Supabase pauses inactive databases after periods of no activity.
 * This utility keeps the database connection active by running periodic health checks.
 */

let keepAliveInterval = null;

/**
 * Runs a lightweight database query to keep connection active
 */
async function pingDatabase() {
  try {
    const result = await query('SELECT 1 as health_check, NOW() as timestamp');
    console.log(`✅ Database keep-alive ping successful at ${result.rows[0].timestamp}`);
    return true;
  } catch (error) {
    console.error('❌ Database keep-alive ping failed:', error.message);
    return false;
  }
}

/**
 * Start automatic keep-alive pings
 * @param {number} intervalMinutes - How often to ping (default: 5 minutes)
 */
function startKeepAlive(intervalMinutes = 5) {
  if (keepAliveInterval) {
    console.log('⚠️  Keep-alive already running');
    return;
  }

  const intervalMs = intervalMinutes * 60 * 1000;
  
  console.log(`🔄 Starting database keep-alive service (every ${intervalMinutes} minutes)`);
  
  // Initial ping
  pingDatabase();
  
  // Set up recurring pings
  keepAliveInterval = setInterval(() => {
    pingDatabase();
  }, intervalMs);

  // Ensure cleanup on process exit
  process.on('SIGINT', stopKeepAlive);
  process.on('SIGTERM', stopKeepAlive);
}

/**
 * Stop automatic keep-alive pings
 */
function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
    keepAliveInterval = null;
    console.log('🛑 Database keep-alive service stopped');
  }
}

/**
 * Get keep-alive status
 */
function getKeepAliveStatus() {
  return {
    isRunning: keepAliveInterval !== null,
    lastPing: new Date().toISOString()
  };
}

module.exports = {
  startKeepAlive,
  stopKeepAlive,
  pingDatabase,
  getKeepAliveStatus
};
