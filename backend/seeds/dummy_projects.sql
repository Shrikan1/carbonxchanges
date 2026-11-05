-- Dummy Projects Seed Data
-- This script creates 12 sample projects (2 in each stage)
-- Stages: draft, pending, assigned, in_progress, verified, approved

-- First, let's create some dummy users (seller, agents, buyers)
INSERT INTO users (email, password_hash, role, name, phone_number, address, is_seller, is_buyer, wallet_address, is_verified, created_at)
VALUES
  -- Sellers (all have is_seller = true)
  ('seller1@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'John Green', '+1234567890', 'Nairobi, Kenya', true, false, '0x1234567890123456789012345678901234567890', true, NOW() - INTERVAL '6 months'),
  ('seller2@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Maria Silva', '+5511987654321', 'São Paulo, Brazil', true, false, '0x2234567890123456789012345678901234567891', true, NOW() - INTERVAL '5 months'),
  ('seller3@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Rajesh Kumar', '+919876543210', 'Mumbai, India', true, false, '0x3234567890123456789012345678901234567892', true, NOW() - INTERVAL '4 months'),
  
  -- Agents
  ('agent1@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'agent', 'Dr. Sarah Mitchell', '+442071234567', 'London, UK', false, false, '0x4234567890123456789012345678901234567893', true, NOW() - INTERVAL '8 months'),
  ('agent2@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'agent', 'Michael Chen', '+6591234567', 'Singapore', false, false, '0x5234567890123456789012345678901234567894', true, NOW() - INTERVAL '7 months'),
  
  -- Buyers (all have is_buyer = true)
  ('buyer1@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Emma Thompson', '+12125551234', 'New York, USA', false, true, '0x6234567890123456789012345678901234567895', true, NOW() - INTERVAL '3 months'),
  ('buyer2@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'user', 'Hans Mueller', '+4930123456', 'Berlin, Germany', false, true, '0x7234567890123456789012345678901234567896', true, NOW() - INTERVAL '2 months'),
  
  -- Admin
  ('admin@carbonx.com', '$2a$10$VvEqXzHCw9XSFyBhJ.UkQe7wK8KPYBvCF4qz5Q.PJ.DfP/1nECZjy', 'admin', 'Admin User', '+1234567899', 'San Francisco, USA', false, false, '0x8234567890123456789012345678901234567897', true, NOW() - INTERVAL '12 months')
ON CONFLICT (email) DO NOTHING;

-- Get user IDs (using email lookups)

-- ===========================
-- STAGE 1: DRAFT (2 projects)
-- ===========================

INSERT INTO projects (seller_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
VALUES
  (
    (SELECT id FROM users WHERE email = 'seller1@carbonx.com' LIMIT 1),
    'Mara River Basin Reforestation',
    'afforestation',
    'large',
    'draft',
    CURRENT_DATE + INTERVAL '3 years',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    (SELECT id FROM users WHERE email = 'seller2@carbonx.com' LIMIT 1),
    'Atlantic Forest Restoration - Phase 1',
    'afforestation',
    'medium',
    'draft',
    CURRENT_DATE + INTERVAL '4 years',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  );

-- ===========================
-- STAGE 2: PENDING (2 projects)
-- ===========================

INSERT INTO projects (seller_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
VALUES
  (
    (SELECT id FROM users WHERE email = 'seller1@carbonx.com' LIMIT 1),
    'Solar Farm Expansion - Nairobi',
    'renewable_energy',
    'large',
    'pending',
    CURRENT_DATE + INTERVAL '2 years',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM users WHERE email = 'seller3@carbonx.com' LIMIT 1),
    'Rajasthan Wind Energy Project',
    'renewable_energy',
    'large',
    'pending',
    CURRENT_DATE + INTERVAL '18 months',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '6 hours'
  );

-- ===========================
-- STAGE 3: ASSIGNED (2 projects)
-- ===========================

INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
VALUES
  (
    (SELECT id FROM users WHERE email = 'seller2@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent1@carbonx.com' LIMIT 1),
    'Mangrove Restoration - Bahia Coast',
    'REDD+',
    'medium',
    'assigned',
    CURRENT_DATE + INTERVAL '5 years',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    (SELECT id FROM users WHERE email = 'seller1@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent2@carbonx.com' LIMIT 1),
    'Aberdare Forest Conservation',
    'REDD+',
    'large',
    'assigned',
    CURRENT_DATE + INTERVAL '10 years',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '4 days'
  );

-- ===========================
-- STAGE 4: IN_PROGRESS (2 projects)
-- ===========================

INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
VALUES
  (
    (SELECT id FROM users WHERE email = 'seller3@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent1@carbonx.com' LIMIT 1),
    'Tamil Nadu Solar Irrigation Project',
    'renewable_energy',
    'medium',
    'in_progress',
    CURRENT_DATE + INTERVAL '1 year',
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '7 days'
  ),
  (
    (SELECT id FROM users WHERE email = 'seller2@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent2@carbonx.com' LIMIT 1),
    'Amazon Agroforestry Initiative',
    'afforestation',
    'large',
    'in_progress',
    CURRENT_DATE + INTERVAL '6 years',
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '5 days'
  );

-- ===========================
-- STAGE 5: VERIFIED (2 projects)
-- ===========================

INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
VALUES
  (
    (SELECT id FROM users WHERE email = 'seller1@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent1@carbonx.com' LIMIT 1),
    'Tsavo East Reforestation Project',
    'afforestation',
    'large',
    'verified',
    CURRENT_DATE + INTERVAL '8 years',
    NOW() - INTERVAL '40 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    (SELECT id FROM users WHERE email = 'seller3@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent2@carbonx.com' LIMIT 1),
    'Gujarat Biogas Program',
    'renewable_energy',
    'medium',
    'verified',
    CURRENT_DATE + INTERVAL '15 months',
    NOW() - INTERVAL '35 days',
    NOW() - INTERVAL '1 day'
  );

-- ===========================
-- STAGE 6: APPROVED (2 projects)
-- ===========================

INSERT INTO projects (seller_id, agent_id, title, project_type, project_scale, status, expected_completion_date, created_at, updated_at)
VALUES
  (
    (SELECT id FROM users WHERE email = 'seller2@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent1@carbonx.com' LIMIT 1),
    'Pantanal Wetland Conservation',
    'REDD+',
    'large',
    'approved',
    CURRENT_DATE + INTERVAL '15 years',
    NOW() - INTERVAL '60 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    (SELECT id FROM users WHERE email = 'seller1@carbonx.com' LIMIT 1),
    (SELECT id FROM users WHERE email = 'agent2@carbonx.com' LIMIT 1),
    'Mount Kenya Forest Restoration',
    'afforestation',
    'large',
    'approved',
    CURRENT_DATE + INTERVAL '12 years',
    NOW() - INTERVAL '90 days',
    NOW() - INTERVAL '15 days'
  );

-- Note: credit_batches, transactions, and portfolio tables need to be created first
-- This simplified version focuses on users and projects only

-- Default password for all dummy users is: "Password123!"
-- Remember to change these in production!
