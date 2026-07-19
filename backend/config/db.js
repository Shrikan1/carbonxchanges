
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Supabase and most managed Postgres providers require SSL
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error on idle client', err);
  process.exit(-1);
});

// Simple helper so controllers/models can just do: await query('SELECT ...', [params])
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };