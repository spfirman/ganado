#!/bin/bash
# ============================================================
# Ganado App — Server Monitoring Script
# ============================================================
# Monitors the entire server (not just Ganado containers).
# Designed to run via systemd timer every 5 minutes.
#
# Install:
#   sudo cp monitor.sh /opt/ganado-monitoring/monitor.sh
#   sudo chmod +x /opt/ganado-monitoring/monitor.sh
#   sudo cp ganado-monitor.service /etc/systemd/system/
#   sudo cp ganado-monitor.timer /etc/systemd/system/
#   sudo systemctl daemon-reload
#   sudo systemctl enable --now ganado-monitor.timer
# ============================================================

set -euo pipefail

LOG_FILE="/var/log/ganado-monitor.log"
ALERT_FILE="/var/log/ganado-alerts.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Thresholds
MEM_FREE_MIN_MB=512
CPU_MAX_PERCENT=80
DISK_MAX_PERCENT=85
SWAP_MAX_MB=0
PG_CONN_MAX_PERCENT=80
REDIS_MEM_MAX_MB=100

# Logging helpers
log()   { echo "[$TIMESTAMP] [INFO]  $1" >> "$LOG_FILE"; }
alert() { echo "[$TIMESTAMP] [ALERT] $1" >> "$LOG_FILE"; echo "[$TIMESTAMP] $1" >> "$ALERT_FILE"; }

log "--- Monitor check started ---"

# ============================================================
# 1. Memory Check
# ============================================================
MEM_FREE_MB=$(awk '/MemAvailable/ {printf "%.0f", $2/1024}' /proc/meminfo)
MEM_TOTAL_MB=$(awk '/MemTotal/ {printf "%.0f", $2/1024}' /proc/meminfo)
MEM_USED_PERCENT=$(( (MEM_TOTAL_MB - MEM_FREE_MB) * 100 / MEM_TOTAL_MB ))

log "Memory: ${MEM_FREE_MB}MB free / ${MEM_TOTAL_MB}MB total (${MEM_USED_PERCENT}% used)"

if [ "$MEM_FREE_MB" -lt "$MEM_FREE_MIN_MB" ]; then
    alert "LOW MEMORY: Only ${MEM_FREE_MB}MB free (threshold: ${MEM_FREE_MIN_MB}MB). Consider upgrading to Large instance."
fi

# ============================================================
# 2. Swap Check
# ============================================================
SWAP_USED_KB=$(awk '/SwapTotal|SwapFree/ {a[NR]=$2} END {print a[1]-a[2]}' /proc/meminfo 2>/dev/null || echo "0")
SWAP_USED_MB=$(( SWAP_USED_KB / 1024 ))

log "Swap: ${SWAP_USED_MB}MB used"

if [ "$SWAP_USED_MB" -gt "$SWAP_MAX_MB" ]; then
    alert "SWAP IN USE: ${SWAP_USED_MB}MB swap used. RAM is insufficient — upgrade to Large instance recommended."
fi

# ============================================================
# 3. CPU Check
# ============================================================
CPU_IDLE=$(top -bn1 | grep "Cpu(s)" | awk '{print $8}' | cut -d'.' -f1 2>/dev/null || echo "100")
CPU_USED=$(( 100 - CPU_IDLE ))

log "CPU: ${CPU_USED}% used"

if [ "$CPU_USED" -gt "$CPU_MAX_PERCENT" ]; then
    alert "HIGH CPU: ${CPU_USED}% (threshold: ${CPU_MAX_PERCENT}%)"
fi

# ============================================================
# 4. Disk Check
# ============================================================
DISK_USED_PERCENT=$(df / | tail -1 | awk '{print $5}' | tr -d '%')

log "Disk: ${DISK_USED_PERCENT}% used"

if [ "$DISK_USED_PERCENT" -gt "$DISK_MAX_PERCENT" ]; then
    alert "HIGH DISK: ${DISK_USED_PERCENT}% (threshold: ${DISK_MAX_PERCENT}%)"
fi

# ============================================================
# 5. Docker Container Health Check
# ============================================================
UNHEALTHY=$(docker ps --filter "health=unhealthy" --format "{{.Names}}" 2>/dev/null || true)
RESTARTING=$(docker ps --filter "status=restarting" --format "{{.Names}}" 2>/dev/null || true)

if [ -n "$UNHEALTHY" ]; then
    alert "UNHEALTHY CONTAINERS: $UNHEALTHY"
fi

if [ -n "$RESTARTING" ]; then
    alert "RESTARTING CONTAINERS: $RESTARTING"
fi

RUNNING_COUNT=$(docker ps --format "{{.Names}}" 2>/dev/null | wc -l || echo "0")
log "Docker: ${RUNNING_COUNT} containers running"

# ============================================================
# 6. PostgreSQL Connection Check
# ============================================================
if command -v psql &>/dev/null; then
    PG_MAX_CONN=$(psql -U postgres -t -c "SHOW max_connections;" 2>/dev/null | tr -d ' ' || echo "0")
    PG_CURR_CONN=$(psql -U postgres -t -c "SELECT count(*) FROM pg_stat_activity;" 2>/dev/null | tr -d ' ' || echo "0")

    if [ "$PG_MAX_CONN" -gt "0" ] && [ "$PG_CURR_CONN" -gt "0" ]; then
        PG_CONN_PERCENT=$(( PG_CURR_CONN * 100 / PG_MAX_CONN ))
        log "PostgreSQL: ${PG_CURR_CONN}/${PG_MAX_CONN} connections (${PG_CONN_PERCENT}%)"

        if [ "$PG_CONN_PERCENT" -gt "$PG_CONN_MAX_PERCENT" ]; then
            alert "HIGH PG CONNECTIONS: ${PG_CURR_CONN}/${PG_MAX_CONN} (${PG_CONN_PERCENT}%)"
        fi
    fi
else
    log "PostgreSQL: psql not found, skipping connection check"
fi

# ============================================================
# 7. Redis Memory Check
# ============================================================
REDIS_CONTAINER=$(docker ps --filter "name=ganado_redis" --format "{{.Names}}" 2>/dev/null || true)

if [ -n "$REDIS_CONTAINER" ]; then
    REDIS_MEM_BYTES=$(docker exec "$REDIS_CONTAINER" redis-cli -a "${GANADO_REDIS_PASSWORD:-}" INFO memory 2>/dev/null | grep "used_memory:" | cut -d':' -f2 | tr -d '\r' || echo "0")
    REDIS_MEM_MB=$(( REDIS_MEM_BYTES / 1024 / 1024 ))

    log "Redis: ${REDIS_MEM_MB}MB used"

    if [ "$REDIS_MEM_MB" -gt "$REDIS_MEM_MAX_MB" ]; then
        alert "HIGH REDIS MEMORY: ${REDIS_MEM_MB}MB (threshold: ${REDIS_MEM_MAX_MB}MB)"
    fi
fi

# ============================================================
# 8. OOM Kill Check
# ============================================================
OOM_COUNT=$(dmesg 2>/dev/null | grep -c "Out of memory" || echo "0")
if [ "$OOM_COUNT" -gt "0" ]; then
    alert "OOM KILLS DETECTED: ${OOM_COUNT} occurrence(s) in dmesg. Upgrade to Large instance immediately."
fi

# ============================================================
# 9. Ganado Container Memory Usage
# ============================================================
for CONTAINER in ganado_backend ganado_frontend ganado_chirpstack ganado_redis ganado_mosquitto; do
    if docker ps --format "{{.Names}}" | grep -q "^${CONTAINER}$" 2>/dev/null; then
        CONTAINER_MEM=$(docker stats --no-stream --format "{{.MemUsage}}" "$CONTAINER" 2>/dev/null | cut -d'/' -f1 | tr -d ' ' || echo "N/A")
        log "Container ${CONTAINER}: ${CONTAINER_MEM}"
    fi
done

log "--- Monitor check completed ---"

# ============================================================
# 10. Rotate log if too large (> 10MB)
# ============================================================
if [ -f "$LOG_FILE" ]; then
    LOG_SIZE=$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo "0")
    if [ "$LOG_SIZE" -gt "10485760" ]; then
        mv "$LOG_FILE" "${LOG_FILE}.old"
        log "Log rotated (was ${LOG_SIZE} bytes)"
    fi
fi
