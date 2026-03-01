#!/bin/bash
# ============================================================
# GPCB — Odoo Instance Backup Script
# ============================================================
# Parameterized per-app backup: PostgreSQL dump + filestore tar.
#
# Usage:
#   bash backup-odoo.sh \
#     --name odoo1 \
#     --db-name odoo_db1 \
#     --db-user odoo \
#     --db-host localhost \
#     --db-port 5432 \
#     --container odoo1_web \
#     --filestore /srv/odoo1/filestore \
#     --backup-dir /srv/backups/odoo/odoo1 \
#     --date 2026-03-01_0200
#
# Called by backup-all.sh or can be run standalone.
# ============================================================

set -euo pipefail

LOG_FILE="/var/log/gpcb-backup.log"

log()   { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  [odoo] $1" | tee -a "$LOG_FILE"; }
warn()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN]  [odoo] $1" | tee -a "$LOG_FILE"; }
error() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] [odoo] $1" | tee -a "$LOG_FILE"; }

# ============================================================
# Parse arguments
# ============================================================
APP_NAME=""
DB_NAME=""
DB_USER="odoo"
DB_HOST="localhost"
DB_PORT="5432"
CONTAINER=""
FILESTORE=""
BACKUP_DIR=""
DATE=$(date '+%Y-%m-%d_%H%M')

while [[ $# -gt 0 ]]; do
    case "$1" in
        --name)       APP_NAME="$2";    shift 2 ;;
        --db-name)    DB_NAME="$2";     shift 2 ;;
        --db-user)    DB_USER="$2";     shift 2 ;;
        --db-host)    DB_HOST="$2";     shift 2 ;;
        --db-port)    DB_PORT="$2";     shift 2 ;;
        --container)  CONTAINER="$2";   shift 2 ;;
        --filestore)  FILESTORE="$2";   shift 2 ;;
        --backup-dir) BACKUP_DIR="$2";  shift 2 ;;
        --date)       DATE="$2";        shift 2 ;;
        *)
            error "Unknown argument: $1"
            exit 1
            ;;
    esac
done

# Validate required arguments
if [ -z "$APP_NAME" ] || [ -z "$DB_NAME" ] || [ -z "$BACKUP_DIR" ]; then
    error "Required: --name, --db-name, --backup-dir"
    exit 1
fi

DEST="$BACKUP_DIR/$DATE"
mkdir -p "$DEST"

log "Backup started for $APP_NAME → $DEST"

# ============================================================
# Step 1: PostgreSQL database dump
# ============================================================
DB_DUMP="$DEST/${APP_NAME}_db_${DATE}.sql.gz"

log "  Dumping database: $DB_NAME"

if command -v pg_dump &>/dev/null; then
    pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --no-owner \
        --no-privileges \
        --format=custom \
        --compress=6 \
        -f "${DEST}/${APP_NAME}_db_${DATE}.dump" 2>>"$LOG_FILE"

    # Also create a plain-text compressed backup for portability
    pg_dump \
        -h "$DB_HOST" \
        -p "$DB_PORT" \
        -U "$DB_USER" \
        -d "$DB_NAME" \
        --no-owner \
        --no-privileges \
        2>>"$LOG_FILE" | gzip > "$DB_DUMP"

    DB_SIZE=$(du -sh "$DB_DUMP" 2>/dev/null | awk '{print $1}')
    log "  Database dump: $DB_SIZE"
else
    # Try via Docker container
    if [ -n "$CONTAINER" ] && docker ps --format "{{.Names}}" | grep -q "^${CONTAINER}$" 2>/dev/null; then
        log "  pg_dump not found locally, using container: $CONTAINER"
        docker exec "$CONTAINER" pg_dump \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            --no-owner \
            --no-privileges \
            2>>"$LOG_FILE" | gzip > "$DB_DUMP"
    else
        error "  pg_dump not available and container '$CONTAINER' not running"
        exit 1
    fi
fi

# Verify dump is not empty
if [ ! -s "$DB_DUMP" ]; then
    error "  Database dump is empty: $DB_DUMP"
    exit 1
fi

# ============================================================
# Step 2: Filestore backup
# ============================================================
if [ -n "$FILESTORE" ] && [ -d "$FILESTORE" ]; then
    FS_TAR="$DEST/${APP_NAME}_filestore_${DATE}.tar.gz"

    log "  Archiving filestore: $FILESTORE"

    tar czf "$FS_TAR" \
        -C "$(dirname "$FILESTORE")" \
        "$(basename "$FILESTORE")" \
        2>>"$LOG_FILE"

    FS_SIZE=$(du -sh "$FS_TAR" 2>/dev/null | awk '{print $1}')
    log "  Filestore archive: $FS_SIZE"
elif [ -n "$FILESTORE" ]; then
    warn "  Filestore path does not exist: $FILESTORE (skipping)"
else
    log "  No filestore path configured (skipping)"
fi

# ============================================================
# Step 3: Odoo config backup
# ============================================================
# Try to grab the Odoo config file from the container
if [ -n "$CONTAINER" ] && docker ps --format "{{.Names}}" | grep -q "^${CONTAINER}$" 2>/dev/null; then
    ODOO_CONF="$DEST/${APP_NAME}_odoo.conf"
    docker cp "${CONTAINER}:/etc/odoo/odoo.conf" "$ODOO_CONF" 2>/dev/null || true

    if [ -f "$ODOO_CONF" ]; then
        # Redact passwords in the config
        sed -i \
            -e 's/\(db_password\s*=\s*\).*/\1REDACTED/' \
            -e 's/\(admin_passwd\s*=\s*\).*/\1REDACTED/' \
            -e 's/\(smtp_password\s*=\s*\).*/\1REDACTED/' \
            "$ODOO_CONF"
        log "  Odoo config saved (passwords redacted)"
    fi
fi

# ============================================================
# Step 4: Create checksum
# ============================================================
cd "$DEST"
sha256sum ./* > checksums.sha256 2>/dev/null || true
log "  Checksums generated"

# ============================================================
# Summary
# ============================================================
TOTAL_SIZE=$(du -sh "$DEST" 2>/dev/null | awk '{print $1}')
log "Backup complete for $APP_NAME: $TOTAL_SIZE total → $DEST"

exit 0
