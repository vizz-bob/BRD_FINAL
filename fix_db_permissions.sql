-- ============================================================
-- BRD Loan CRM - Database Permissions Setup for Backend User
-- Run this as a PostgreSQL superuser (postgres or rds master)
-- Usage: psql -h <DB_HOST> -U <MASTER_USER> -d <DB_NAME> -f fix_db_permissions.sql
-- ============================================================

-- Replace these values with your actual DB_USER and DB_NAME from .env files
-- Example: DB_USER=brdapp, DB_NAME=loancrm
\set DB_USER 'your_db_user'
\set DB_NAME 'your_db_name'

-- 1. Grant connect permission on the database
GRANT CONNECT ON DATABASE :DB_NAME TO :DB_USER;

-- 2. Grant usage on the public schema
GRANT USAGE ON SCHEMA public TO :DB_USER;

-- 3. Grant full CRUD on all existing tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO :DB_USER;

-- 4. Grant usage on all existing sequences (for auto-increment / serial fields)
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO :DB_USER;

-- 5. Grant execute on all existing functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO :DB_USER;

-- 6. Set default privileges so FUTURE tables/sequences/functions also get these grants
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO :DB_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO :DB_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT EXECUTE ON FUNCTIONS TO :DB_USER;

-- 7. Allow the user to create tables (required by Django migrations)
GRANT CREATE ON SCHEMA public TO :DB_USER;

-- Done
SELECT 'DB permissions granted successfully to ' || :'DB_USER' AS result;
