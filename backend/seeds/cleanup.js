const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function cleanup() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️  Cleaning up old test data...\n');
    
    await client.query('BEGIN');
    
    // Delete in correct order to respect foreign keys
    await client.query('DELETE FROM project_details WHERE project_id IN (SELECT id FROM projects WHERE seller_id IN (SELECT id FROM users WHERE email LIKE \'%@carbonx.com\'))');
    console.log('   ✅ Cleared project_details');
    
    await client.query('DELETE FROM documents WHERE project_id IN (SELECT id FROM projects WHERE seller_id IN (SELECT id FROM users WHERE email LIKE \'%@carbonx.com\'))');
    console.log('   ✅ Cleared documents');
    
    await client.query('DELETE FROM projects WHERE seller_id IN (SELECT id FROM users WHERE email LIKE \'%@carbonx.com\')');
    console.log('   ✅ Cleared projects');
    
    await client.query('DELETE FROM users WHERE email LIKE \'%@carbonx.com\'');
    console.log('   ✅ Cleared test users');
    
    await client.query('COMMIT');
    
    console.log('\n✅ Cleanup complete! Ready for fresh seed data.\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Cleanup failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

cleanup();
