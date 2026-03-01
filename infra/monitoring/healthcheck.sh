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

# Expected containers (adjust as needed)
EXPECTED_CONTAINERS=(
    "ganado_backend"
    "ganado_frontend"
    "ganado_redis"
    "ganado_chirpstack"
    "ganado_mosquitto"
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
# 2. HTTP Endpoint Checks
# ============================================================
log "Checking HTTP endpoints..."

# Ganado backend health
BACKEND_URL="http://localhost:${GANADO_BACKEND_PORT:-3100}/api/v1/health"
BACKEND_HTTP=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$HTTP_TIMEOUT" "$BACKEND_URL" 2>/dev/null || echo "000")

if [ "$BACKEND_HTTP" = "200" ]; then
    check_pass "Ganado backend HTTP $BACKEND_HTTP"
else
    check_fail "GANADO BACKEND DOWN: HTTP $BACKEND_HTTP ($BACKEND_URL)"
fi

# Ganado frontend
FRONTEND_URL="http://localhost:${GANADO_FRONTEND_PORT:-8180}/"
FRONTEND_HTTP=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$HTTP_TIMEOUT" "$FRONTEND_URL" 2>/dev/null || echo "000")

if [ "$FRONTEND_HTTP" = "200" ] || [ "$FRONTEND_HTTP" = "304" ]; then
    check_pass "Ganado frontend HTTP $FRONTEND_HTTP"
else
    check_fail "GANADO FRONTEND DOWN: HTTP $FRONTEND_HTTP ($FRONTEND_URL)"
fi

# ChirpStack
CS_URL="http://localhost:${GANADO_CS_PORT:-8180}/"
CS_HTTP=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$HTTP_TIMEOUT" "$CS_URL" 2>/dev/null || echo "000")

if [ "$CS_HTTP" = "200" ] || [ "$CS_HTTP" = "302" ]; then
    check_pass "ChirpStack HTTP $CS_HTTP"
else
    check_warn "ChirpStack HTTP $CS_HTTP ($CS_URL) — may be proxied"
fi

# ============================================================
# 3. Asterisk/FreePBX Status
# ============================================================
log "Checking Asterisk status..."

if command -v asterisk &>/dev/null; then
    # Check if Asterisk is running
    if asterisk -rx "core show version" &>/dev/null; then
        check_pass "Asterisk is running"

        # Check active channels
        CHANNELS=$(asterisk -rx "core show channels count" 2>/dev/null | grep "active channel" | awk '{print $1}' || echo "0")
        log "  Active channels: $CHANNELS"

        # Check SIP/PJSIP registration status
        UNREG=$(asterisk -rx "pjsip show registrations" 2>/dev/null | grep -c "Unregistered" || echo "0")
        if [ "$UNREG" -gt 0 ]; then
            check_warn "Asterisk: $UNREG unregistered SIP trunk(s)"
        else
            check_pass "Asterisk SIP trunks registered"
        fi

        # Check for any failed peers
        FAILED_PEERS=$(asterisk -rx "pjsip show endpoints" 2>/dev/null | grep -c "Unavail" || echo "0")
        if [ "$FAILED_PEERS" -gt 0 ]; then
            check_warn "Asterisk: $FAILED_PEERS unavailable endpoint(s)"
        fi
    else
        check_fail "ASTERISK DOWN: Cannot connect to Asterisk CLI"
    fi
elif pgrep -x asterisk &>/dev/null; then
    check_pass "Asterisk process is running (CLI not accessible)"
else
    log "  Asterisk not installed on this host (skipping)"
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
# 6. PostgreSQL
# ============================================================
log "Checking PostgreSQL..."

if command -v pg_isready &>/dev/null; then
    if pg_isready -q 2>/dev/null; then
        check_pass "PostgreSQL is accepting connections"

        # Connection count
        if command -v psql &>/dev/null; then
            PG_MAX=$(sudo -u postgres psql -t -c "SHOW max_connections;" 2>/dev/null | tr -d ' ' || echo "0")
            PG_CUR=$(sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tr -d ' ' || echo "0")

            if [ "$PG_MAX" -gt 0 ] && [ "$PG_CUR" -gt 0 ]; then
                PG_PCT=$(( PG_CUR * 100 / PG_MAX ))
                if [ "$PG_PCT" -gt 80 ]; then
                    check_fail "PG CONNECTIONS HIGH: ${PG_CUR}/${PG_MAX} (${PG_PCT}%)"
                else
                    check_pass "PostgreSQL connections: ${PG_CUR}/${PG_MAX} (${PG_PCT}%)"
                fi
            fi

            # Check for long-running queries (> 5 min)
            LONG_QUERIES=$(sudo -u postgres psql -t -c "SELECT count(*) FROM pg_stat_activity WHERE state='active' AND now()-query_start > interval '5 minutes';" 2>/dev/null | tr -d ' ' || echo "0")
            if [ "$LONG_QUERIES" -gt 0 ]; then
                check_warn "PostgreSQL: $LONG_QUERIES long-running queries (>5 min)"
            fi
        fi
    else
        check_fail "POSTGRESQL DOWN: Not accepting connections"
    fi
else
    log "  pg_isready not found (skipping)"
fi

# ============================================================
# 7. Redis
# ============================================================
log "Checking Redis..."

REDIS_CONTAINER=$(docker ps --filter "name=ganado_redis" --format "{{.Names}}" 2>/dev/null || true)

if [ -n "$REDIS_CONTAINER" ]; then
    REDIS_PING=$(docker exec "$REDIS_CONTAINER" redis-cli -a "${GANADO_REDIS_PASSWORD:-}" PING 2>/dev/null | tr -d '\r' || echo "FAIL")

    if [ "$REDIS_PING" = "PONG" ]; then
        REDIS_MEM=$(docker exec "$REDIS_CONTAINER" redis-cli -a "${GANADO_REDIS_PASSWORD:-}" INFO memory 2>/dev/null | grep "used_memory_human" | cut -d':' -f2 | tr -d '\r' || echo "N/A")
        REDIS_KEYS=$(docker exec "$REDIS_CONTAINER" redis-cli -a "${GANADO_REDIS_PASSWORD:-}" DBSIZE 2>/dev/null | tr -d '\r' || echo "N/A")
        check_pass "Redis: PONG (mem=$REDIS_MEM, $REDIS_KEYS)"
    else
        check_fail "REDIS DOWN: PING returned '$REDIS_PING'"
    fi
else
    check_warn "Redis container not found"
fi

# ============================================================
# 8. SSL Certificate Expiry
# ============================================================
log "Checking SSL certificates..."

DOMAIN="${GANADO_DOMAIN:-ganado.yourdomain.com}"
CERT_FILE="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

if [ -f "$CERT_FILE" ]; then
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
