#!/bin/bash
# ============================================================
# GPCB — Health Check Script
# ============================================================
# Comprehensive health checks for the GPCB production server.
# Checks: Docker containers, HTTP endpoints, Asterisk status,
#          disk usage, memory usage, PostgreSQL, Redis.
#
# Usage:
#   sudo bash healthcheck.sh
#
# Designed to run every 5 minutes via cron.
# Alerts are written to /var/log/gpcb-alerts.log
# ============================================================

set -euo pipefail

LOG_FILE="/var/log/gpcb-healthcheck.log"
ALERT_FILE="/var/log/gpcb-alerts.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# ============================================================
# Thresholds
# ============================================================
DISK_WARN_PERCENT=80
DISK_CRIT_PERCENT=90
MEM_WARN_MB=256
MEM_CRIT_MB=128
SWAP_WARN_MB=100
HTTP_TIMEOUT=10
CONTAINER_RESTART_THRESHOLD=3

# Load custom thresholds if present
CONFIG_FILE="/etc/gpcb/healthcheck.conf"
if [ -f "$CONFIG_FILE" ]; then
    # shellcheck source=/dev/null
    source "$CONFIG_FILE"
fi

# ============================================================
# Logging
# ============================================================
log()   { echo "[$TIMESTAMP] [INFO]  $1" >> "$LOG_FILE"; }
warn()  { echo "[$TIMESTAMP] [WARN]  $1" >> "$LOG_FILE"; }
alert() {
    echo "[$TIMESTAMP] [ALERT] $1" >> "$LOG_FILE"
    echo "[$TIMESTAMP] $1" >> "$ALERT_FILE"
}

ALERTS=0
CHECKS=0
PASSED=0

check_pass() { CHECKS=$((CHECKS + 1)); PASSED=$((PASSED + 1)); log "  ✓ $1"; }
check_fail() { CHECKS=$((CHECKS + 1)); ALERTS=$((ALERTS + 1)); alert "$1"; }
check_warn() { CHECKS=$((CHECKS + 1)); warn "  ⚠ $1"; }

log "--- Health check started ---"

# ============================================================
# 1. Docker Container Health
# ============================================================
log "Checking Docker containers..."

# Expected containers — actual GPCB server
EXPECTED_CONTAINERS=(
    # Reverse proxy
    "nginx-proxy"
    "acme-companion"
    # Farm Management
    "api-farm"
    "db-farm"
    "redis-farm"
    # Vetlab Platform
    "vetlab-api"
    "vetlab-web"
    "vetlab-postgres"
    "redis-vetlab"
    # Accounting (Odoo)
    "app-accounting"
    "db-accounting"
    # FreePBX
    "freepbx"
    "freepbx-db"
    # Rocket.Chat
    "rocketchat"
    "mongo-rocketchat"
    # Keycloak (SSO)
    "keycloak"
    "db-keycloak"
    # Jitsi Meet (Video Conferencing)
    "jitsi-web"
    "jitsi-prosody"
    "jitsi-jicofo"
    "jitsi-jvb"
    # PBX Integration Service
    "pbx-integration"
    # coturn (TURN/STUN) — runs on host network
    "coturn"
)

# Load from config if present
if [ -n "${CUSTOM_CONTAINERS:-}" ]; then
    IFS=',' read -ra EXPECTED_CONTAINERS <<< "$CUSTOM_CONTAINERS"
fi

for CONTAINER in "${EXPECTED_CONTAINERS[@]}"; do
    if docker ps --format "{{.Names}}" 2>/dev/null | grep -q "^${CONTAINER}$"; then
        # Check health status
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null || echo "none")
        STATUS=$(docker inspect --format='{{.State.Status}}' "$CONTAINER" 2>/dev/null || echo "unknown")
        RESTARTS=$(docker inspect --format='{{.RestartCount}}' "$CONTAINER" 2>/dev/null || echo "0")

        if [ "$HEALTH" = "unhealthy" ]; then
            check_fail "UNHEALTHY: $CONTAINER (status=$STATUS, restarts=$RESTARTS)"
        elif [ "$RESTARTS" -gt "$CONTAINER_RESTART_THRESHOLD" ]; then
            check_fail "EXCESSIVE RESTARTS: $CONTAINER ($RESTARTS restarts)"
        else
            check_pass "$CONTAINER running (health=$HEALTH, restarts=$RESTARTS)"
        fi
    else
        check_fail "MISSING: Container $CONTAINER is not running"
    fi
done

# Check for any restarting containers (beyond expected list)
RESTARTING=$(docker ps --filter "status=restarting" --format "{{.Names}}" 2>/dev/null || true)
if [ -n "$RESTARTING" ]; then
    check_fail "RESTARTING CONTAINERS: $RESTARTING"
fi

# ============================================================
# 2. HTTP Endpoint Checks (via nginx-proxy virtual hosts)
# ============================================================
log "Checking HTTP endpoints..."

# All apps are behind nginx-proxy with VIRTUAL_HOST auto-discovery.
# Check via Host header against localhost:80 (nginx-proxy).
check_http() {
    local LABEL="$1"
    local DOMAIN="$2"
    local EXPECT="${3:-200}"

    local CODE
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$HTTP_TIMEOUT" \
        -H "Host: $DOMAIN" "http://localhost/" 2>/dev/null || echo "000")

    # Accept expected code, 301/302 redirects (HTTPS), or 200
    if [ "$CODE" = "$EXPECT" ] || [ "$CODE" = "200" ] || [ "$CODE" = "301" ] || [ "$CODE" = "302" ]; then
        check_pass "$LABEL HTTP $CODE ($DOMAIN)"
    else
        check_fail "$LABEL DOWN: HTTP $CODE ($DOMAIN)"
    fi
}

check_http "Farm API"     "finca.gpcb.com.co"
check_http "Vetlab"       "lacasadelpeludo.com.co"
check_http "Vetlab API"   "api.lacasadelpeludo.com.co"
check_http "Accounting"   "contable.gpcb.com.co"
check_http "FreePBX"      "pbx.gpcb.com.co"
check_http "Rocket.Chat"  "chat.gpcb.com.co"
check_http "Keycloak"     "auth.gpcb.com.co"
check_http "Jitsi Meet"   "meet.gpcb.com.co"

# ============================================================
# 3. Asterisk/FreePBX Status (Dockerized)
# ============================================================
log "Checking Asterisk status..."

PBX_CONTAINER="freepbx"
if docker ps --format "{{.Names}}" 2>/dev/null | grep -q "^${PBX_CONTAINER}$"; then
    if docker exec "$PBX_CONTAINER" asterisk -rx "core show version" &>/dev/null; then
        check_pass "Asterisk is running"

        # Check active channels
        CHANNELS=$(docker exec "$PBX_CONTAINER" asterisk -rx "core show channels count" 2>/dev/null | grep "active channel" | awk '{print $1}' || echo "0")
        log "  Active channels: $CHANNELS"

        # Check SIP/PJSIP registration status
        UNREG=$(docker exec "$PBX_CONTAINER" asterisk -rx "pjsip show registrations" 2>/dev/null | grep -c "Unregistered" | head -1 || echo "0")
        UNREG="${UNREG//[^0-9]/}"
        UNREG="${UNREG:-0}"
        if [ "$UNREG" -gt 0 ]; then
            check_warn "Asterisk: $UNREG unregistered SIP trunk(s)"
        else
            check_pass "Asterisk SIP trunks registered"
        fi

        # Check for any failed peers
        FAILED_PEERS=$(docker exec "$PBX_CONTAINER" asterisk -rx "pjsip show endpoints" 2>/dev/null | grep -c "Unavail" | head -1 || echo "0")
        FAILED_PEERS="${FAILED_PEERS//[^0-9]/}"
        FAILED_PEERS="${FAILED_PEERS:-0}"
        if [ "$FAILED_PEERS" -gt 0 ]; then
            check_warn "Asterisk: $FAILED_PEERS unavailable endpoint(s)"
        fi
    else
        check_fail "ASTERISK DOWN: Cannot connect to Asterisk CLI in container"
    fi
else
    check_fail "FREEPBX CONTAINER DOWN: $PBX_CONTAINER not running"
fi

# ============================================================
# 4. Disk Usage
# ============================================================
log "Checking disk usage..."

while read -r USAGE MOUNT; do
    USAGE=$(echo "$USAGE" | tr -d '%' | tr -d ' ')

    # Skip empty lines
    if [ -z "$USAGE" ] || [ -z "$MOUNT" ]; then
        continue
    fi

    if [ "$USAGE" -ge "$DISK_CRIT_PERCENT" ] 2>/dev/null; then
        check_fail "DISK CRITICAL: $MOUNT at ${USAGE}% (threshold: ${DISK_CRIT_PERCENT}%)"
    elif [ "$USAGE" -ge "$DISK_WARN_PERCENT" ] 2>/dev/null; then
        check_warn "Disk warning: $MOUNT at ${USAGE}%"
    else
        check_pass "Disk $MOUNT: ${USAGE}%"
    fi
done < <(df -h --output=pcent,target -x tmpfs -x devtmpfs -x overlay 2>/dev/null | tail -n +2)

# Check backup directory size
BACKUP_DIR="/srv/backups"
if [ -d "$BACKUP_DIR" ]; then
    BACKUP_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | awk '{print $1}')
    log "  Backup storage: $BACKUP_SIZE"
fi

# ============================================================
# 5. Memory Usage
# ============================================================
log "Checking memory..."

MEM_AVAIL_MB=$(awk '/MemAvailable/ {printf "%.0f", $2/1024}' /proc/meminfo)
MEM_TOTAL_MB=$(awk '/MemTotal/ {printf "%.0f", $2/1024}' /proc/meminfo)
MEM_USED_PCT=$(( (MEM_TOTAL_MB - MEM_AVAIL_MB) * 100 / MEM_TOTAL_MB ))

if [ "$MEM_AVAIL_MB" -lt "$MEM_CRIT_MB" ]; then
    check_fail "MEMORY CRITICAL: ${MEM_AVAIL_MB}MB available (threshold: ${MEM_CRIT_MB}MB)"
elif [ "$MEM_AVAIL_MB" -lt "$MEM_WARN_MB" ]; then
    check_warn "Memory low: ${MEM_AVAIL_MB}MB available"
else
    check_pass "Memory: ${MEM_AVAIL_MB}MB available / ${MEM_TOTAL_MB}MB total (${MEM_USED_PCT}% used)"
fi

# Swap check
SWAP_TOTAL_KB=$(awk '/SwapTotal/ {print $2}' /proc/meminfo)
SWAP_FREE_KB=$(awk '/SwapFree/ {print $2}' /proc/meminfo)
SWAP_USED_MB=$(( (SWAP_TOTAL_KB - SWAP_FREE_KB) / 1024 ))

if [ "$SWAP_USED_MB" -gt "$SWAP_WARN_MB" ]; then
    check_warn "Swap in use: ${SWAP_USED_MB}MB — RAM may be insufficient"
elif [ "$SWAP_USED_MB" -gt 0 ]; then
    log "  Swap: ${SWAP_USED_MB}MB used"
fi

# OOM check
OOM_COUNT=$(dmesg 2>/dev/null | grep -c "Out of memory" | head -1 || echo "0")
OOM_COUNT="${OOM_COUNT//[^0-9]/}"
OOM_COUNT="${OOM_COUNT:-0}"
if [ "$OOM_COUNT" -gt 0 ]; then
    check_fail "OOM KILLS: ${OOM_COUNT} occurrence(s) in kernel log"
fi

# ============================================================
# 6. PostgreSQL (Docker containers)
# ============================================================
log "Checking PostgreSQL databases..."

PG_CONTAINERS=(
    "db-farm:postgres:gpcb_farm_management"
    "vetlab-postgres:postgres:vetlab_db"
    "db-accounting:gpcb:gpcb_accounting"
)

for PG_ENTRY in "${PG_CONTAINERS[@]}"; do
    IFS=':' read -r PG_CTR PG_USER PG_DB <<< "$PG_ENTRY"

    if docker ps --format "{{.Names}}" 2>/dev/null | grep -q "^${PG_CTR}$"; then
        # Check if PostgreSQL accepts connections
        if docker exec "$PG_CTR" pg_isready -U "$PG_USER" -q 2>/dev/null; then
            # Connection count
            PG_MAX=$(docker exec "$PG_CTR" psql -U "$PG_USER" -d "$PG_DB" -t -c "SHOW max_connections;" 2>/dev/null | tr -d ' ' || echo "0")
            PG_CUR=$(docker exec "$PG_CTR" psql -U "$PG_USER" -d "$PG_DB" -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tr -d ' ' || echo "0")

            if [ "$PG_MAX" -gt 0 ] 2>/dev/null && [ "$PG_CUR" -gt 0 ] 2>/dev/null; then
                PG_PCT=$(( PG_CUR * 100 / PG_MAX ))
                if [ "$PG_PCT" -gt 80 ]; then
                    check_fail "PG HIGH: $PG_CTR ${PG_CUR}/${PG_MAX} (${PG_PCT}%)"
                else
                    check_pass "$PG_CTR: ${PG_CUR}/${PG_MAX} connections (${PG_PCT}%)"
                fi
            else
                check_pass "$PG_CTR: accepting connections"
            fi
        else
            check_fail "PG DOWN: $PG_CTR not accepting connections"
        fi
    fi
done

# ============================================================
# 7. Redis
# ============================================================
log "Checking Redis..."

REDIS_CONTAINERS=(
    "redis-farm"
    "redis-vetlab"
)

for REDIS_CTR in "${REDIS_CONTAINERS[@]}"; do
    if docker ps --format "{{.Names}}" 2>/dev/null | grep -q "^${REDIS_CTR}$"; then
        # Extract password from container args (--requirepass <pass>)
        REDIS_PASS=$(docker inspect "$REDIS_CTR" --format='{{json .Args}}' 2>/dev/null | grep -oP '(?<=--requirepass",")[^"]+' || echo "")
        REDIS_AUTH=""
        if [ -n "$REDIS_PASS" ]; then
            REDIS_AUTH="-a $REDIS_PASS --no-auth-warning"
        fi

        REDIS_PING=$(docker exec "$REDIS_CTR" redis-cli $REDIS_AUTH PING 2>/dev/null | tr -d '\r' || echo "FAIL")

        if [ "$REDIS_PING" = "PONG" ]; then
            REDIS_MEM=$(docker exec "$REDIS_CTR" redis-cli $REDIS_AUTH INFO memory 2>/dev/null | grep "used_memory_human" | cut -d':' -f2 | tr -d '\r' || echo "N/A")
            REDIS_KEYS=$(docker exec "$REDIS_CTR" redis-cli $REDIS_AUTH DBSIZE 2>/dev/null | tr -d '\r' || echo "N/A")
            check_pass "$REDIS_CTR: PONG (mem=$REDIS_MEM, $REDIS_KEYS)"
        else
            check_fail "REDIS DOWN: $REDIS_CTR PING returned '$REDIS_PING'"
        fi
    else
        check_fail "MISSING: Redis container $REDIS_CTR not running"
    fi
done

# ============================================================
# 8. SSL Certificate Expiry (acme-companion managed)
# ============================================================
log "Checking SSL certificates..."

# acme-companion stores certs in /etc/nginx/certs/ on the host via volume
SSL_DOMAINS=(
    "finca.gpcb.com.co"
    "lacasadelpeludo.com.co"
    "api.lacasadelpeludo.com.co"
    "contable.gpcb.com.co"
    "pbx.gpcb.com.co"
)

# Find cert volume path from acme-companion container
CERT_VOL=$(docker inspect acme-companion --format='{{range .Mounts}}{{if eq .Destination "/etc/nginx/certs"}}{{.Source}}{{end}}{{end}}' 2>/dev/null || echo "")

for DOMAIN in "${SSL_DOMAINS[@]}"; do
    CERT_FILE=""
    # Check acme-companion volume path
    if [ -n "$CERT_VOL" ] && [ -f "$CERT_VOL/$DOMAIN/fullchain.pem" ]; then
        CERT_FILE="$CERT_VOL/$DOMAIN/fullchain.pem"
    elif [ -f "/etc/nginx/certs/$DOMAIN/fullchain.pem" ]; then
        CERT_FILE="/etc/nginx/certs/$DOMAIN/fullchain.pem"
    fi

    if [ -n "$CERT_FILE" ]; then
        EXPIRY_DATE=$(openssl x509 -enddate -noout -in "$CERT_FILE" 2>/dev/null | cut -d'=' -f2)
        EXPIRY_EPOCH=$(date -d "$EXPIRY_DATE" +%s 2>/dev/null || echo "0")
        NOW_EPOCH=$(date +%s)
        DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))

        if [ "$DAYS_LEFT" -lt 7 ]; then
            check_fail "SSL CERT EXPIRING: $DOMAIN expires in $DAYS_LEFT days"
        elif [ "$DAYS_LEFT" -lt 30 ]; then
            check_warn "SSL cert for $DOMAIN expires in $DAYS_LEFT days"
        else
            check_pass "SSL cert: $DOMAIN expires in $DAYS_LEFT days"
        fi
    else
        log "  SSL cert not found for $DOMAIN (skipping)"
    fi
done

# ============================================================
# 9. Backup Freshness
# ============================================================
log "Checking backup freshness..."

BACKUP_ROOT="/srv/backups"
if [ -d "$BACKUP_ROOT" ]; then
    # Find the most recent backup directory
    LATEST_BACKUP=$(find "$BACKUP_ROOT" -maxdepth 3 -name "checksums.sha256" -type f -printf '%T@ %p\n' 2>/dev/null | sort -rn | head -1 | awk '{print $2}')

    if [ -n "$LATEST_BACKUP" ]; then
        BACKUP_AGE_HOURS=$(( ($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")) / 3600 ))

        if [ "$BACKUP_AGE_HOURS" -gt 48 ]; then
            check_fail "BACKUP STALE: Last backup was $BACKUP_AGE_HOURS hours ago"
        elif [ "$BACKUP_AGE_HOURS" -gt 26 ]; then
            check_warn "Backup age: $BACKUP_AGE_HOURS hours (expected <26h)"
        else
            check_pass "Last backup: ${BACKUP_AGE_HOURS}h ago"
        fi
    else
        check_warn "No backups found in $BACKUP_ROOT"
    fi
fi

# ============================================================
# 10. Container Resource Usage
# ============================================================
log "Checking container resource usage..."

for CONTAINER in "${EXPECTED_CONTAINERS[@]}"; do
    if docker ps --format "{{.Names}}" 2>/dev/null | grep -q "^${CONTAINER}$"; then
        STATS=$(docker stats --no-stream --format "{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}" "$CONTAINER" 2>/dev/null || echo "N/A")
        log "  $CONTAINER: $STATS"
    fi
done

# ============================================================
# Summary
# ============================================================
FAILED=$((CHECKS - PASSED))

log "--- Health check complete ---"
log "  Checks: $CHECKS | Passed: $PASSED | Alerts: $ALERTS"

if [ "$ALERTS" -gt 0 ]; then
    log "  *** $ALERTS ALERT(S) — see $ALERT_FILE ***"
fi

# ============================================================
# Rotate logs if too large (> 10MB)
# ============================================================
for LOGF in "$LOG_FILE" "$ALERT_FILE"; do
    if [ -f "$LOGF" ]; then
        LOG_SIZE=$(stat -c%s "$LOGF" 2>/dev/null || echo "0")
        if [ "$LOG_SIZE" -gt 10485760 ]; then
            mv "$LOGF" "${LOGF}.old"
        fi
    fi
done

exit 0
