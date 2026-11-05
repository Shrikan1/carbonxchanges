const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  try {
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'project_details' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Available columns in project_details table:\n');
    result.rows.forEach(row => {
      console.log(`   ${row.column_name.padEnd(40)} ${row.data_type}`);
    });
    console.log('');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
