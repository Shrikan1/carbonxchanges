const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function fixPasswords() {
  const client = await pool.connect();
  
  try {
    console.log('🔐 Fixing all test user passwords with proper bcrypt hash...\n');
    
    // Generate a fresh bcrypt hash for "Password123!"
    const freshHash = await bcrypt.hash('Password123!', 10);
    console.log('✅ Generated fresh bcrypt hash for Password123!\n');
    
    await client.query('BEGIN');
    
    // Update all test users
    const result = await client.query(`
      UPDATE users 
      SET password_hash = $1
      WHERE email LIKE '%@carbonx.com'
      RETURNING email, name
    `, [freshHash]);
    
    await client.query('COMMIT');
    
    console.log(`✅ Updated ${result.rows.length} users:\n`);
    result.rows.forEach(user => {
      console.log(`   ✅ ${user.email.padEnd(30)} (${user.name})`);
    });
    
    console.log('\n🔑 Password for ALL users: Password123!\n');
    
    // Verify one user
    console.log('🧪 Verifying seller1@carbonx.com...');
    const testUser = await client.query('SELECT email, password_hash FROM users WHERE email = $1', ['seller1@carbonx.com']);
    
    if (testUser.rows.length > 0) {
      const match = await bcrypt.compare('Password123!', testUser.rows[0].password_hash);
      if (match) {
        console.log('   ✅ Verification successful! Password works!\n');
      } else {
        console.log('   ❌ Verification failed! Something went wrong.\n');
        process.exit(1);
      }
    }
    
    console.log('✅ All passwords fixed and verified!\n');
    console.log('🚀 You can now login with:\n');
    console.log('   seller1@carbonx.com / Password123!');
    console.log('   agent1@carbonx.com / Password123!');
    console.log('   admin@carbonx.com / Password123!\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

fixPasswords();
