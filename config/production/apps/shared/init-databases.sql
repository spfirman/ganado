-- ============================================================
-- Ganado App — Database Initialization Script
-- ============================================================
-- Run this against your existing PostgreSQL 17 instance.
-- Usage: psql -U postgres -f init-databases.sql
--
-- NOTE: Replace the placeholder passwords before running!
-- The deploy.sh script will substitute these automatically.
-- ============================================================

-- 1. Create Ganado App database user
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'ganado_app_user') THEN
    CREATE ROLE ganado_app_user WITH LOGIN PASSWORD 'GANADO_DB_PASSWORD_PLACEHOLDER';
  END IF;
END
$$;

-- 2. Create ChirpStack database user
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'ganado_cs_user') THEN
    CREATE ROLE ganado_cs_user WITH LOGIN PASSWORD 'GANADO_CS_DB_PASSWORD_PLACEHOLDER';
  END IF;
END
$$;

-- 3. Create Ganado App database
SELECT 'CREATE DATABASE ganado_app OWNER ganado_app_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ganado_app')\gexec

-- 4. Create ChirpStack database
SELECT 'CREATE DATABASE ganado_chirpstack OWNER ganado_cs_user'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ganado_chirpstack')\gexec

-- 5. Install extensions in Ganado App database
\c ganado_app
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Grant schema permissions
GRANT ALL PRIVILEGES ON DATABASE ganado_app TO ganado_app_user;
GRANT ALL ON SCHEMA public TO ganado_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ganado_app_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ganado_app_user;

-- 6. Install extensions in ChirpStack database
\c ganado_chirpstack
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS hstore;

-- Grant schema permissions
GRANT ALL PRIVILEGES ON DATABASE ganado_chirpstack TO ganado_cs_user;
GRANT ALL ON SCHEMA public TO ganado_cs_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ganado_cs_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ganado_cs_user;
