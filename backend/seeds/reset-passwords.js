const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function resetPasswords() {
  const client = await pool.connect();
  
  try {
    console.log('🔐 Resetting all test user passwords...\n');
    
    await client.query('BEGIN');
    
    const result = await client.query(`
      UPDATE users 
      SET password_hash = '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy'
      WHERE email LIKE '%@carbonx.com'
      RETURNING email, name
    `);
    
    await client.query('COMMIT');
    
    console.log(`✅ Reset passwords for ${result.rows.length} users:\n`);
    result.rows.forEach(user => {
      console.log(`   ${user.email} (${user.name})`);
    });
    
    console.log('\n✅ All passwords reset to: Password123!\n');
    console.log('🔑 You can now login with any test account.\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

resetPasswords();
