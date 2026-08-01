-- Run this once against your PostgreSQL database to create all tables.
-- psql -U your_user -d carbon_credit_db -f schema.sql

CREATE TYPE user_role AS ENUM ('user', 'seller', 'buyer', 'agent', 'admin');
-- NOTE: 'seller' and 'buyer' values are kept in the enum for backward
-- compatibility but are no longer assigned to self-signup users going
-- forward — see is_seller/is_buyer below. 'user' is now the signup default.
CREATE TYPE project_status AS ENUM ('draft', 'pending', 'assigned', 'in_progress', 'verified', 'approved', 'rejected', 'minted');
CREATE TYPE verification_report_type AS ENUM ('initial', 'completion');
CREATE TYPE tx_type AS ENUM ('purchase', 'retire');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',   -- meaningful values now: 'user', 'agent', 'admin'
    is_seller BOOLEAN NOT NULL DEFAULT false, -- granted only after role-upgrade OTP verification
    is_buyer BOOLEAN NOT NULL DEFAULT false,  -- granted only after role-upgrade OTP verification
    phone_number VARCHAR(20),                 -- collected during role upgrade (Buy/Add Project)
    pending_role_request VARCHAR(20),         -- 'seller' or 'buyer' while awaiting OTP; NULL otherwise
    wallet_address VARCHAR(42) UNIQUE,        -- MetaMask address; UNIQUE prevents two accounts sharing one wallet
    wallet_connected_at TIMESTAMP,
    is_verified BOOLEAN NOT NULL DEFAULT false,  -- true after OTP verification (or admin-created)
    created_by INTEGER REFERENCES users(id),     -- admin's id if this account was admin-created (agents); null for self-signup
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE otps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp_code VARCHAR(6) NOT NULL,
    purpose VARCHAR(30) NOT NULL DEFAULT 'signup',  -- 'signup' or 'role_upgrade'
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_otps_user ON otps(user_id);

-- Core project record: identity + lifecycle status only.
-- Kept lean so list views (getMyProjects, admin review queue) stay fast
-- without pulling ~40 detail columns every time.
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES users(id),
    agent_id INTEGER REFERENCES users(id),
    title VARCHAR(150) NOT NULL,
    project_type VARCHAR(100) NOT NULL,       -- e.g. 'afforestation', 'REDD+', 'soil carbon'
    project_scale VARCHAR(50),                -- e.g. 'small', 'large'
    status project_status NOT NULL DEFAULT 'draft',
    expected_completion_date DATE,  -- computed from project_details.project_start_date + duration_years at submission; completion verification can't happen before this
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- One-to-one with projects. Holds every MRV / registration-form field.
-- Split from `projects` purely to keep the core table lean and queryable.
CREATE TABLE project_details (
    project_id INTEGER PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,

    -- Duration & timeline
    duration_years INTEGER,
    crediting_period_years INTEGER,
    project_start_date DATE,
    project_summary TEXT,
    funding_sources TEXT,
    publicly_funded BOOLEAN DEFAULT false,

    -- Location
    country VARCHAR(100),
    state_region VARCHAR(100),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    total_project_area_hectares NUMERIC(12,2),
    eligible_area_hectares NUMERIC(12,2),
    set_aside_conservation_percent NUMERIC(5,2) DEFAULT 10.00,
    climate_zone VARCHAR(100),
    soil_type VARCHAR(100),
    hydrology_status VARCHAR(100),
    land_title_status VARCHAR(100),

    -- Ecological baseline / carbon measurements
    dominant_species VARCHAR(150),
    species_type VARCHAR(100),
    measurement_season VARCHAR(50),
    above_ground_biomass NUMERIC(12,2),
    below_ground_biomass NUMERIC(12,2),
    soil_organic_carbon_0_30cm NUMERIC(12,2),
    soil_organic_carbon_30_100cm NUMERIC(12,2),
    dead_wood_carbon NUMERIC(12,2),
    litter_carbon NUMERIC(12,2),
    sampling_plots INTEGER,
    biodiversity_index NUMERIC(6,2),
    uncertainty_percentage NUMERIC(5,2),

    -- Methodology & claims
    technologies_measures_description TEXT,
    methodology_applied VARCHAR(150),
    ghg_sources_included TEXT,
    baseline_scenario TEXT,
    additionality_demonstration TEXT,
    sdg_targets TEXT,                          -- comma-separated or JSON array as text
    total_co2_claimed NUMERIC(14,2),
    estimated_vers NUMERIC(14,2),
    buffer_pool_percent NUMERIC(5,2) DEFAULT 15.00,  -- % of verified credits held back (non-tradeable) as reversal-risk insurance, per standard VCS/Gold Standard practice
    monitoring_frequency VARCHAR(100),
    responsible_person VARCHAR(150),
    stakeholder_consultation_summary TEXT,
    grievance_mechanism TEXT,

    -- Owner / land verification
    owner_full_name VARCHAR(150),
    owner_id_type VARCHAR(50),
    owner_id_number VARCHAR(100),
    land_ownership_type VARCHAR(100),
    live_verification_photo_ipfs_cid VARCHAR(100),

    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    doc_type VARCHAR(50),                 -- e.g. 'land_deed', 'methodology_report'
    ipfs_cid VARCHAR(100) NOT NULL,       -- Pinata/IPFS content hash
    uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verification_reports (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    agent_id INTEGER NOT NULL REFERENCES users(id),
    report_type verification_report_type NOT NULL,  -- 'initial' (docs/site check) or 'completion' (post-build monitoring visit)
    gps_lat NUMERIC(9,6),
    gps_lng NUMERIC(9,6),
    photo_ipfs_cid VARCHAR(100),
    notes TEXT,
    verified_co2_amount NUMERIC(14,2),  -- only ever set on 'completion' reports — see agentVerificationController
    seller_response TEXT,              -- seller's reply/clarification to the agent's findings
    seller_response_at TIMESTAMP,
    submitted_at TIMESTAMP DEFAULT NOW()
);

-- One row per mint event. This table's own `id` IS the ERC-1155 token ID
-- used on-chain — no separate mapping needed. contract_address and
-- mint_tx_hash start NULL: the row is inserted first (to obtain the id/
-- token ID) via createPendingBatch, THEN the actual on-chain mint call uses
-- that id as the tokenId, and finalizeCreditBatch fills in the tx result.
-- This is what gives each project+vintage a genuinely distinct, non-
-- fungible-with-other-batches on-chain identity (ERC-1155), instead of a
-- single fungible pool (plain ERC-20) where provenance would be lost the
-- moment a buyer holds tokens from two different projects.
CREATE TABLE credit_batches (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    token_amount NUMERIC(12,2) NOT NULL,
    vintage_year INTEGER NOT NULL,      -- year the verified reduction/removal actually occurred (from the completion verification report)
    contract_address VARCHAR(42),       -- NULL until finalizeCreditBatch runs
    mint_tx_hash VARCHAR(66),           -- NULL until finalizeCreditBatch runs
    minted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL REFERENCES credit_batches(id),
    buyer_id INTEGER REFERENCES users(id),
    seller_id INTEGER REFERENCES users(id),
    tx_hash VARCHAR(66) NOT NULL,
    type tx_type NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    price_per_credit NUMERIC(10,2),      -- price at time of sale; NULL for 'retire' transactions
    total_price NUMERIC(14,2),           -- amount * price_per_credit; NULL for 'retire' transactions
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE retirement_certificates (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL REFERENCES transactions(id),
    certificate_pdf_url VARCHAR(255),
    burn_tx_hash VARCHAR(66) NOT NULL,
    issued_at TIMESTAMP DEFAULT NOW()
);

-- Helpful indexes for common lookups
-- Public showcase post for a project. Separate from `projects`/`project_details`
-- (the registration/MRV data) because this is marketing content the seller
-- controls independently — edited far more often, never gates verification.
CREATE TABLE project_posts (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    story TEXT,
    how_it_works TEXT,
    images TEXT[],                 -- IPFS CIDs
    videos TEXT[],                 -- IPFS CIDs or external video URLs
    likes_count INTEGER NOT NULL DEFAULT 0,
    shares_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Timeline of progress updates under a post (e.g. "500 trees planted this month")
CREATE TABLE project_post_updates (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES project_posts(id) ON DELETE CASCADE,
    update_text TEXT NOT NULL,
    image_ipfs_cid VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- One row per (post, user) — prevents double-liking and lets us toggle
-- like/unlike by checking existence instead of trusting a client-sent count.
CREATE TABLE project_post_likes (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES project_posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE TYPE listing_status AS ENUM ('active', 'cancelled', 'sold_out');

-- A seller's marketplace listing against a specific minted batch.
-- amount_sold tracks partial fills (a listing doesn't have to sell all at once);
-- status flips to 'sold_out' automatically once amount_sold reaches amount_listed
-- (handled at the application layer when a purchase completes, in the Buyer section).
CREATE TABLE credit_listings (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL REFERENCES credit_batches(id),
    seller_id INTEGER NOT NULL REFERENCES users(id),
    price_per_credit NUMERIC(10,2) NOT NULL,
    amount_listed NUMERIC(12,2) NOT NULL,
    amount_sold NUMERIC(12,2) NOT NULL DEFAULT 0,
    status listing_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_listings_seller ON credit_listings(seller_id);
CREATE INDEX idx_listings_status ON credit_listings(status);

-- Multi-round conversation on a verification report — supersedes relying
-- solely on the single seller_response field above (kept for backward
-- compatibility; new conversation happens here instead).
CREATE TABLE verification_messages (
    id SERIAL PRIMARY KEY,
    report_id INTEGER NOT NULL REFERENCES verification_reports(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_verification_messages_report ON verification_messages(report_id);

-- Generic notification, addressed to one user. Not yet triggered by any
-- controller (that wiring happens as we build Admin/Agent actions that
-- should notify a seller — e.g. "your project was approved"). This section
-- just builds the read side for the dashboard.
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

CREATE INDEX idx_project_posts_project ON project_posts(project_id);
CREATE INDEX idx_post_updates_post ON project_post_updates(post_id);

CREATE INDEX idx_projects_seller ON projects(seller_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_transactions_buyer ON transactions(buyer_id);

CREATE TYPE buffer_credit_status AS ENUM ('reserved', 'partially_cancelled', 'depleted');

-- Non-tradeable credits held back at mint time, per project's
-- buffer_pool_percent. Never given to the seller, never sold. Exists purely
-- as reversal-risk insurance — if an agent's re-inspection later confirms a
-- reversal, credits get cancelled FROM HERE, never from a buyer's already-
-- purchased holdings.
CREATE TABLE buffer_credits (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    batch_id INTEGER NOT NULL REFERENCES credit_batches(id),
    amount_reserved NUMERIC(14,2) NOT NULL,
    amount_cancelled NUMERIC(14,2) NOT NULL DEFAULT 0,
    status buffer_credit_status NOT NULL DEFAULT 'reserved',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Periodic post-mint field checks during the project's permanence period,
-- distinct from the pre-mint Initial/Completion verification reports.
-- reversal_amount, when reversal_detected is true, drives how much buffer
-- gets cancelled — reviewed and executed by an admin, not automatically,
-- so a single agent's report can't unilaterally deplete the buffer pool.
CREATE TABLE reinspection_reports (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    agent_id INTEGER NOT NULL REFERENCES users(id),
    gps_lat NUMERIC(9,6),
    gps_lng NUMERIC(9,6),
    photo_ipfs_cid VARCHAR(100),
    notes TEXT,
    reversal_detected BOOLEAN NOT NULL DEFAULT false,
    reversal_amount NUMERIC(14,2),      -- only meaningful when reversal_detected = true
    resolved BOOLEAN NOT NULL DEFAULT false,   -- true once admin has actioned (or dismissed) the finding
    resolved_at TIMESTAMP,
    submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_buffer_credits_project ON buffer_credits(project_id);
CREATE INDEX idx_reinspection_project ON reinspection_reports(project_id);