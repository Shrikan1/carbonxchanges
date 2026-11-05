const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedIndianProjects() {
  const client = await pool.connect();
  
  try {
    console.log('🇮🇳  Seeding Complete Indian Carbon Projects...\n');
    
    await client.query('BEGIN');
    
    // Insert Indian users
    const usersResult = await client.query(`
      INSERT INTO users (email, password_hash, role, name, phone_number, address, is_seller, is_buyer, wallet_address, is_verified, created_at)
      VALUES
        ('seller1@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Rajesh Kumar', '+919876543210', 'Mumbai, Maharashtra, India', true, false, '0x1234567890123456789012345678901234567890', true, NOW() - INTERVAL '6 months'),
        ('seller2@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Priya Sharma', '+918765432109', 'Bangalore, Karnataka, India', true, false, '0x2234567890123456789012345678901234567891', true, NOW() - INTERVAL '5 months'),
        ('seller3@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Amit Patel', '+919123456780', 'Ahmedabad, Gujarat, India', true, false, '0x3234567890123456789012345678901234567892', true, NOW() - INTERVAL '4 months'),
        ('agent1@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'agent', 'Dr. Anil Verma', '+919988776655', 'New Delhi, India', false, false, '0x4234567890123456789012345678901234567893', true, NOW() - INTERVAL '8 months'),
        ('agent2@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'agent', 'Meera Iyer', '+919876501234', 'Chennai, Tamil Nadu, India', false, false, '0x5234567890123456789012345678901234567894', true, NOW() - INTERVAL '7 months'),
        ('buyer1@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Vikram Singh', '+919123456789', 'Pune, Maharashtra, India', false, true, '0x6234567890123456789012345678901234567895', true, NOW() - INTERVAL '3 months'),
        ('buyer2@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Sneha Reddy', '+918555444333', 'Hyderabad, Telangana, India', false, true, '0x7234567890123456789012345678901234567896', true, NOW() - INTERVAL '2 months'),
        ('admin@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'admin', 'Admin User', '+911234567899', 'Mumbai, Maharashtra, India', false, false, '0x8234567890123456789012345678901234567897', true, NOW() - INTERVAL '12 months')
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        phone_number = EXCLUDED.phone_number,
        address = EXCLUDED.address
      RETURNING id, email, name
    `);
    
    console.log(`✅ Created ${usersResult.rows.length} Indian users`);
    
    // Get user IDs
    const users = {};
    usersResult.rows.forEach(user => {
      users[user.email] = user.id;
    });
    
    // Create 12 projects with full details
    const projects = [
      // DRAFT
      {
        seller: 'seller1@carbonx.com',
        title: 'Western Ghats Biodiversity Reforestation',
        type: 'afforestation',
        scale: 'large',
        status: 'draft',
        details: {
          country: 'India',
          state_region: 'Maharashtra',
          latitude: 16.9902,
          longitude: 73.7898,
          total_project_area_hectares: 3500,
          eligible_area_hectares: 3200,
          duration_months: 240, // 20 years
          crediting_period_months: 240,
          project_summary: 'Large-scale reforestation in Western Ghats biodiversity hotspot. Planting native species including Teak, Mango, Neem, Sandalwood. Working with 1200 tribal families for implementation. Expected sequestration: 850,000 tons CO2 over 20 years.',
          climate_zone: 'Tropical Monsoon',
          soil_type: 'Red Laterite',
          dominant_species: 'Teak, Mango, Neem, Sandalwood, Bamboo',
          species_type: 'Native Mixed Species',
          methodology_applied: 'AR-ACM0003 Afforestation and Reforestation',
          baseline_scenario: 'Degraded land with less than 10 percent tree cover used for low-productivity grazing',
          additionality_demonstration: 'Investment barrier: High initial cost not viable without carbon credits'
        }
      },
      {
        seller: 'seller2@carbonx.com',
        title: 'Rajasthan Solar-Wind Hybrid Energy',
        type: 'renewable_energy',
        scale: 'large',
        status: 'draft',
        details: {
          country: 'India',
          state_region: 'Rajasthan',
          latitude: 26.9124,
          longitude: 70.9083,
          duration_months: 300, // 25 years
          crediting_period_months: 120, // 10 years
          project_summary: '50 MW Solar + 30 MW Wind hybrid renewable energy project. Expected annual generation: 180 GWh avoiding 145,000 tons CO2 per year. Grid connection at 132 kV.',
          climate_zone: 'Hot Semi-Arid',
          methodology_applied: 'ACM0002 Grid-connected renewable electricity',
          baseline_scenario: 'Electricity supplied by coal-heavy Indian grid with CO2 intensity of 0.82 kg per kWh',
          additionality_demonstration: 'Barrier analysis: High capital cost not viable without carbon credits'
        }
      },
      // PENDING
      {
        seller: 'seller3@carbonx.com',
        title: 'Tamil Nadu Coastal Mangrove Restoration',
        type: 'afforestation',
        scale: 'medium',
        status: 'pending',
        details: {
          country: 'India',
          state_region: 'Tamil Nadu',
          latitude: 10.7905,
          longitude: 79.8374,
          total_project_area_hectares: 600,
          eligible_area_hectares: 550,
          duration_months: 360, // 30 years
          crediting_period_months: 360,
          project_summary: 'Restoration of degraded mangrove ecosystems. Planting 800,000 mangrove saplings. Training for 500 fishing families. Critical for coastal protection and biodiversity.',
          climate_zone: 'Tropical Coastal',
          soil_type: 'Saline Mudflat',
          dominant_species: 'Avicennia marina, Rhizophora mucronata',
          species_type: 'Mangrove Species',
          methodology_applied: 'AR-AMS0003 Simplified small-scale afforestation',
          baseline_scenario: 'Mudflats with sparse mangrove cover. Abandoned shrimp farms.',
          additionality_demonstration: 'High cost of propagule collection and nursery'
        }
      },
      {
        seller: 'seller1@carbonx.com',
        title: 'Gujarat Rural Biogas Program',
        type: 'renewable_energy',
        scale: 'medium',
        status: 'pending',
        details: {
          country: 'India',
          state_region: 'Gujarat',
          latitude: 22.3039,
          longitude: 73.1812,
          duration_months: 252, // 21 years
          crediting_period_months: 84, // 7 years
          project_summary: 'Installation of 5,000 household biogas plants. Replacing firewood and LPG. Expected emissions reduction: 35,000 tons CO2e per year.',
          climate_zone: 'Hot Semi-Arid',
          methodology_applied: 'AMS-I.C Small-scale renewable energy',
          baseline_scenario: 'Households use firewood, LPG cylinders, and dung cakes for cooking',
          additionality_demonstration: 'Technology and financial barriers without carbon finance'
        }
      },
      // ASSIGNED
      {
        seller: 'seller2@carbonx.com',
        agent: 'agent1@carbonx.com',
        title: 'Karnataka Coastal Wind Energy',
        type: 'renewable_energy',
        scale: 'large',
        status: 'assigned',
        details: {
          country: 'India',
          state_region: 'Karnataka',
          latitude: 14.8543,
          longitude: 74.1314,
          total_project_area_hectares: 800,
          duration_months: 300, // 25 years
          crediting_period_months: 120,
          project_summary: '100 MW wind farm with 40 wind turbines. Annual generation: 280 GWh. Estimated annual emission reduction: 220,000 tons CO2.',
          climate_zone: 'Tropical Monsoon Coastal',
          methodology_applied: 'ACM0002 Grid-connected electricity generation',
          baseline_scenario: 'Southern grid with emission factor of 0.79 kg CO2 per kWh',
          additionality_demonstration: 'Investment barrier: IRR below minimum threshold without carbon credits'
        }
      },
      {
        seller: 'seller3@carbonx.com',
        agent: 'agent2@carbonx.com',
        title: 'Uttar Pradesh Agroforestry',
        type: 'afforestation',
        scale: 'large',
        status: 'assigned',
        details: {
          country: 'India',
          state_region: 'Uttar Pradesh',
          latitude: 26.8467,
          longitude: 80.9462,
          total_project_area_hectares: 8000,
          eligible_area_hectares: 7500,
          duration_months: 240,
          crediting_period_months: 240,
          project_summary: 'Covering 15,000 smallholder farmers. Integration of Poplar, Eucalyptus, Mango, Guava with wheat and sugarcane. Expected sequestration: 180,000 tons over 20 years.',
          climate_zone: 'Humid Subtropical',
          soil_type: 'Alluvial Loam',
          dominant_species: 'Poplar, Eucalyptus, Mango, Guava',
          species_type: 'Mixed Agroforestry',
          methodology_applied: 'AR-AMS0001 Simplified agroforestry',
          baseline_scenario: 'Monoculture of wheat-sugarcane with no tree component',
          additionality_demonstration: 'Farmers lack capital for saplings. No credit access.'
        }
      },
      // IN_PROGRESS
      {
        seller: 'seller1@carbonx.com',
        agent: 'agent1@carbonx.com',
        title: 'Maharashtra Watershed Reforestation',
        type: 'afforestation',
        scale: 'large',
        status: 'in_progress',
        details: {
          country: 'India',
          state_region: 'Maharashtra',
          latitude: 19.8762,
          longitude: 75.3433,
          total_project_area_hectares: 5000,
          eligible_area_hectares: 4800,
          duration_months: 300,
          crediting_period_months: 300,
          project_summary: 'Integrated watershed management in drought-prone Marathwada. Reforestation, soil conservation, water harvesting. Benefits 3,000 farming families.',
          climate_zone: 'Hot Semi-Arid',
          soil_type: 'Shallow Black Soil',
          dominant_species: 'Neem, Tamarind, Custard Apple, Ber',
          species_type: 'Drought-Resistant Native',
          methodology_applied: 'AR-ACM0003 Afforestation in degraded land',
          baseline_scenario: 'Degraded common land with less than 5 percent tree cover',
          additionality_demonstration: 'Land tenure and financial barriers'
        }
      },
      {
        seller: 'seller2@carbonx.com',
        agent: 'agent2@carbonx.com',
        title: 'Odisha Solar Irrigation',
        type: 'renewable_energy',
        scale: 'medium',
        status: 'in_progress',
        details: {
          country: 'India',
          state_region: 'Odisha',
          latitude: 20.9517,
          longitude: 85.0985,
          duration_months: 240,
          crediting_period_months: 120,
          project_summary: 'Installation of 8,000 solar-powered irrigation pumps. Replacing diesel pumps. Expected diesel displacement: 24 million liters. Emissions reduction: 65,000 tons CO2 per year.',
          climate_zone: 'Tropical Monsoon',
          methodology_applied: 'AMS-I.A Small-scale renewable energy',
          baseline_scenario: 'Farmers use diesel pumps or depend on monsoon rain',
          additionality_demonstration: 'Financial barrier: High upfront cost for farmers'
        }
      },
      // VERIFIED
      {
        seller: 'seller3@carbonx.com',
        agent: 'agent1@carbonx.com',
        title: 'Madhya Pradesh Tribal Bamboo Plantation',
        type: 'afforestation',
        scale: 'large',
        status: 'verified',
        details: {
          country: 'India',
          state_region: 'Madhya Pradesh',
          latitude: 22.9734,
          longitude: 78.6569,
          total_project_area_hectares: 6000,
          eligible_area_hectares: 5800,
          duration_months: 360,
          crediting_period_months: 240,
          project_summary: 'Community-based bamboo plantation under Forest Rights Act. Planting high-yielding bamboo species. Expected carbon stock: 850,000 tons over 20 years. Benefits 5,000 tribal families.',
          climate_zone: 'Tropical Dry',
          soil_type: 'Red Sandy Loam',
          dominant_species: 'Bambusa bambos, Dendrocalamus strictus',
          species_type: 'Bamboo Monoculture',
          methodology_applied: 'AR-ACM0003 Afforestation',
          baseline_scenario: 'Degraded forest land with sparse natural bamboo',
          additionality_demonstration: 'Land tenure and financial barriers'
        }
      },
      {
        seller: 'seller1@carbonx.com',
        agent: 'agent2@carbonx.com',
        title: 'Himachal Pradesh Micro-Hydro',
        type: 'renewable_energy',
        scale: 'small',
        status: 'verified',
        details: {
          country: 'India',
          state_region: 'Himachal Pradesh',
          latitude: 31.1048,
          longitude: 77.1734,
          duration_months: 420, // 35 years
          crediting_period_months: 120,
          project_summary: 'Bundled micro-hydro project with 25 run-of-river plants (total 15 MW). Annual generation: 75 GWh. Emissions reduction: 65,000 tons CO2 per year. Electricity to 45 remote villages.',
          climate_zone: 'Temperate Highland',
          methodology_applied: 'ACM0002 Grid-connected renewable energy',
          baseline_scenario: 'Remote villages use diesel gensets. High electricity cost.',
          additionality_demonstration: 'Technology and financial barriers in mountain terrain'
        }
      },
      // APPROVED
      {
        seller: 'seller2@carbonx.com',
        agent: 'agent1@carbonx.com',
        title: 'Assam Tea Estate Buffer Zone Reforestation',
        type: 'afforestation',
        scale: 'large',
        status: 'approved',
        details: {
          country: 'India',
          state_region: 'Assam',
          latitude: 26.2006,
          longitude: 92.9376,
          total_project_area_hectares: 4500,
          eligible_area_hectares: 4300,
          duration_months: 360,
          crediting_period_months: 360,
          project_summary: 'Restoration of degraded land around tea estates. Creating buffer zone between tea gardens and elephant corridors. Expected sequestration: 420,000 tons over 30 years. Employment for 800 tea workers.',
          climate_zone: 'Tropical Monsoon',
          soil_type: 'Red Laterite and Alluvial',
          dominant_species: 'Elephant Apple, Wild Banana, Ficus, Bamboo',
          species_type: 'Native Mixed Rainforest',
          methodology_applied: 'AR-ACM0003 Afforestation',
          baseline_scenario: 'Degraded land with invasive species. No natural regeneration.',
          additionality_demonstration: 'Investment and social barriers. Carbon revenue funds worker insurance.'
        }
      },
      {
        seller: 'seller3@carbonx.com',
        agent: 'agent2@carbonx.com',
        title: 'Punjab Agricultural Solar Rooftop',
        type: 'renewable_energy',
        scale: 'large',
        status: 'approved',
        details: {
          country: 'India',
          state_region: 'Punjab',
          latitude: 31.1471,
          longitude: 75.3412,
          duration_months: 300,
          crediting_period_months: 120,
          project_summary: 'Installation of solar rooftop on 10,000 farm buildings. Total capacity: 50 MW. Annual generation: 75 GWh. Emissions reduction: 60,000 tons CO2 per year. Excess power sold to grid.',
          climate_zone: 'Humid Subtropical',
          methodology_applied: 'ACM0002 Grid-connected renewable',
          baseline_scenario: 'Farmers use Northern grid electricity and diesel gensets',
          additionality_demonstration: 'Financial barriers. High upfront costs for farmers.'
        }
      }
    ];
    
    // Insert projects with details
    for (const proj of projects) {
      const projectResult = await client.query(`
        INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE + INTERVAL '5 years', NOW() - INTERVAL '10 days', NOW())
        RETURNING id
      `, [
        users[proj.seller],
        proj.agent ? users[proj.agent] : null,
        proj.title,
        proj.type,
        proj.scale,
        proj.status
      ]);
      
      const projectId = projectResult.rows[0].id;
      
      // Insert project details
      await client.query(`
        INSERT INTO project_details (
          project_id, country, state_region, latitude, longitude,
          total_project_area_hectares, eligible_area_hectares,
          duration_months, crediting_period_months, project_summary,
          climate_zone, soil_type, dominant_species, species_type,
          methodology_applied, baseline_scenario, additionality_demonstration
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `, [
        projectId,
        proj.details.country,
        proj.details.state_region,
        proj.details.latitude,
        proj.details.longitude,
        proj.details.total_project_area_hectares || null,
        proj.details.eligible_area_hectares || null,
        proj.details.duration_months,
        proj.details.crediting_period_months,
        proj.details.project_summary,
        proj.details.climate_zone || null,
        proj.details.soil_type || null,
        proj.details.dominant_species || null,
        proj.details.species_type || null,
        proj.details.methodology_applied,
        proj.details.baseline_scenario,
        proj.details.additionality_demonstration
      ]);
      
      console.log(`  ✅ ${proj.title} (${proj.status})`);
    }
    
    await client.query('COMMIT');
    
    console.log('\n✅ All Indian projects seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('   • 8 Users (all from India)');
    console.log('   • 12 Projects with complete details');
    console.log('   • 2 projects in each stage (draft → approved)');
    console.log('   • All project_details tables filled\n');
    console.log('🔑 Login with: seller1@carbonx.com / Password123!\n');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedIndianProjects();
