
const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('FATAL: DATABASE_URL is not set. Set it in backend/.env before starting the server.');
}

const requiresSsl = connectionString.includes('supabase.co');

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' || requiresSsl ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error on idle client', err);
  process.exit(-1);
});

// Simple helper so controllers/models can just do: await query('SELECT ...', [params])
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };