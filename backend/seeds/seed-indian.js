const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedIndianProjects() {
  const client = await pool.connect();
  
  try {
    console.log('🇮🇳  Starting Indian Carbon Projects Seeding...\n');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'indian_projects_complete.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    
    console.log('✅ Indian Projects seeded successfully!\n');
    console.log('📊 Created:');
    console.log('   - 8 Indian Users (all from India 🇮🇳)');
    console.log('     • 3 Sellers (Mumbai, Bangalore, Ahmedabad)');
    console.log('     • 2 Agents (New Delhi, Chennai)');
    console.log('     • 2 Buyers (Pune, Hyderabad)');
    console.log('     • 1 Admin (Mumbai)\n');
    
    console.log('   - 12 Complete Indian Projects');
    console.log('     • 2 Draft: Western Ghats, Rajasthan Solar-Wind');
    console.log('     • 2 Pending: Tamil Nadu Mangrove, Gujarat Biogas');
    console.log('     • 2 Assigned: Karnataka Wind, UP Agroforestry');
    console.log('     • 2 In Progress: Maharashtra Watershed, Odisha Solar');
    console.log('     • 2 Verified: MP Bamboo, Himachal Micro-Hydro');
    console.log('     • 2 Approved: Assam Tea Estate, Punjab Solar Rooftop\n');
    
    console.log('   - ALL projects have COMPLETE project_details');
    console.log('     • Location data (Indian states & coordinates)');
    console.log('     • Carbon calculations');
    console.log('     • Methodology & baseline');
    console.log('     • Additionality demonstration');
    console.log('     • Full technical descriptions\n');
    
    console.log('🔑 Test Credentials (All Indian Users):');
    console.log('   Email: seller1@carbonx.com (Rajesh Kumar - Mumbai)');
    console.log('   Email: agent1@carbonx.com (Dr. Anil Verma - Delhi)');
    console.log('   Email: buyer1@carbonx.com (Vikram Singh - Pune)');
    console.log('   Email: admin@carbonx.com (Admin - Mumbai)');
    console.log('   Password: Password123! (for all accounts)\n');
    
    console.log('🌳 Project Highlights:');
    console.log('   • Western Ghats (Maharashtra) - 3,500 hectares reforestation');
    console.log('   • Tamil Nadu Coast - 600 hectares mangrove restoration');
    console.log('   • Karnataka - 100 MW wind farm');
    console.log('   • Uttar Pradesh - 8,000 hectares agroforestry');
    console.log('   • Gujarat - 5,000 biogas digesters');
    console.log('   • Assam Tea Estates - 4,500 hectares buffer zone\n');
    
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

seedIndianProjects();
