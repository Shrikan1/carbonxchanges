# Database Seeding Guide

## Overview
This directory contains seed data for populating the CarbonXPlanet database with dummy projects and users for development and testing.

## What Gets Created

### Users (8 total)
- **3 Sellers**: John Green (Kenya), Maria Silva (Brazil), Rajesh Kumar (India)
- **2 Agents**: Dr. Sarah Mitchell (UK), Michael Chen (Singapore)
- **2 Buyers**: Emma Thompson (USA), Hans Mueller (Germany)
- **1 Admin**: Admin User (USA)

All accounts have **password**: `Password123!`

### Projects (12 total - 2 in each stage)

#### Stage 1: DRAFT
1. Mara River Basin Reforestation (Kenya, Large, Reforestation)
2. Atlantic Forest Restoration - Phase 1 (Brazil, Medium, Conservation)

#### Stage 2: PENDING_ASSIGNMENT
3. Solar Farm Expansion - Nairobi (Kenya, Large, Renewable Energy)
4. Rajasthan Wind Energy Project (India, Large, Renewable Energy)

#### Stage 3: ASSIGNED
5. Mangrove Restoration - Bahia Coast (Brazil, Medium, Conservation)
6. Aberdare Forest Conservation (Kenya, Large, Conservation)

#### Stage 4: UNDER_VERIFICATION
7. Tamil Nadu Solar Irrigation Project (India, Medium, Renewable Energy)
8. Amazon Agroforestry Initiative (Brazil, Large, Reforestation)

#### Stage 5: PENDING_ADMIN_APPROVAL
9. Tsavo East Reforestation Project (Kenya, Large, Reforestation)
10. Gujarat Biogas Program (India, Medium, Renewable Energy)

#### Stage 6: APPROVED (with credits)
11. Pantanal Wetland Conservation (Brazil, Large, Conservation)
    - Credit Batch: CXP-2024-001
    - 45,000 credits @ $12.50/credit
12. Mount Kenya Forest Restoration (Kenya, Large, Reforestation)
    - Credit Batch: CXP-2024-002
    - 32,000 credits @ $15.00/credit
    - 3,500 credits sold to buyer1@carbonx.com

## Running the Seed Script

### Option 1: Using Node.js Script (Recommended)

```bash
cd carbonxchanges/backend
node seeds/seed.js
```

### Option 2: Using psql Command

```bash
cd carbonxchanges/backend
psql -U postgres -d carbonxplanet -f seeds/dummy_projects.sql
```

Replace `postgres` with your PostgreSQL username and `carbonxplanet` with your database name.

## Prerequisites

1. **Database must exist** - Create it first if needed:
   ```bash
   psql -U postgres
   CREATE DATABASE carbonxplanet;
   \q
   ```

2. **Schema must be created** - Run migrations first:
   ```bash
   psql -U postgres -d carbonxplanet -f schema.sql
   ```

3. **Environment variables** - Ensure your `.env` file has:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=carbonxplanet
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

## Testing After Seeding

### 1. Login as Different Roles

**Seller Dashboard:**
```
Email: seller1@carbonx.com
Password: Password123!
```
- View 4 projects (2 draft, 1 pending, 1 approved)
- See sales from Mount Kenya project

**Agent Dashboard:**
```
Email: agent1@carbonx.com
Password: Password123!
```
- View 3 assigned projects
- See verification history

**Buyer Dashboard:**
```
Email: buyer1@carbonx.com
Password: Password123!
```
- View portfolio with 3,500 credits
- See 1 completed transaction
- Browse marketplace with 2 available batches

**Admin Dashboard:**
```
Email: admin@carbonx.com
Password: Password123!
```
- View all 12 projects
- See 2 projects pending approval
- Manage users and credits

### 2. Verify Data in Database

```sql
-- Check users
SELECT id, email, role, full_name FROM users;

-- Check projects by stage
SELECT status, COUNT(*) FROM projects GROUP BY status;

-- Check credit batches
SELECT batch_number, total_credits, available_credits, price_per_credit FROM credit_batches;

-- Check transactions
SELECT t.*, u.full_name as buyer_name 
FROM transactions t 
JOIN users u ON t.buyer_id = u.id;
```

## Clearing Seeded Data

To remove all seeded data and start fresh:

```sql
-- Delete in order to respect foreign keys
DELETE FROM portfolio;
DELETE FROM transactions;
DELETE FROM credit_batches;
DELETE FROM verification_reports;
DELETE FROM documents;
DELETE FROM project_details;
DELETE FROM projects;
DELETE FROM users WHERE email LIKE '%@carbonx.com';
```

Or create a cleanup script:

```bash
cd carbonxchanges/backend
node seeds/cleanup.js  # (you'll need to create this)
```

## Troubleshooting

### Error: "duplicate key value violates unique constraint"
**Solution**: The seed data already exists. Clear the database first or modify the SQL to use `ON CONFLICT DO NOTHING`.

### Error: "relation does not exist"
**Solution**: Run schema migrations first to create all tables.

### Error: "column does not exist"
**Solution**: Your database schema might be outdated. Ensure all migrations are applied.

### Error: "password authentication failed"
**Solution**: Check your `.env` file has the correct `DB_PASSWORD`.

## Notes

- All dummy users have the same password: `Password123!` (change in production!)
- Blockchain transaction hashes are dummy values (0xabcdef...)
- Token IDs are simple placeholders (TOKEN001, TOKEN002)
- All dates are relative to current time (e.g., "NOW() - INTERVAL '5 days'")
- Project coordinates are real locations in mentioned countries
- Carbon calculations are realistic but simplified

## Next Steps

After seeding:
1. Start the backend server: `npm run dev`
2. Start the frontend: `cd ../frontend && npm run dev`
3. Login with any test account
4. Explore the different dashboards
5. Test the complete workflow from project submission to credit purchase

---

**Last Updated**: January 2025  
**Version**: 1.0.0
