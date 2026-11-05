const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL from .env (Supabase connection string)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase
  }
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'dummy_projects.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    
    console.log('✅ Database seeded successfully!\n');
    console.log('📊 Created:');
    console.log('   - 8 Users (3 sellers, 2 agents, 2 buyers, 1 admin)');
    console.log('   - 12 Projects (2 in each stage)');
    console.log('   - 2 Credit batches');
    console.log('   - 1 Transaction');
    console.log('   - 1 Portfolio entry\n');
    
    console.log('🔑 Test Credentials:');
    console.log('   Email: seller1@carbonx.com');
    console.log('   Email: agent1@carbonx.com');
    console.log('   Email: buyer1@carbonx.com');
    console.log('   Email: admin@carbonx.com');
    console.log('   Password: Password123! (for all accounts)\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error seeding database:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
