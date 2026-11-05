// Quick test script to verify everything is working
require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runTests() {
  console.log('🧪 Running System Check...\n');
  
  const tests = [];
  
  try {
    // Test 1: Database Connection
    console.log('1️⃣  Testing database connection...');
    await pool.query('SELECT NOW()');
    tests.push({ name: 'Database Connection', status: '✅ PASS' });
    console.log('   ✅ Connected to Supabase\n');
    
    // Test 2: Users Table
    console.log('2️⃣  Checking users...');
    const usersResult = await pool.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      WHERE email LIKE '%@carbonx.com' 
      GROUP BY role
    `);
    const userCounts = usersResult.rows.reduce((acc, row) => {
      acc[row.role] = parseInt(row.count);
      return acc;
    }, {});
    
    console.log('   Users found:');
    console.log(`     - Sellers: ${userCounts.user || 0} (is_seller=true)`);
    console.log(`     - Agents: ${userCounts.agent || 0}`);
    console.log(`     - Admin: ${userCounts.admin || 0}`);
    
    const totalUsers = Object.values(userCounts).reduce((a, b) => a + b, 0);
    if (totalUsers >= 8) {
      tests.push({ name: 'Test Users', status: '✅ PASS', detail: `${totalUsers} users` });
      console.log(`   ✅ ${totalUsers} test users found\n`);
    } else {
      tests.push({ name: 'Test Users', status: '⚠️  WARN', detail: `Only ${totalUsers} users (expected 8)` });
      console.log(`   ⚠️  Only ${totalUsers} users found (expected 8)\n`);
    }
    
    // Test 3: Projects by Status
    console.log('3️⃣  Checking projects...');
    const projectsResult = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM projects 
      GROUP BY status 
      ORDER BY status
    `);
    
    console.log('   Projects by status:');
    let totalProjects = 0;
    projectsResult.rows.forEach(row => {
      console.log(`     - ${row.status}: ${row.count}`);
      totalProjects += parseInt(row.count);
    });
    
    if (totalProjects >= 12) {
      tests.push({ name: 'Projects', status: '✅ PASS', detail: `${totalProjects} projects` });
      console.log(`   ✅ ${totalProjects} projects found\n`);
    } else {
      tests.push({ name: 'Projects', status: '⚠️  WARN', detail: `Only ${totalProjects} projects (expected 12)` });
      console.log(`   ⚠️  Only ${totalProjects} projects found (expected 12)\n`);
    }
    
    // Test 4: Test Login
    console.log('4️⃣  Testing authentication...');
    const userResult = await pool.query(`
      SELECT email, password_hash, name, role, is_seller 
      FROM users 
      WHERE email = 'seller1@carbonx.com'
    `);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const passwordMatch = await bcrypt.compare('Password123!', user.password_hash);
      
      if (passwordMatch) {
        tests.push({ name: 'Authentication', status: '✅ PASS', detail: 'Password hash verified' });
        console.log(`   ✅ seller1@carbonx.com login works`);
        console.log(`      Name: ${user.name}`);
        console.log(`      Role: ${user.role}`);
        console.log(`      is_seller: ${user.is_seller}\n`);
      } else {
        tests.push({ name: 'Authentication', status: '❌ FAIL', detail: 'Password mismatch' });
        console.log(`   ❌ Password verification failed\n`);
      }
    } else {
      tests.push({ name: 'Authentication', status: '❌ FAIL', detail: 'User not found' });
      console.log(`   ❌ seller1@carbonx.com not found\n`);
    }
    
    // Test 5: Environment Variables
    console.log('5️⃣  Checking environment variables...');
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET',
      'RPC_URL',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length === 0) {
      tests.push({ name: 'Environment', status: '✅ PASS', detail: 'All required vars set' });
      console.log('   ✅ All required environment variables set\n');
    } else {
      tests.push({ name: 'Environment', status: '⚠️  WARN', detail: `Missing: ${missingVars.join(', ')}` });
      console.log(`   ⚠️  Missing: ${missingVars.join(', ')}\n`);
    }
    
    // Test 6: JWT Secret
    console.log('6️⃣  Checking JWT secret...');
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret && jwtSecret.length >= 32) {
      tests.push({ name: 'JWT Secret', status: '✅ PASS', detail: `${jwtSecret.length} chars` });
      console.log(`   ✅ JWT secret is ${jwtSecret.length} characters (secure)\n`);
    } else {
      tests.push({ name: 'JWT Secret', status: '⚠️  WARN', detail: 'Too short (< 32 chars)' });
      console.log(`   ⚠️  JWT secret is too short (${jwtSecret?.length || 0} chars, recommended: 32+)\n`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    tests.push({ name: 'Test Suite', status: '❌ FAIL', detail: error.message });
  } finally {
    await pool.end();
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  
  tests.forEach(test => {
    const detail = test.detail ? ` (${test.detail})` : '';
    console.log(`${test.status} ${test.name}${detail}`);
  });
  
  const passed = tests.filter(t => t.status === '✅ PASS').length;
  const total = tests.length;
  
  console.log('='.repeat(60));
  console.log(`\n🎯 Result: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('✅ All systems operational! Ready to start servers.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed or have warnings. Check above.\n');
    process.exit(1);
  }
}

runTests();
