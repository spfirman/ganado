#!/bin/bash
# ============================================================
# GPCB — Backup Rotation Script
# ============================================================
# Retention policy:
#   - Daily:   7 days
#   - Weekly:  4 weeks (Sundays)
#   - Monthly: 6 months (1st of month)
#
# Directory structure expected:
#   /srv/backups/
#     odoo/odoo1/YYYY-MM-DD_HHMM/
#     odoo/odoo2/YYYY-MM-DD_HHMM/
#     odoo/odoo3/YYYY-MM-DD_HHMM/
#     pbx/YYYY-MM-DD_HHMM/
#
# Usage:
#   bash backup-rotate.sh --backup-dir /srv/backups
#
# Called by backup-all.sh or can be run standalone.
# ============================================================

set -euo pipefail

LOG_FILE="/var/log/gpcb-backup.log"

log()   { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  [rotate] $1" | tee -a "$LOG_FILE"; }
warn()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN]  [rotate] $1" | tee -a "$LOG_FILE"; }

# ============================================================
# Parse arguments
# ============================================================
BACKUP_DIR=""

# Retention periods (in days)
DAILY_KEEP=7
WEEKLY_KEEP=28    # 4 weeks
MONTHLY_KEEP=180  # 6 months

while [[ $# -gt 0 ]]; do
    case "$1" in
        --backup-dir)   BACKUP_DIR="$2";   shift 2 ;;
        --daily-keep)   DAILY_KEEP="$2";   shift 2 ;;
        --weekly-keep)  WEEKLY_KEEP="$2";  shift 2 ;;
        --monthly-keep) MONTHLY_KEEP="$2"; shift 2 ;;
        *)
            echo "Unknown argument: $1" >&2
            exit 1
            ;;
    esac
done

if [ -z "$BACKUP_DIR" ] || [ ! -d "$BACKUP_DIR" ]; then
    echo "Required: --backup-dir pointing to an existing directory" >&2
    exit 1
fi

log "Backup rotation started for: $BACKUP_DIR"
log "  Retention: daily=${DAILY_KEEP}d, weekly=${WEEKLY_KEEP}d, monthly=${MONTHLY_KEEP}d"

REMOVED=0
KEPT=0

# ============================================================
# rotate_backups — Process a single backup category directory
# ============================================================
# Expects subdirectories named YYYY-MM-DD_HHMM
rotate_backups() {
    local CATEGORY_DIR="$1"
    local CATEGORY_NAME="$2"

    if [ ! -d "$CATEGORY_DIR" ]; then
        return
    fi

    log "  Processing: $CATEGORY_NAME ($CATEGORY_DIR)"

    # List all backup directories sorted oldest first
    local DIRS
    DIRS=$(find "$CATEGORY_DIR" -maxdepth 1 -mindepth 1 -type d -name "20[0-9][0-9]-[0-9][0-9]-[0-9][0-9]_[0-9][0-9][0-9][0-9]" | sort)

    if [ -z "$DIRS" ]; then
        log "    No backup directories found"
        return
    fi

    local TODAY_EPOCH
    TODAY_EPOCH=$(date +%s)

    while IFS= read -r DIR; do
        local DIR_NAME
        DIR_NAME=$(basename "$DIR")

        # Extract date from directory name (YYYY-MM-DD_HHMM)
        local DIR_DATE="${DIR_NAME%%_*}"
        local DIR_EPOCH
        DIR_EPOCH=$(date -d "$DIR_DATE" +%s 2>/dev/null || echo "0")

        if [ "$DIR_EPOCH" -eq 0 ]; then
            warn "    Cannot parse date from: $DIR_NAME (skipping)"
            continue
        fi

        local AGE_DAYS=$(( (TODAY_EPOCH - DIR_EPOCH) / 86400 ))
        local DIR_DOW
        DIR_DOW=$(date -d "$DIR_DATE" +%u 2>/dev/null || echo "0")  # 1=Mon, 7=Sun
        local DIR_DOM
        DIR_DOM=$(date -d "$DIR_DATE" +%d 2>/dev/null || echo "0")  # Day of month

        local KEEP=false
        local REASON=""

        # Rule 1: Keep all backups within DAILY_KEEP days
        if [ "$AGE_DAYS" -le "$DAILY_KEEP" ]; then
            KEEP=true
            REASON="daily (${AGE_DAYS}d old)"
        fi

        # Rule 2: Keep Sunday backups within WEEKLY_KEEP days
        if [ "$KEEP" = false ] && [ "$AGE_DAYS" -le "$WEEKLY_KEEP" ] && [ "$DIR_DOW" -eq 7 ]; then
            KEEP=true
            REASON="weekly/Sunday (${AGE_DAYS}d old)"
        fi

        # Rule 3: Keep 1st-of-month backups within MONTHLY_KEEP days
        if [ "$KEEP" = false ] && [ "$AGE_DAYS" -le "$MONTHLY_KEEP" ] && [ "$DIR_DOM" = "01" ]; then
            KEEP=true
            REASON="monthly/1st (${AGE_DAYS}d old)"
        fi

        if [ "$KEEP" = true ]; then
            KEPT=$((KEPT + 1))
        else
            local DIR_SIZE
            DIR_SIZE=$(du -sh "$DIR" 2>/dev/null | awk '{print $1}')
            log "    Removing: $DIR_NAME (${AGE_DAYS}d old, $DIR_SIZE)"
            rm -rf "$DIR"
            REMOVED=$((REMOVED + 1))
        fi
    done <<< "$DIRS"
}

# ============================================================
# Process each backup category
# ============================================================

# Odoo instances
if [ -d "$BACKUP_DIR/odoo" ]; then
    for ODOO_DIR in "$BACKUP_DIR/odoo"/*/; do
        if [ -d "$ODOO_DIR" ]; then
            ODOO_NAME=$(basename "$ODOO_DIR")
            rotate_backups "$ODOO_DIR" "odoo/$ODOO_NAME"
        fi
    done
fi

# FreePBX
rotate_backups "$BACKUP_DIR/pbx" "pbx"

# ============================================================
# Clean up empty directories
# ============================================================
find "$BACKUP_DIR" -mindepth 2 -type d -empty -delete 2>/dev/null || true

# ============================================================
# Summary
# ============================================================
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | awk '{print $1}')
log "Rotation complete: kept=$KEPT, removed=$REMOVED, total size=$TOTAL_SIZE"

exit 0
