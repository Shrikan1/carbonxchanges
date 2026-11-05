const app = require('./src/app');
const { pool } = require('./config/db');
const { startKeepAlive } = require('./utils/keepAlive');

const PORT = process.env.PORT || 5000;

// --- Critical env-var guard ---
// JWT_SECRET missing means every jwt.sign() call uses `undefined` as the
// secret, making ALL tokens trivially forgeable. Catch this at boot, not at
// the first real login request.
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set. Set it in your .env file and restart.');
  process.exit(1);
}

pool.query('SELECT NOW()')
  .then(() => {
    console.log('PostgreSQL connected successfully');
    
    // Start Supabase keep-alive service to prevent database from pausing
    // Pings database every 5 minutes to maintain active connection
    startKeepAlive(5);
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  });