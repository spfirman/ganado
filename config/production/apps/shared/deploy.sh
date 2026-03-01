#!/bin/bash
# ============================================================
# Ganado App — Deployment Script
# ============================================================
# Deploys all Ganado services on the host server.
#
# Prerequisites:
#   - Docker and Docker Compose installed
#   - PostgreSQL 17 running on the host
#   - .env file configured (copy from .env.example)
#   - PostGIS packages installed on host
#
# Usage:
#   cd ~/apps/ganado/config/production/apps/shared
#   cp .env.example .env
#   # Edit .env with your passwords and domain
#   bash deploy.sh
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APPS_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="$SCRIPT_DIR/.env"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ============================================================
# Pre-flight checks
# ============================================================
info "=== Ganado App Deployment ==="
echo ""

if [ ! -f "$ENV_FILE" ]; then
    error ".env file not found at $ENV_FILE"
    error "Copy .env.example to .env and configure it first:"
    error "  cp $SCRIPT_DIR/.env.example $SCRIPT_DIR/.env"
    exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

if ! command -v docker &>/dev/null; then
    error "Docker is not installed."
    exit 1
fi

if ! docker compose version &>/dev/null && ! docker-compose version &>/dev/null; then
    error "Docker Compose is not installed."
    exit 1
fi

# Determine compose command
if docker compose version &>/dev/null; then
    COMPOSE="docker compose"
else
    COMPOSE="docker-compose"
fi

info "Using compose command: $COMPOSE"

# Check for placeholder passwords
if echo "$GANADO_DB_PASSWORD $GANADO_REDIS_PASSWORD $GANADO_JWT_SECRET" | grep -q "CHANGE_ME"; then
    error "Please update all CHANGE_ME values in $ENV_FILE before deploying."
    exit 1
fi

# ============================================================
# Step 1: Create Docker network
# ============================================================
info "Step 1: Creating Docker network..."

if ! docker network inspect ganado_infra_net &>/dev/null; then
    docker network create ganado_infra_net
    info "Created network: ganado_infra_net"
else
    info "Network ganado_infra_net already exists"
fi

# ============================================================
# Step 2: Initialize databases
# ============================================================
info "Step 2: Initializing PostgreSQL databases..."

# Substitute passwords in the SQL template
SQL_FILE="$SCRIPT_DIR/init-databases.sql"
TEMP_SQL="/tmp/ganado-init-databases.sql"

sed \
    -e "s/GANADO_DB_PASSWORD_PLACEHOLDER/$GANADO_DB_PASSWORD/g" \
    -e "s/GANADO_CS_DB_PASSWORD_PLACEHOLDER/$GANADO_CS_DB_PASSWORD/g" \
    "$SQL_FILE" > "$TEMP_SQL"

if command -v psql &>/dev/null; then
    info "Running database initialization script..."
    psql -U "$PG_ADMIN_USER" -h localhost -p "${PG_PORT:-5432}" -f "$TEMP_SQL" 2>&1 || {
        warn "Database init had warnings (databases may already exist). Continuing..."
    }
else
    warn "psql not found on host. Trying via Docker..."
    # Find the PostgreSQL container
    PG_CONTAINER=$(docker ps --filter "ancestor=postgres" --filter "ancestor=postgis/postgis" --format "{{.Names}}" | head -1)
    if [ -n "$PG_CONTAINER" ]; then
        docker cp "$TEMP_SQL" "$PG_CONTAINER:/tmp/init.sql"
        docker exec -u postgres "$PG_CONTAINER" psql -f /tmp/init.sql 2>&1 || {
            warn "Database init had warnings. Continuing..."
        }
    else
        error "Cannot find PostgreSQL. Please run init-databases.sql manually."
        error "  psql -U postgres -f $SQL_FILE"
    fi
fi

rm -f "$TEMP_SQL"
info "Database initialization complete."

# ============================================================
# Step 3: Deploy shared infrastructure (Redis)
# ============================================================
info "Step 3: Deploying shared Redis..."

$COMPOSE -f "$SCRIPT_DIR/docker-compose.infra.yml" \
    --env-file "$ENV_FILE" \
    up -d

info "Shared Redis is running."

# ============================================================
# Step 4: Deploy Ganado backend
# ============================================================
info "Step 4: Deploying Ganado backend..."

$COMPOSE -f "$APPS_DIR/prod_backend/docker-compose.yaml" \
    --env-file "$ENV_FILE" \
    up -d

info "Ganado backend is running."

# ============================================================
# Step 5: Deploy Ganado frontend
# ============================================================
info "Step 5: Deploying Ganado frontend..."

$COMPOSE -f "$APPS_DIR/prod_frontend/docker-compose.yaml" \
    --env-file "$ENV_FILE" \
    up -d

info "Ganado frontend is running."

# ============================================================
# Step 6: Deploy ChirpStack IoT stack
# ============================================================
info "Step 6: Deploying ChirpStack..."

$COMPOSE -f "$APPS_DIR/prod_chirpstack/docker-compose.yml" \
    --env-file "$ENV_FILE" \
    up -d

info "ChirpStack is running."

# ============================================================
# Step 7: Install monitoring
# ============================================================
info "Step 7: Setting up monitoring..."

sudo mkdir -p /opt/ganado-monitoring
sudo cp "$SCRIPT_DIR/monitoring/monitor.sh" /opt/ganado-monitoring/monitor.sh
sudo chmod +x /opt/ganado-monitoring/monitor.sh

sudo cp "$SCRIPT_DIR/monitoring/ganado-monitor.service" /etc/systemd/system/
sudo cp "$SCRIPT_DIR/monitoring/ganado-monitor.timer" /etc/systemd/system/

sudo systemctl daemon-reload
sudo systemctl enable ganado-monitor.timer
sudo systemctl start ganado-monitor.timer

info "Monitoring timer installed and active."

# ============================================================
# Step 8: NGINX configuration hint
# ============================================================
info "Step 8: NGINX configuration..."

NGINX_SRC="$SCRIPT_DIR/nginx/ganado.conf"
NGINX_DEST="/etc/nginx/sites-available/ganado.conf"

if [ -d "/etc/nginx/sites-available" ]; then
    warn "NGINX config template is at: $NGINX_SRC"
    warn "To install:"
    warn "  1. Edit the domain in $NGINX_SRC"
    warn "  2. sudo cp $NGINX_SRC $NGINX_DEST"
    warn "  3. sudo ln -sf $NGINX_DEST /etc/nginx/sites-enabled/ganado.conf"
    warn "  4. sudo nginx -t && sudo systemctl reload nginx"
    warn "  5. sudo certbot --nginx -d ${GANADO_DOMAIN:-ganado.yourdomain.com}"
else
    warn "NGINX sites-available directory not found."
    warn "Manually configure your reverse proxy using: $NGINX_SRC"
fi

# ============================================================
# Step 9: Verify deployment
# ============================================================
info ""
info "=== Deployment Complete ==="
info ""
info "Container status:"
docker ps --filter "name=ganado_" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || true

info ""
info "Next steps:"
info "  1. Configure NGINX (see Step 8 above)"
info "  2. Set up DNS A record for ${GANADO_DOMAIN:-ganado.yourdomain.com}"
info "  3. Obtain SSL certificate with certbot"
info "  4. Test: curl http://localhost:${GANADO_BACKEND_PORT:-3100}/api/v1/health"
info "  5. Check monitoring: sudo systemctl status ganado-monitor.timer"
info "  6. View monitor logs: tail -f /var/log/ganado-monitor.log"
