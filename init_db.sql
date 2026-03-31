-- =============================================================================
-- BRD Loan CRM Platform — PostgreSQL Database & User Setup
-- Run as master user (Stagging_Admin) on AWS RDS
--
-- Usage:
--   psql "host=stagging-db.cxa6qyk0oyb9.ap-south-1.rds.amazonaws.com \
--        port=5432 dbname=postgres user=Stagging_Admin \
--        sslmode=require password=Brd12345!" -f init_db.sql
-- =============================================================================

-- Step 1: Create the application database (skip if already exists)
SELECT 'CREATE DATABASE loancrm'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'loancrm')\gexec

-- Step 2: Create the application user (skip if already exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'brdapp') THEN
    CREATE USER brdapp WITH ENCRYPTED PASSWORD 'Brd12345!';
    RAISE NOTICE 'User brdapp created.';
  ELSE
    ALTER USER brdapp WITH ENCRYPTED PASSWORD 'Brd12345!';
    RAISE NOTICE 'User brdapp already exists — password updated.';
  END IF;
END
$$;

-- Step 3: Configure role settings
ALTER ROLE brdapp SET client_encoding TO 'utf8';
ALTER ROLE brdapp SET default_transaction_isolation TO 'read committed';
ALTER ROLE brdapp SET timezone TO 'UTC';

-- Step 4: Grant connect to the database
GRANT CONNECT ON DATABASE loancrm TO brdapp;

-- Step 5: Connect to loancrm DB for schema grants
\c loancrm

-- Step 6: Grant schema usage
GRANT USAGE ON SCHEMA public TO brdapp;

-- Step 7: Grant full CRUD on all existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO brdapp;

-- Step 8: Grant sequence usage (for Django auto-increment IDs)
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO brdapp;

-- Step 9: Grant function execution
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO brdapp;

-- Step 10: Set DEFAULT privileges so future tables/sequences also get grants
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO brdapp;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO brdapp;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT EXECUTE ON FUNCTIONS TO brdapp;

-- Step 11: Allow brdapp to CREATE tables (required by Django migrations)
GRANT CREATE ON SCHEMA public TO brdapp;

-- Verification
SELECT
  rolname,
  rolsuper,
  rolinherit,
  rolcreatedb,
  rolcanlogin
FROM pg_roles
WHERE rolname = 'brdapp';

SELECT 'SUCCESS: brdapp user configured with full permissions on loancrm database.' AS result;
