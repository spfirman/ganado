#!/bin/bash
# ============================================================
# GPCB — Docker App Backup Script
# ============================================================
# Backs up a Docker-based app: PostgreSQL dump from its container.
#
# Usage:
#   bash backup-app.sh \
#     --name farm \
#     --db-container db-farm \
#     --db-name gpcb_farm_management \
#     --db-user postgres \
#     --backup-dir /srv/backups/apps/farm \
#     --date 2026-03-01_0200
#
# Called by backup-all.sh or can be run standalone.
# ============================================================

set -euo pipefail

LOG_FILE="/var/log/gpcb-backup.log"

log()   { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  [app] $1" | tee -a "$LOG_FILE"; }
warn()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN]  [app] $1" | tee -a "$LOG_FILE"; }
error() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] [app] $1" | tee -a "$LOG_FILE"; }

# ============================================================
# Parse arguments
# ============================================================
APP_NAME=""
DB_CONTAINER=""
DB_NAME=""
DB_USER="postgres"
BACKUP_DIR=""
DATE=$(date '+%Y-%m-%d_%H%M')

while [[ $# -gt 0 ]]; do
    case "$1" in
        --name)         APP_NAME="$2";     shift 2 ;;
        --db-container) DB_CONTAINER="$2"; shift 2 ;;
        --db-name)      DB_NAME="$2";      shift 2 ;;
        --db-user)      DB_USER="$2";      shift 2 ;;
        --backup-dir)   BACKUP_DIR="$2";   shift 2 ;;
        --date)         DATE="$2";         shift 2 ;;
        *)
            error "Unknown argument: $1"
            exit 1
            ;;
    esac
done

# Validate required arguments
if [ -z "$APP_NAME" ] || [ -z "$DB_CONTAINER" ] || [ -z "$DB_NAME" ] || [ -z "$BACKUP_DIR" ]; then
    error "Required: --name, --db-container, --db-name, --backup-dir"
    exit 1
fi

DEST="$BACKUP_DIR/$DATE"
mkdir -p "$DEST"

log "Backup started for $APP_NAME → $DEST"

# ============================================================
# Pre-flight: verify DB container is running
# ============================================================
if ! docker ps --format "{{.Names}}" | grep -q "^${DB_CONTAINER}$"; then
    error "Database container '$DB_CONTAINER' is not running"
    exit 1
fi

# ============================================================
# Step 1: PostgreSQL database dump (custom format)
# ============================================================
DB_DUMP_CUSTOM="$DEST/${APP_NAME}_db_${DATE}.dump"
DB_DUMP_SQL="$DEST/${APP_NAME}_db_${DATE}.sql.gz"

log "  Dumping database: $DB_NAME (from container $DB_CONTAINER)"

# Custom format dump (best for pg_restore)
if docker exec "$DB_CONTAINER" pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-owner \
    --no-privileges \
    --format=custom \
    --compress=6 \
    > "$DB_DUMP_CUSTOM" 2>>"$LOG_FILE"; then

    if [ -s "$DB_DUMP_CUSTOM" ]; then
        DUMP_SIZE=$(du -sh "$DB_DUMP_CUSTOM" 2>/dev/null | awk '{print $1}')
        log "  Database dump (custom): $DUMP_SIZE"
    else
        error "  Database dump is empty (custom format)"
        rm -f "$DB_DUMP_CUSTOM"
    fi
else
    error "  pg_dump (custom) failed for $DB_NAME"
    rm -f "$DB_DUMP_CUSTOM"
fi

# Plain SQL compressed dump (portable fallback)
if docker exec "$DB_CONTAINER" pg_dump \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    --no-owner \
    --no-privileges \
    2>>"$LOG_FILE" | gzip > "$DB_DUMP_SQL"; then

    if [ -s "$DB_DUMP_SQL" ]; then
        SQL_SIZE=$(du -sh "$DB_DUMP_SQL" 2>/dev/null | awk '{print $1}')
        log "  Database dump (SQL.gz): $SQL_SIZE"
    else
        error "  Database dump is empty (SQL format)"
        rm -f "$DB_DUMP_SQL"
    fi
else
    error "  pg_dump (SQL) failed for $DB_NAME"
    rm -f "$DB_DUMP_SQL"
fi

# Verify at least one dump succeeded
if [ ! -s "$DB_DUMP_CUSTOM" ] && [ ! -s "$DB_DUMP_SQL" ]; then
    error "  Both database dumps failed for $APP_NAME"
    exit 1
fi

# ============================================================
# Step 2: Backup Docker volumes (data directories)
# ============================================================
# Get the volumes mounted on the DB container
VOLUMES=$(docker inspect "$DB_CONTAINER" --format='{{range .Mounts}}{{if eq .Type "volume"}}{{.Name}} {{end}}{{end}}' 2>/dev/null || echo "")

if [ -n "$VOLUMES" ]; then
    for VOL in $VOLUMES; do
        VOL_SIZE=$(docker system df -v 2>/dev/null | grep "^$VOL" | awk '{print $3}' || echo "unknown")
        log "  Volume $VOL noted (size: $VOL_SIZE) — covered by DB dump"
    done
fi

# ============================================================
# Step 3: Create checksums
# ============================================================
cd "$DEST"
sha256sum ./* > checksums.sha256 2>/dev/null || true
log "  Checksums generated"

# ============================================================
# Summary
# ============================================================
TOTAL_SIZE=$(du -sh "$DEST" 2>/dev/null | awk '{print $1}')
FILE_COUNT=$(find "$DEST" -type f | wc -l)
log "Backup complete for $APP_NAME: $FILE_COUNT files, $TOTAL_SIZE → $DEST"

exit 0
