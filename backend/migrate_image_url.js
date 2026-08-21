const { pool } = require('./config/db');

async function run() {
  try {
    await pool.query('ALTER TABLE credit_listings ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);');
    console.log('Successfully added image_url to credit_listings');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
}

run();
