-- Extensions for Ganado App database
-- Runs automatically on first container start via docker-entrypoint-initdb.d
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
