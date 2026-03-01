#!/bin/bash
# ============================================================
# GPCB — Nightly Master Backup Script
# ============================================================
# Backs up all 3 Odoo apps + FreePBX, then rotates old backups.
#
# Usage:
#   sudo bash /opt/ganado-app/infra/backup/backup-all.sh
#
# Designed to run via cron at 2 AM nightly.
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_ROOT="/srv/backups"
LOG_FILE="/var/log/gpcb-backup.log"
DATE=$(date '+%Y-%m-%d_%H%M')
LOCK_FILE="/tmp/gpcb-backup.lock"

# Colors (for interactive use)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()   { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  $1" | tee -a "$LOG_FILE"; }
warn()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN]  $1" | tee -a "$LOG_FILE"; }
error() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1" | tee -a "$LOG_FILE"; }

# ============================================================
# Prevent concurrent runs
# ============================================================
if [ -f "$LOCK_FILE" ]; then
    LOCK_PID=$(cat "$LOCK_FILE" 2>/dev/null || echo "")
    if [ -n "$LOCK_PID" ] && kill -0 "$LOCK_PID" 2>/dev/null; then
        error "Another backup is already running (PID $LOCK_PID). Exiting."
        exit 1
    fi
    warn "Stale lock file found. Removing."
    rm -f "$LOCK_FILE"
fi
echo $$ > "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

# ============================================================
# Configuration — Odoo instances
# ============================================================
# Each Odoo app: NAME DB_NAME DB_USER DB_HOST DB_PORT CONTAINER_NAME FILESTORE_PATH
ODOO_APPS=(
    "odoo1:odoo_db1:odoo:localhost:5432:odoo1_web:/srv/odoo1/filestore"
    "odoo2:odoo_db2:odoo:localhost:5432:odoo2_web:/srv/odoo2/filestore"
    "odoo3:odoo_db3:odoo:localhost:5432:odoo3_web:/srv/odoo3/filestore"
)

# Override from config file if present
CONFIG_FILE="/etc/gpcb/backup.conf"
if [ -f "$CONFIG_FILE" ]; then
    # shellcheck source=/dev/null
    source "$CONFIG_FILE"
fi

# ============================================================
# Pre-flight checks
# ============================================================
log "=========================================="
log "GPCB Nightly Backup — Started"
log "=========================================="

mkdir -p "$BACKUP_ROOT"

ERRORS=0
TOTAL=0

# ============================================================
# Step 1: Backup each Odoo instance
# ============================================================
log "--- Odoo Backups ---"

for APP_ENTRY in "${ODOO_APPS[@]}"; do
    IFS=':' read -r APP_NAME DB_NAME DB_USER DB_HOST DB_PORT CONTAINER FILESTORE <<< "$APP_ENTRY"

    TOTAL=$((TOTAL + 1))
    log "Backing up Odoo app: $APP_NAME"

    if "$SCRIPT_DIR/backup-odoo.sh" \
        --name "$APP_NAME" \
        --db-name "$DB_NAME" \
        --db-user "$DB_USER" \
        --db-host "$DB_HOST" \
        --db-port "$DB_PORT" \
        --container "$CONTAINER" \
        --filestore "$FILESTORE" \
        --backup-dir "$BACKUP_ROOT/odoo/$APP_NAME" \
        --date "$DATE"; then
        log "  ✓ $APP_NAME backup complete"
    else
        error "  ✗ $APP_NAME backup FAILED"
        ERRORS=$((ERRORS + 1))
    fi
done

# ============================================================
# Step 2: Backup FreePBX
# ============================================================
log "--- FreePBX Backup ---"

TOTAL=$((TOTAL + 1))
log "Backing up FreePBX..."

if "$SCRIPT_DIR/backup-pbx.sh" \
    --backup-dir "$BACKUP_ROOT/pbx" \
    --date "$DATE"; then
    log "  ✓ FreePBX backup complete"
else
    error "  ✗ FreePBX backup FAILED"
    ERRORS=$((ERRORS + 1))
fi

# ============================================================
# Step 3: Rotate old backups
# ============================================================
log "--- Backup Rotation ---"

"$SCRIPT_DIR/backup-rotate.sh" --backup-dir "$BACKUP_ROOT" || {
    warn "Backup rotation had warnings"
}

# ============================================================
# Step 4: Summary
# ============================================================
SUCCEEDED=$((TOTAL - ERRORS))

log "=========================================="
log "GPCB Nightly Backup — Complete"
log "  Total: $TOTAL | Succeeded: $SUCCEEDED | Failed: $ERRORS"
log "=========================================="

# Calculate total backup size
BACKUP_SIZE=$(du -sh "$BACKUP_ROOT" 2>/dev/null | awk '{print $1}')
log "Total backup storage used: $BACKUP_SIZE"

if [ "$ERRORS" -gt 0 ]; then
    error "BACKUP ERRORS: $ERRORS backup(s) failed. Check $LOG_FILE for details."
    exit 1
fi

exit 0
