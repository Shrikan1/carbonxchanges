// Run this ONCE, manually, to create the admin account:
//   node src/utils/seedAdmin.js
// It reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from .env and inserts
// the admin directly — there is no public API endpoint for this, by design.

const bcrypt = require('bcryptjs');
const { pool, query } = require('../config/db');
require('dotenv').config();

async function seedAdmin() {
  const name = process.env.ADMIN_NAME || 'Platform Admin';
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    console.log(`Admin with email ${email} already exists. Skipping.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await query(
    `INSERT INTO users (name, email, password_hash, role, is_verified)
     VALUES ($1, $2, $3, 'admin', true)`,
    [name, email, passwordHash]
  );

  console.log(`Admin account created for ${email}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Failed to seed admin:', err);
  process.exit(1);
});