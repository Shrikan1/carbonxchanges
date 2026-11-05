const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/**
 * Complete project data update script
 * Fills ALL project_details fields with comprehensive, realistic Indian data
 */

async function completeProjectData() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Updating projects with complete data...\n');
    
    await client.query('BEGIN');
    
    // Get all projects
    const projectsResult = await client.query(`
      SELECT p.id, p.title, p.project_type, p.status, pd.project_id
      FROM projects p
      LEFT JOIN project_details pd ON p.id = pd.project_id
      ORDER BY p.id
    `);
    
    const projects = projectsResult.rows;
    
    for (const project of projects) {
      console.log(`📦 Updating: ${project.title}`);
      
      // Determine data based on project type
      const isAfforestation = project.project_type === 'afforestation';
      const isRenewable = project.project_type === 'renewable_energy';
      
      // Common data for all projects
      const commonData = {
        project_start_date: '2023-04-01',
        funding_sources: 'Private investment, Carbon credit pre-purchase agreements, Government green energy subsidy',
        publicly_funded: false,
        measurement_season: isAfforestation ? 'Post-monsoon (September-November)' : null,
        uncertainty_percentage: isAfforestation ? 15.5 : 8.2,
        monitoring_frequency: 'Quarterly field visits, Annual satellite imagery analysis, Bi-annual community reports',
        responsible_person: isAfforestation ? 'Dr. Ramesh Gupta, Chief Forestry Officer' : 'Eng. Priya Menon, Technical Lead',
        stakeholder_consultation_summary: 'Three rounds of village-level consultations conducted. Local panchayat approval obtained. Women self-help groups engaged for implementation. Employment benefits shared with community.',
        grievance_mechanism: 'Toll-free helpline: 1800-XXX-XXXX. WhatsApp grievance group. Monthly gram sabha review meetings. Online complaint portal: carbonxplanet.com/grievance',
        owner_full_name: 'Green Earth Foundation Trust',
        owner_id_type: 'Trust Registration',
        owner_id_number: `TR${Math.floor(Math.random() * 100000)}`,
        land_ownership_type: isAfforestation ? 'Community land lease (99 years) + Private farmland agreements' : 'Private land ownership',
        sdg_targets: isAfforestation 
          ? '13.2 Climate Action, 15.1 Life on Land, 15.2 Sustainable Forest Management, 1.2 Poverty Reduction, 5.5 Gender Equality'
          : '7.2 Renewable Energy, 13.1 Climate Action, 8.2 Economic Productivity, 9.4 Clean Infrastructure',
      };
      
      // Type-specific data
      let specificData = {};
      
      if (isAfforestation) {
        specificData = {
          set_aside_conservation_percent: 12.0,
          hydrology_status: 'Seasonal streams present. Moderate groundwater level. No permanent water bodies within project boundary.',
          land_title_status: 'Community land (gram panchayat). Individual farmer agreements signed and registered at Tehsil office.',
          above_ground_biomass: 85.4, // tons C per hectare
          below_ground_biomass: 22.3,
          soil_organic_carbon_0_30cm: 18.6,
          soil_organic_carbon_30_100cm: 12.4,
          dead_wood_carbon: 3.2,
          litter_carbon: 4.1,
          sampling_plots: 150,
          biodiversity_index: 0.82, // Shannon index
          technologies_measures_description: 'GPS-tagged saplings with QR codes for tracking. Drip irrigation using solar pumps. Mobile app for field monitoring. Satellite imagery analysis for canopy cover. Community-based protection committees.',
          ghg_sources_included: 'CO2 from biomass growth, CH4 avoided from biomass burning, N2O soil sequestration',
          total_co2_claimed: Math.floor(Math.random() * 500000) + 250000, // tons CO2e
          estimated_vers: Math.floor(Math.random() * 400000) + 200000, // VERs
          buffer_pool_percent: 20.0,
          aadhaar_doc_path: '/uploads/documents/aadhaar_verification_trust.pdf',
          land_deed_path: '/uploads/documents/land_lease_agreement_registered.pdf',
          live_verification_photo_path: '/uploads/verification/field_visit_photo.jpg',
        };
      } else if (isRenewable) {
        specificData = {
          set_aside_conservation_percent: null,
          hydrology_status: null,
          land_title_status: 'Private freehold land. Sale deeds registered.',
          above_ground_biomass: null,
          below_ground_biomass: null,
          soil_organic_carbon_0_30cm: null,
          soil_organic_carbon_30_100cm: null,
          dead_wood_carbon: null,
          litter_carbon: null,
          sampling_plots: null,
          biodiversity_index: null,
          technologies_measures_description: 'SCADA system for real-time monitoring. Grid synchronization with 132kV substation. IoT sensors for equipment health. Automated data logging to government portal. Remote O&M capability.',
          ghg_sources_included: 'CO2 avoided from grid displacement (coal/gas power plants)',
          total_co2_claimed: Math.floor(Math.random() * 300000) + 100000,
          estimated_vers: Math.floor(Math.random() * 250000) + 80000,
          buffer_pool_percent: 10.0,
          aadhaar_doc_path: '/uploads/documents/company_director_aadhaar.pdf',
          land_deed_path: '/uploads/documents/land_purchase_deed.pdf',
          live_verification_photo_path: '/uploads/verification/site_inspection.jpg',
        };
      }
      
      // Merge all data
      const updateData = { ...commonData, ...specificData };
      
      // Update project_details
      if (project.project_id) {
        // Update existing record
        const updateQuery = `
          UPDATE project_details SET
            project_start_date = $1,
            funding_sources = $2,
            publicly_funded = $3,
            set_aside_conservation_percent = $4,
            hydrology_status = $5,
            land_title_status = $6,
            measurement_season = $7,
            above_ground_biomass = $8,
            below_ground_biomass = $9,
            soil_organic_carbon_0_30cm = $10,
            soil_organic_carbon_30_100cm = $11,
            dead_wood_carbon = $12,
            litter_carbon = $13,
            sampling_plots = $14,
            biodiversity_index = $15,
            uncertainty_percentage = $16,
            technologies_measures_description = $17,
            ghg_sources_included = $18,
            sdg_targets = $19,
            total_co2_claimed = $20,
            estimated_vers = $21,
            buffer_pool_percent = $22,
            monitoring_frequency = $23,
            responsible_person = $24,
            stakeholder_consultation_summary = $25,
            grievance_mechanism = $26,
            owner_full_name = $27,
            owner_id_type = $28,
            owner_id_number = $29,
            land_ownership_type = $30,
            aadhaar_doc_path = $31,
            land_deed_path = $32,
            live_verification_photo_path = $33,
            updated_at = NOW()
          WHERE project_id = $34
        `;
        
        await client.query(updateQuery, [
          updateData.project_start_date,
          updateData.funding_sources,
          updateData.publicly_funded,
          updateData.set_aside_conservation_percent,
          updateData.hydrology_status,
          updateData.land_title_status,
          updateData.measurement_season,
          updateData.above_ground_biomass,
          updateData.below_ground_biomass,
          updateData.soil_organic_carbon_0_30cm,
          updateData.soil_organic_carbon_30_100cm,
          updateData.dead_wood_carbon,
          updateData.litter_carbon,
          updateData.sampling_plots,
          updateData.biodiversity_index,
          updateData.uncertainty_percentage,
          updateData.technologies_measures_description,
          updateData.ghg_sources_included,
          updateData.sdg_targets,
          updateData.total_co2_claimed,
          updateData.estimated_vers,
          updateData.buffer_pool_percent,
          updateData.monitoring_frequency,
          updateData.responsible_person,
          updateData.stakeholder_consultation_summary,
          updateData.grievance_mechanism,
          updateData.owner_full_name,
          updateData.owner_id_type,
          updateData.owner_id_number,
          updateData.land_ownership_type,
          updateData.aadhaar_doc_path,
          updateData.land_deed_path,
          updateData.live_verification_photo_path,
          project.id
        ]);
        
        console.log(`   ✅ Updated complete data`);
      } else {
        console.log(`   ⚠️  No project_details record found, skipping`);
      }
    }
    
    await client.query('COMMIT');
    
    console.log('\n✅ All projects updated with complete data!\n');
    console.log('📊 Updated fields:');
    console.log('   • Project dates and funding sources');
    console.log('   • Land ownership and legal documents');
    console.log('   • Carbon calculations (biomass, soil carbon)');
    console.log('   • Monitoring and verification details');
    console.log('   • Stakeholder consultation records');
    console.log('   • SDG alignment targets');
    console.log('   • Technologies and methodologies\n');
    
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

completeProjectData();
