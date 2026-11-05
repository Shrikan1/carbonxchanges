# 🚀 Quick Seed Instructions

## Prerequisites Check

### Is your database running?

**If using Supabase (recommended for deployed sites):**
- ✅ No need to start anything, it's already running
- Just update the seed script to use Supabase connection

**If using Local PostgreSQL:**
1. Start PostgreSQL service:
   ```bash
   # Windows (as Administrator)
   net start postgresql-x64-14
   
   # Or open Services app and start "PostgreSQL" service
   ```

2. Verify it's running:
   ```bash
   psql -U postgres -c "SELECT version();"
   ```

## How to Run Seeds

### Method 1: Automatic Script (Easiest)

```bash
cd carbonxchanges/backend
node seeds/seed.js
```

### Method 2: Manual SQL

```bash
cd carbonxchanges/backend
psql -U postgres -d carbonxplanet -f seeds/dummy_projects.sql
```

### Method 3: Copy-Paste in pgAdmin

1. Open pgAdmin
2. Connect to your database
3. Open Query Tool
4. Copy entire content from `dummy_projects.sql`
5. Click Execute

## What You Get

### 12 Projects Across All Stages:

**DRAFT** (2 projects)
- Mara River Basin Reforestation (Kenya) 
- Atlantic Forest Restoration (Brazil)

**PENDING_ASSIGNMENT** (2 projects)  
- Solar Farm Expansion - Nairobi (Kenya)
- Rajasthan Wind Energy Project (India)

**ASSIGNED** (2 projects)
- Mangrove Restoration - Bahia Coast (Brazil)
- Aberdare Forest Conservation (Kenya)

**UNDER_VERIFICATION** (2 projects)
- Tamil Nadu Solar Irrigation (India)
- Amazon Agroforestry Initiative (Brazil)

**PENDING_ADMIN_APPROVAL** (2 projects)
- Tsavo East Reforestation (Kenya)
- Gujarat Biogas Program (India)

**APPROVED** (2 projects with credits)
- Pantanal Wetland Conservation (Brazil) - 45,000 credits
- Mount Kenya Forest Restoration (Kenya) - 32,000 credits

### 8 Test Users:

| Email | Password | Role |
|-------|----------|------|
| seller1@carbonx.com | Password123! | Seller (Kenya) |
| seller2@carbonx.com | Password123! | Seller (Brazil) |
| seller3@carbonx.com | Password123! | Seller (India) |
| agent1@carbonx.com | Password123! | Agent (UK) |
| agent2@carbonx.com | Password123! | Agent (Singapore) |
| buyer1@carbonx.com | Password123! | Buyer (USA) |
| buyer2@carbonx.com | Password123! | Buyer (Germany) |
| admin@carbonx.com | Password123! | Admin |

## Troubleshooting

### ❌ "ECONNREFUSED"
**Problem**: Database not running  
**Solution**: Start PostgreSQL service or check Supabase credentials

### ❌ "relation does not exist"  
**Problem**: Tables not created  
**Solution**: Run schema migrations first

### ❌ "duplicate key"
**Problem**: Data already exists  
**Solution**: Delete existing data first or skip seeding

### ❌ "password authentication failed"
**Problem**: Wrong DB credentials  
**Solution**: Check your `.env` file

## Quick Test After Seeding

1. Start backend: `npm run dev`
2. Start frontend: `cd ../frontend && npm run dev`
3. Open http://localhost:5173
4. Login with `seller1@carbonx.com` / `Password123!`
5. You should see 4 projects in the dashboard!

---

Need help? Check `README.md` for detailed instructions.
