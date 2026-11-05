-- Complete Indian Carbon Credit Projects Seed Data
-- This creates realistic Indian carbon offset projects with full details

-- First, create Indian users (sellers, agents, buyers, admin)
INSERT INTO users (email, password_hash, role, name, phone_number, address, is_seller, is_buyer, wallet_address, is_verified, created_at)
VALUES
  -- Sellers (Indian NGOs and Companies)
  ('seller1@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Rajesh Kumar', '+919876543210', 'Mumbai, Maharashtra, India', true, false, '0x1234567890123456789012345678901234567890', true, NOW() - INTERVAL '6 months'),
  ('seller2@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Priya Sharma', '+918765432109', 'Bangalore, Karnataka, India', true, false, '0x2234567890123456789012345678901234567891', true, NOW() - INTERVAL '5 months'),
  ('seller3@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Amit Patel', '+919123456780', 'Ahmedabad, Gujarat, India', true, false, '0x3234567890123456789012345678901234567892', true, NOW() - INTERVAL '4 months'),
  
  -- Agents (Indian Carbon Verification Experts)
  ('agent1@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'agent', 'Dr. Anil Verma', '+919988776655', 'New Delhi, India', false, false, '0x4234567890123456789012345678901234567893', true, NOW() - INTERVAL '8 months'),
  ('agent2@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'agent', 'Meera Iyer', '+919876501234', 'Chennai, Tamil Nadu, India', false, false, '0x5234567890123456789012345678901234567894', true, NOW() - INTERVAL '7 months'),
  
  -- Buyers (Indian Corporations)
  ('buyer1@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Vikram Singh', '+919123456789', 'Pune, Maharashtra, India', false, true, '0x6234567890123456789012345678901234567895', true, NOW() - INTERVAL '3 months'),
  ('buyer2@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Sneha Reddy', '+918555444333', 'Hyderabad, Telangana, India', false, true, '0x7234567890123456789012345678901234567896', true, NOW() - INTERVAL '2 months'),
  
  -- Admin (Platform Manager)
  ('admin@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'admin', 'Admin User', '+911234567899', 'Mumbai, Maharashtra, India', false, false, '0x8234567890123456789012345678901234567897', true, NOW() - INTERVAL '12 months')
ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  phone_number = EXCLUDED.phone_number,
  address = EXCLUDED.address,
  is_seller = EXCLUDED.is_seller,
  is_buyer = EXCLUDED.is_buyer;

-- ===========================
-- STAGE 1: DRAFT (2 projects)
-- ===========================

-- Project 1: Western Ghats Reforestation
WITH new_project AS (
  INSERT INTO projects (seller_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller1@carbonx.com' LIMIT 1),
    'Western Ghats Biodiversity Reforestation',
    'afforestation',
    'large',
    'draft',
    CURRENT_DATE + INTERVAL '8 years',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  total_project_area_hectares,
  eligible_area_hectares,
  climate_zone,
  soil_type,
  dominant_species,
  species_type,
  above_ground_biomass,
  below_ground_biomass,
  soil_organic_carbon_0_30cm,
  sampling_plots,
  biodiversity_index,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  20,
  20,
  '2024-06-01'::date,
  'Large-scale reforestation project in Western Ghats biodiversity hotspot. Planting native species to restore degraded forest land, enhance biodiversity, and sequester carbon. Working with local tribal communities for implementation and long-term monitoring.',
  'India',
  'Maharashtra',
  16.9902,
  73.7898,
  3500.00,
  3200.00,
  'Tropical Monsoon',
  'Red Laterite',
  'Teak, Mango, Neem, Sandalwood, Bamboo',
  'Native Mixed Species',
  125.50,
  35.20,
  45.30,
  120,
  8.5,
  'Community-based plantation of 1.2 million native trees. Drip irrigation for first 2 years. Protection through community patrolling. Monitoring using drone surveys and ground sampling.',
  'AR-ACM0003 Afforestation and Reforestation',
  'Degraded land with <10% tree cover used for low-productivity grazing. No government reforestation plans for this area.',
  'Investment barrier: High initial cost not viable without carbon credits. Financial analysis shows IRR becomes positive only with carbon revenue. Local community lacks resources for large-scale plantation.'
FROM new_project;

-- Project 2: Rajasthan Solar-Wind Hybrid
WITH new_project AS (
  INSERT INTO projects (seller_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller2@carbonx.com' LIMIT 1),
    'Rajasthan Solar-Wind Hybrid Energy Project',
    'renewable_energy',
    'large',
    'draft',
    CURRENT_DATE + INTERVAL '3 years',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  total_project_area_hectares,
  climate_zone,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  25,
  10,
  '2024-10-01'::date,
  '50 MW Solar + 30 MW Wind hybrid renewable energy project in Rajasthan. Replacing coal-based grid electricity with clean energy. Expected annual generation: 180 GWh, avoiding 145,000 tons CO2 per year.',
  'India',
  'Rajasthan',
  26.9124,
  70.9083,
  250.00,
  'Hot Semi-Arid',
  '50 MW solar PV with 30 MW wind turbines (10x3MW). Smart hybrid controller for optimal generation. Battery storage: 20 MWh. Grid connection at 132 kV substation.',
  'ACM0002 Grid-connected renewable electricity',
  'In absence of project, electricity would be supplied by coal-heavy Indian grid (CO2 intensity: 0.82 kg/kWh). No renewable energy policy mandates for private companies in this region.',
  'Barrier analysis: High capital cost not viable at current tariff without carbon credits. IRR without carbon revenue below hurdle rate. Technology barrier: Hybrid renewable systems new in this region.'
FROM new_project;

-- ===========================
-- STAGE 2: PENDING (2 projects)
-- ===========================

-- Project 3: Tamil Nadu Mangrove Restoration
WITH new_project AS (
  INSERT INTO projects (seller_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller3@carbonx.com' LIMIT 1),
    'Tamil Nadu Coastal Mangrove Restoration',
    'afforestation',
    'medium',
    'pending',
    CURRENT_DATE + INTERVAL '15 years',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '2 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  total_project_area_hectares,
  eligible_area_hectares,
  climate_zone,
  soil_type,
  dominant_species,
  species_type,
  above_ground_biomass,
  below_ground_biomass,
  soil_organic_carbon_0_30cm,
  sampling_plots,
  biodiversity_index,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  30,
  30,
  '2024-01-15'::date,
  'Restoration of degraded mangrove ecosystems along Tamil Nadu coast. Planting 800,000 mangrove saplings across 600 hectares. Critical for coastal protection, fisheries, and biodiversity. Community-led with training for 500 fishing families.',
  'India',
  'Tamil Nadu',
  10.7905,
  79.8374,
  600.00,
  550.00,
  'Tropical Coastal',
  'Saline Mudflat',
  'Avicennia marina, Rhizophora mucronata, Bruguiera gymnorrhiza',
  'Mangrove Species',
  85.30,
  120.50,
  180.20,
  80,
  9.2,
  'Propagule collection and nursery raising. Community planting during monsoon. Protection from grazing animals. Regular monitoring of survival rates and growth. Training of local Self-Help Groups for maintenance.',
  'AR-AMS0003 Simplified small-scale afforestation',
  'Mudflats with sparse mangrove cover (<5%). Abandoned shrimp farms reverted to wasteland. High salinity preventing natural regeneration. Cyclone damage not naturally recovering.',
  'Common practice barrier: No similar coastal restoration in this region. Investment barrier: High cost of propagule collection and nursery. Fishing communities lack capital for restoration.'
FROM new_project;

-- Project 4: Gujarat Biogas Program
WITH new_project AS (
  INSERT INTO projects (seller_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller1@carbonx.com' LIMIT 1),
    'Gujarat Rural Biogas Dissemination Program',
    'renewable_energy',
    'medium',
    'pending',
    CURRENT_DATE + INTERVAL '2 years',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '1 day'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  climate_zone,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  21,
  7,
  '2024-09-01'::date,
  'Installation of 5,000 household biogas plants (2-4 cubic meter capacity) in rural Gujarat. Replacing firewood and LPG for cooking. Expected emissions reduction: 35,000 tons CO2e per year. Improves indoor air quality and reduces deforestation.',
  'India',
  'Gujarat',
  22.3039,
  73.1812,
  'Hot Semi-Arid',
  'Installation of fixed-dome biogas plants using cattle dung as feedstock. Each unit serves 1 family (5-6 members). Technical training and after-sales service for 5 years. Microfinance support for upfront cost.',
  'AMS-I.C Small-scale renewable energy',
  'Baseline: Households use firewood (70%), LPG cylinders (20%), and dung cakes (10%) for cooking. No access to piped gas. Nearest biogas projects are 200+ km away in other districts.',
  'Technology barrier: Biogas technology known but not widely adopted due to lack of awareness and upfront cost. Financial barrier: Unit cost not affordable for rural households with low average income. Without carbon finance program not viable.'
FROM new_project;

-- ===========================
-- STAGE 3: ASSIGNED (2 projects)
-- ===========================

-- Project 5: Karnataka Wind Farm
WITH new_project AS (
  INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller2@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent1@carbonx.com' LIMIT 1),
    'Karnataka Coastal Wind Energy Project',
    'renewable_energy',
    'large',
    'assigned',
    CURRENT_DATE + INTERVAL '20 years',
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '5 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  total_project_area_hectares,
  climate_zone,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  25,
  10,
  '2023-12-01'::date,
  '100 MW wind farm with 40 wind turbines in coastal Karnataka. Annual generation capacity: 280 GWh. Displacing coal-based electricity from Southern grid. Estimated annual emission reduction: 220,000 tons CO2. Community benefit sharing through local employment and skill development.',
  'India',
  'Karnataka',
  14.8543,
  74.1314,
  800.00,
  'Tropical Monsoon Coastal',
  '40 wind turbine generators of 2.5 MW each. Hub height: 100m, rotor diameter: 120m. Grid integration at 110 kV level. SCADA monitoring system for real-time performance. Preventive maintenance schedule for 98% uptime.',
  'ACM0002 Grid-connected electricity generation',
  'Southern grid with average emission factor of 0.79 kg CO2/kWh. Mix of coal (60%), hydro (20%), gas (10%), renewables (10%). No mandated renewable purchase obligations for open access consumers in Karnataka during project start year.',
  'Investment barrier: Project IRR without carbon credits below minimum threshold. High upfront capital. PPA tariff insufficient without carbon revenue. Technology barrier: Offshore-grade turbines for coastal location require specialized expertise.'
FROM new_project;

-- Project 6: Uttar Pradesh Agroforestry
WITH new_project AS (
  INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller3@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent2@carbonx.com' LIMIT 1),
    'Uttar Pradesh Agroforestry Carbon Project',
    'afforestation',
    'large',
    'assigned',
    CURRENT_DATE + INTERVAL '10 years',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '4 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  total_project_area_hectares,
  eligible_area_hectares,
  climate_zone,
  soil_type,
  dominant_species,
  species_type,
  above_ground_biomass,
  below_ground_biomass,
  soil_organic_carbon_0_30cm,
  sampling_plots,
  biodiversity_index,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  20,
  20,
  '2024-03-01'::date,
  'Large-scale agroforestry project covering 15,000 smallholder farmers across 8,000 hectares in Uttar Pradesh. Integration of timber species (Poplar, Eucalyptus) and fruit trees (Mango, Guava) with wheat and sugarcane cultivation. Expected carbon sequestration: 180,000 tons over 20 years.',
  'India',
  'Uttar Pradesh',
  26.8467,
  80.9462,
  8000.00,
  7500.00,
  'Humid Subtropical',
  'Alluvial Loam',
  'Poplar, Eucalyptus, Mango, Guava, Bamboo',
  'Mixed Agroforestry',
  92.40,
  28.60,
  52.30,
  350,
  6.8,
  'Boundary plantation and block plantation models. Farmers receive free saplings, training, and technical support. Trees planted at optimized spacing (6m x 4m) for crop growth. Farmer Producer Organization for marketing timber. Carbon revenue shared with farmers (70%) and implementing agency (30%).',
  'AR-AMS0001 Simplified agroforestry',
  'Current practice: Monoculture of wheat-sugarcane with no tree component. Intensive tillage and fertilizer use. Biomass burning common. Average farm income: Rs. 60,000 per hectare per year.',
  'Investment barrier: Farmers lack capital for saplings. Institutional barrier: No credit access for agroforestry. Technology barrier: Farmers have no experience with timber species. Social barrier: Fear of land use restrictions. Carbon credit revenue de-risks adoption.'
FROM new_project;

-- ===========================
-- STAGE 4: IN_PROGRESS (2 projects)
-- ===========================

-- Project 7: Maharashtra Watershed Management
WITH new_project AS (
  INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller1@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent1@carbonx.com' LIMIT 1),
    'Maharashtra Drought-Prone Watershed Reforestation',
    'afforestation',
    'large',
    'in_progress',
    CURRENT_DATE + INTERVAL '12 years',
    NOW() - INTERVAL '28 days',
    NOW() - INTERVAL '8 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  total_project_area_hectares,
  eligible_area_hectares,
  climate_zone,
  soil_type,
  dominant_species,
  species_type,
  above_ground_biomass,
  below_ground_biomass,
  soil_organic_carbon_0_30cm,
  sampling_plots,
  biodiversity_index,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  25,
  25,
  '2023-10-01'::date,
  'Integrated watershed management combining reforestation, soil conservation, and water harvesting across 5,000 hectares in drought-prone Marathwada region. Planting drought-resistant native species. Expected benefits: carbon sequestration, groundwater recharge, reduced soil erosion, livelihood support for 3,000 farming families.',
  'India',
  'Maharashtra',
  19.8762,
  75.3433,
  5000.00,
  4800.00,
  'Hot Semi-Arid',
  'Shallow Black Soil',
  'Neem, Tamarind, Custard Apple, Ber, Subabul',
  'Drought-Resistant Native',
  68.20,
  22.50,
  35.40,
  200,
  7.1,
  'Ridge to valley treatment approach. Contour trenches and check dams for water conservation. Community nursery for 500,000 saplings annually. Staggered plantation across 5 years. Community Forest Rights granted. Joint Forest Management committees formed.',
  'AR-ACM0003 Afforestation in degraded land',
  'Baseline: Degraded common land with <5% tree cover. Overgrazing by goats and cattle. Severe soil erosion (>20 tons/ha/year). No natural regeneration due to biotic pressure. Recurring droughts every 3-4 years.',
  'Land tenure barrier: Common land under Forest Department with access restrictions. Community participation needed for success. Financial barrier: High watershed treatment cost. Government schemes cover only 30 percent. Carbon finance fills gap.'
FROM new_project;

-- Project 8: Odisha Solar Irrigation
WITH new_project AS (
  INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller2@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent2@carbonx.com' LIMIT 1),
    'Odisha Solar Irrigation Pump Program',
    'renewable_energy',
    'medium',
    'in_progress',
    CURRENT_DATE + INTERVAL '15 years',
    NOW() - INTERVAL '32 days',
    NOW() - INTERVAL '6 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  climate_zone,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  20,
  10,
  '2023-08-01'::date,
  'Installation of 8,000 solar-powered irrigation pumps (5 HP each) for small and marginal farmers in Odisha. Replacing diesel pumps and providing irrigation access to rain-fed areas. Expected annual diesel displacement: 24 million liters. Emissions reduction: 65,000 tons CO2 per year. Coverage: 12,000 farmers across 20,000 hectares.',
  'India',
  'Odisha',
  20.9517,
  85.0985,
  'Tropical Monsoon',
  'Each solar pump includes: 5 HP submersible pump, 3.75 kW solar panels (15 panels x 250W), pump controller with MPPT, drip irrigation system. 5-year comprehensive warranty and maintenance. Remote monitoring via IoT sensors. Farmer training on operation and maintenance.',
  'AMS-I.A Small-scale renewable energy',
  'Baseline: Farmers use diesel pumps (7,000 pumps) or depend solely on monsoon rain (1,000 rain-fed farms). Diesel consumption: 3,000 liters/pump/year at Rs. 90/liter. Unreliable diesel supply during peak season. No grid electricity in remote farm areas.',
  'Financial barrier: Solar pump cost much higher than diesel alternative. Long payback period at diesel savings alone. Farmers cannot afford upfront cost. Banks hesitant to lend for solar. Carbon revenue reduces payback period enabling adoption.'
FROM new_project;

-- ===========================
-- STAGE 5: VERIFIED (2 projects)
-- ===========================

-- Project 9: Madhya Pradesh Bamboo Plantation
WITH new_project AS (
  INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller3@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent1@carbonx.com' LIMIT 1),
    'Madhya Pradesh Tribal Bamboo Plantation Project',
    'afforestation',
    'large',
    'verified',
    CURRENT_DATE + INTERVAL '20 years',
    NOW() - INTERVAL '45 days',
    NOW() - INTERVAL '3 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  total_project_area_hectares,
  eligible_area_hectares,
  climate_zone,
  soil_type,
  dominant_species,
  species_type,
  above_ground_biomass,
  below_ground_biomass,
  soil_organic_carbon_0_30cm,
  sampling_plots,
  biodiversity_index,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  30,
  20,
  '2023-06-15'::date,
  'Community-based bamboo plantation on 6,000 hectares of degraded forest land under Forest Rights Act. Planting high-yielding bamboo species for carbon sequestration and income generation. Tribal communities have harvesting rights. Expected carbon stock: 850,000 tons over 20 years. Sustainable harvesting after 5 years provides income to 5,000 tribal families.',
  'India',
  'Madhya Pradesh',
  22.9734,
  78.6569,
  6000.00,
  5800.00,
  'Tropical Dry',
  'Red Sandy Loam',
  'Bambusa bambos, Dendrocalamus strictus',
  'Bamboo Monoculture',
  156.80,
  45.20,
  38.70,
  280,
  7.8,
  'Planting of 12 million bamboo rhizomes (2000 culms/hectare). Community nursery for rhizome propagation. Protection through Village Forest Committees. Rotational harvesting plan from year 5. Value addition through handicrafts and bamboo board production. Carbon benefit sharing: 80% community, 20% implementing agency.',
  'AR-ACM0003 Afforestation',
  'Baseline: Degraded forest land with sparse natural bamboo (<100 culms/hectare). Open access leading to uncontrolled grazing and cutting. Soil erosion reducing land productivity. Tribal communities dependent on daily wage labor.',
  'Land tenure barrier: Forest land requires legal approval for plantation. Forest Rights Act process takes 2 to 3 years. Institutional barrier: Gram Sabha approval needed. Financial barrier: High establishment cost per hectare. Government subsidy insufficient. Carbon finance essential for viability.'
FROM new_project;

-- Project 10: Himachal Pradesh Micro-Hydro
WITH new_project AS (
  INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller1@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent2@carbonx.com' LIMIT 1),
    'Himachal Pradesh Run-of-River Micro-Hydro Project',
    'renewable_energy',
    'small',
    'verified',
    CURRENT_DATE + INTERVAL '35 years',
    NOW() - INTERVAL '50 days',
    NOW() - INTERVAL '2 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  climate_zone,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  35,
  10,
  '2023-04-01'::date,
  'Bundled micro-hydro project with 25 run-of-river plants (capacity: 100 kW to 1 MW each, total 15 MW) across mountain streams in Himachal Pradesh. Zero water storage, minimal environmental impact. Annual generation: 75 GWh. Emissions reduction: 65,000 tons CO2/year. Grid electricity to 45 remote villages previously dependent on diesel generators.',
  'India',
  'Himachal Pradesh',
  31.1048,
  77.1734,
  'Temperate Highland',
  'Run-of-river technology with Pelton turbines. No dam or reservoir. Small weir (max 2m height) for water intake. Underground powerhouse to minimize landscape impact. 33 kV transmission line to nearest grid substation. Community benefit: 5% free power for village use.',
  'ACM0002 Grid-connected renewable energy',
  'Baseline: Remote villages use diesel gensets (5-6 hours/day). High electricity cost of Rs. 15/kWh. Remaining power from Northern grid (coal-heavy, emission factor 0.82 kg CO2/kWh). No hydro projects in these specific streams due to difficult terrain.',
  'Technology barrier: Difficult mountain terrain requires specialized civil works and new access roads. Financial barrier: Higher cost per MW than plains projects. Low tariff from State Electricity Board makes project unviable without carbon credits.'
FROM new_project;

-- ===========================
-- STAGE 6: APPROVED (2 projects)
-- ===========================

-- Project 11: Assam Tea Estate Reforestation
WITH new_project AS (
  INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller2@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent1@carbonx.com' LIMIT 1),
    'Assam Tea Estate Buffer Zone Reforestation',
    'afforestation',
    'large',
    'approved',
    CURRENT_DATE + INTERVAL '25 years',
    NOW() - INTERVAL '90 days',
    NOW() - INTERVAL '15 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  total_project_area_hectares,
  eligible_area_hectares,
  climate_zone,
  soil_type,
  dominant_species,
  species_type,
  above_ground_biomass,
  below_ground_biomass,
  soil_organic_carbon_0_30cm,
  sampling_plots,
  biodiversity_index,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  30,
  30,
  '2023-01-15'::date,
  'Restoration of 4,500 hectares of degraded land around tea estates in Assam. Creating buffer zone between tea gardens and elephant corridors. Planting native species that provide food for elephants, reducing human-elephant conflict. Expected carbon sequestration: 420,000 tons over 30 years. Employment for 800 tea estate workers.',
  'India',
  'Assam',
  26.2006,
  92.9376,
  4500.00,
  4300.00,
  'Tropical Monsoon',
  'Red Laterite and Alluvial',
  'Elephant Apple, Wild Banana, Ficus species, Bamboo, Teak',
  'Native Mixed Rainforest',
  142.60,
  48.30,
  65.50,
  180,
  9.5,
  'Selection of 30 native species preferred by elephants. Community nursery with tea estate workers. Assisted natural regeneration in some areas. Protection from illegal logging through estate security. Monitoring using camera traps and drone surveys. Revenue sharing with tea workers through wage bonus.',
  'AR-ACM0003 Afforestation',
  'Baseline: Degraded land with invasive species (Mikania, Lantana) covering 60-70%. Previous tea cultivation abandoned 15 years ago. No natural forest regeneration due to invasive species. Elephants raid tea estates causing conflict and casualties.',
  'Investment barrier: High reforestation cost per hectare without any immediate return. Tea estates under financial stress due to low tea prices. Banks will not finance non-productive forestry. Social barrier: Workers fear elephants entering restored forest. Carbon revenue makes project viable and funds insurance for workers.'
FROM new_project;

-- Project 12: Punjab Solar Rooftop (Approved with Credits)
WITH new_project AS (
  INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
  VALUES (
    (SELECT id FROM users WHERE email = 'seller3@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent2@carbonx.com' LIMIT 1),
    'Punjab Agricultural Solar Rooftop Program',
    'renewable_energy',
    'large',
    'approved',
    CURRENT_DATE + INTERVAL '25 years',
    NOW() - INTERVAL '120 days',
    NOW() - INTERVAL '20 days'
  )
  RETURNING id
)
INSERT INTO project_details (
  project_id,
  duration_years,
  crediting_period_years,
  project_start_date,
  project_summary,
  country,
  state_region,
  latitude,
  longitude,
  climate_zone,
  technologies_measures_description,
  methodology_applied,
  baseline_scenario,
  additionality_demonstration
)
SELECT 
  id,
  25,
  10,
  '2022-10-01'::date,
  'Installation of solar rooftop systems on 10,000 farm warehouses, dairy barns, and cold storage facilities across Punjab. Total capacity: 50 MW. Annual generation: 75 GWh. Replacing grid electricity and diesel generators. Emissions reduction: 60,000 tons CO2 per year. Excess solar power sold to grid, providing additional income to farmers.',
  'India',
  'Punjab',
  31.1471,
  75.3412,
  'Humid Subtropical',
  'Rooftop solar installations ranging from 3 kW to 25 kW per building. Polycrystalline panels with 18% efficiency. Grid-tied inverters with net metering. Remote monitoring system. 25-year performance warranty. Technical support through local EPC contractors trained by project developer.',
  'ACM0002 Grid-connected renewable',
  'Baseline: Farmers use Northern grid electricity (coal-heavy, emission factor 0.84 kg CO2/kWh) and diesel gensets for cold storage. High electricity bills (Rs. 8-12/kWh during peak hours). Frequent power cuts during summer affecting crop storage. No solar adoption due to high upfront cost.',
  'Financial barrier: High solar rooftop cost per kW. Farmers cannot afford large upfront payment per installation. High loan interest rates. Long payback period at electricity savings alone. Carbon credit revenue reduces payback period significantly making adoption possible. Institutional barrier: Net metering rules unclear in Punjab until 2022.'
FROM new_project;

-- Default password for all users: "Password123!"
-- All projects have complete details filled in project_details table
-- Projects represent realistic Indian carbon offset scenarios

COMMIT;
