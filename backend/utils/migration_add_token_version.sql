-- Migration: Add token_version to users table
-- Run once against your database:
--   psql -U your_user -d carbon_credit_db -f migration_add_token_version.sql
--
-- token_version is a counter that starts at 0. Whenever we want to invalidate
-- ALL active JWTs for a user (e.g. after role upgrade or password change), we
-- increment this column. The auth middleware checks that the `tv` claim in the
-- JWT matches the current DB value — if not, the token is treated as revoked.
-- This gives us instant, database-side token revocation without a blacklist table.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;
