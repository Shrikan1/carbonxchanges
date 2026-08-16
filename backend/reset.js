const bcrypt = require('bcryptjs');
const { query } = require('./config/db');

async function run() {
  const hash = await bcrypt.hash('12345678', 10);
  await query('UPDATE users SET password_hash = $1 WHERE email = $2', [hash, 'shrikant@gmail.com']);
  console.log('Password reset successfully to 12345678');
  process.exit(0);
}
run();
