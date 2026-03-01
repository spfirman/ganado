#!/bin/bash
# ============================================================
# GPCB — Odoo Restore Script
# ============================================================
# Interactive restore with confirmation prompts.
# Restores a PostgreSQL dump and/or filestore from a backup.
#
# Usage:
#   sudo bash restore-odoo.sh
#   sudo bash restore-odoo.sh --backup-dir /srv/backups/odoo/odoo1/2026-03-01_0200
#   sudo bash restore-odoo.sh --backup-dir /srv/backups/odoo/odoo1/2026-03-01_0200 \
#     --db-name odoo_db1 --db-user odoo --filestore /srv/odoo1/filestore
# ============================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()    { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; }
heading() { echo -e "\n${BOLD}${CYAN}$1${NC}"; }

# ============================================================
# Parse arguments
# ============================================================
BACKUP_DIR=""
DB_NAME=""
DB_USER="odoo"
DB_HOST="localhost"
DB_PORT="5432"
FILESTORE=""
CONTAINER=""
SKIP_CONFIRM=false

while [[ $# -gt 0 ]]; do
    case "$1" in
        --backup-dir) BACKUP_DIR="$2";  shift 2 ;;
        --db-name)    DB_NAME="$2";     shift 2 ;;
        --db-user)    DB_USER="$2";     shift 2 ;;
        --db-host)    DB_HOST="$2";     shift 2 ;;
        --db-port)    DB_PORT="$2";     shift 2 ;;
        --filestore)  FILESTORE="$2";   shift 2 ;;
        --container)  CONTAINER="$2";   shift 2 ;;
        --yes|-y)     SKIP_CONFIRM=true; shift ;;
        *)
            error "Unknown argument: $1"
            exit 1
            ;;
    esac
done

# ============================================================
# Interactive: select backup if not specified
# ============================================================
heading "GPCB — Odoo Restore"
echo ""

if [ -z "$BACKUP_DIR" ]; then
    BACKUP_ROOT="/srv/backups/odoo"

    if [ ! -d "$BACKUP_ROOT" ]; then
        error "Backup root not found: $BACKUP_ROOT"
        exit 1
    fi

    # List available Odoo instances
    heading "Available Odoo instances:"
    INSTANCES=()
    IDX=1
    for INST_DIR in "$BACKUP_ROOT"/*/; do
        if [ -d "$INST_DIR" ]; then
            INST_NAME=$(basename "$INST_DIR")
            BACKUP_COUNT=$(find "$INST_DIR" -maxdepth 1 -mindepth 1 -type d | wc -l)
            echo "  $IDX) $INST_NAME ($BACKUP_COUNT backups)"
            INSTANCES+=("$INST_DIR")
            IDX=$((IDX + 1))
        fi
    done

    if [ ${#INSTANCES[@]} -eq 0 ]; then
        error "No backup instances found in $BACKUP_ROOT"
        exit 1
    fi

    echo ""
    read -rp "Select instance [1-${#INSTANCES[@]}]: " INST_CHOICE
    if [ -z "$INST_CHOICE" ] || [ "$INST_CHOICE" -lt 1 ] || [ "$INST_CHOICE" -gt "${#INSTANCES[@]}" ] 2>/dev/null; then
        error "Invalid selection"
        exit 1
    fi

    SELECTED_INST="${INSTANCES[$((INST_CHOICE - 1))]}"

    # List available backups for this instance
    heading "Available backups for $(basename "$SELECTED_INST"):"
    BACKUPS=()
    IDX=1
    while IFS= read -r BK_DIR; do
        BK_NAME=$(basename "$BK_DIR")
        BK_SIZE=$(du -sh "$BK_DIR" 2>/dev/null | awk '{print $1}')
        BK_FILES=$(find "$BK_DIR" -type f | wc -l)
        echo "  $IDX) $BK_NAME ($BK_SIZE, $BK_FILES files)"
        BACKUPS+=("$BK_DIR")
        IDX=$((IDX + 1))
    done < <(find "$SELECTED_INST" -maxdepth 1 -mindepth 1 -type d | sort -r)

    if [ ${#BACKUPS[@]} -eq 0 ]; then
        error "No backups found for $(basename "$SELECTED_INST")"
        exit 1
    fi

    echo ""
    read -rp "Select backup [1-${#BACKUPS[@]}]: " BK_CHOICE
    if [ -z "$BK_CHOICE" ] || [ "$BK_CHOICE" -lt 1 ] || [ "$BK_CHOICE" -gt "${#BACKUPS[@]}" ] 2>/dev/null; then
        error "Invalid selection"
        exit 1
    fi

    BACKUP_DIR="${BACKUPS[$((BK_CHOICE - 1))]}"
fi

if [ ! -d "$BACKUP_DIR" ]; then
    error "Backup directory not found: $BACKUP_DIR"
    exit 1
fi

# ============================================================
# Detect backup contents
# ============================================================
heading "Backup contents ($BACKUP_DIR):"
ls -lh "$BACKUP_DIR"/
echo ""

# Find database dump
DB_DUMP_CUSTOM=$(find "$BACKUP_DIR" -name "*.dump" -type f | head -1)
DB_DUMP_SQL=$(find "$BACKUP_DIR" -name "*_db_*.sql.gz" -type f | head -1)
FS_TAR=$(find "$BACKUP_DIR" -name "*_filestore_*.tar.gz" -type f | head -1)

# Auto-detect DB name from dump filename
if [ -z "$DB_NAME" ] && [ -n "$DB_DUMP_SQL" ]; then
    DUMP_BASENAME=$(basename "$DB_DUMP_SQL")
    # Extract app name (e.g., "odoo1" from "odoo1_db_2026-03-01_0200.sql.gz")
    INFERRED_APP=$(echo "$DUMP_BASENAME" | sed 's/_db_.*//')
    echo -e "Detected app name: ${CYAN}$INFERRED_APP${NC}"
    read -rp "Database name to restore into [odoo_db1]: " DB_NAME
    DB_NAME="${DB_NAME:-odoo_db1}"
fi

# ============================================================
# Verify checksums
# ============================================================
CHECKSUM_FILE="$BACKUP_DIR/checksums.sha256"
if [ -f "$CHECKSUM_FILE" ]; then
    info "Verifying checksums..."
    cd "$BACKUP_DIR"
    if sha256sum -c checksums.sha256 --quiet 2>/dev/null; then
        info "All checksums valid"
    else
        warn "Some checksum mismatches detected!"
        if [ "$SKIP_CONFIRM" = false ]; then
            read -rp "Continue anyway? [y/N]: " CONTINUE
            if [ "${CONTINUE,,}" != "y" ]; then
                error "Aborted by user"
                exit 1
            fi
        fi
    fi
fi

# ============================================================
# Confirmation
# ============================================================
heading "Restore Plan:"
echo "  Backup:    $BACKUP_DIR"
[ -n "$DB_DUMP_CUSTOM" ] && echo "  DB dump:   $(basename "$DB_DUMP_CUSTOM") (custom format)"
[ -n "$DB_DUMP_SQL" ] && echo "  DB dump:   $(basename "$DB_DUMP_SQL") (SQL format)"
[ -n "$FS_TAR" ] && echo "  Filestore: $(basename "$FS_TAR")"
echo "  Target DB: $DB_NAME (user: $DB_USER, host: $DB_HOST:$DB_PORT)"
[ -n "$FILESTORE" ] && echo "  Target FS: $FILESTORE"
echo ""

if [ "$SKIP_CONFIRM" = false ]; then
    echo -e "${RED}${BOLD}WARNING: This will OVERWRITE the target database and filestore!${NC}"
    read -rp "Type 'RESTORE' to confirm: " CONFIRM
    if [ "$CONFIRM" != "RESTORE" ]; then
        error "Aborted by user"
        exit 1
    fi
fi

# ============================================================
# Step 1: Stop the Odoo container (if specified)
# ============================================================
if [ -n "$CONTAINER" ]; then
    heading "Stopping container: $CONTAINER"
    docker stop "$CONTAINER" 2>/dev/null || warn "Container not running: $CONTAINER"
fi

# ============================================================
# Step 2: Restore database
# ============================================================
if [ -n "$DB_DUMP_CUSTOM" ] || [ -n "$DB_DUMP_SQL" ]; then
    heading "Restoring database: $DB_NAME"

    # Drop and recreate the database
    info "Dropping existing database..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
        -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$DB_NAME' AND pid <> pg_backend_pid();" \
        2>/dev/null || true

    dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" 2>/dev/null || warn "Database didn't exist"
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -O "$DB_USER" "$DB_NAME"
    info "Database created: $DB_NAME"

    # Restore from custom format (preferred) or SQL
    if [ -n "$DB_DUMP_CUSTOM" ]; then
        info "Restoring from custom dump: $(basename "$DB_DUMP_CUSTOM")"
        pg_restore \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            --no-owner \
            --no-privileges \
            --jobs=2 \
            "$DB_DUMP_CUSTOM" 2>&1 || warn "pg_restore completed with warnings (usually OK)"
    elif [ -n "$DB_DUMP_SQL" ]; then
        info "Restoring from SQL dump: $(basename "$DB_DUMP_SQL")"
        gunzip -c "$DB_DUMP_SQL" | psql \
            -h "$DB_HOST" \
            -p "$DB_PORT" \
            -U "$DB_USER" \
            -d "$DB_NAME" \
            --quiet 2>&1 || warn "SQL restore completed with warnings"
    fi

    info "Database restore complete"
fi

# ============================================================
# Step 3: Restore filestore
# ============================================================
if [ -n "$FS_TAR" ] && [ -n "$FILESTORE" ]; then
    heading "Restoring filestore: $FILESTORE"

    # Back up existing filestore
    if [ -d "$FILESTORE" ]; then
        FS_BACKUP="${FILESTORE}.pre-restore.$(date +%s)"
        info "Backing up existing filestore → $FS_BACKUP"
        mv "$FILESTORE" "$FS_BACKUP"
    fi

    # Extract filestore
    mkdir -p "$(dirname "$FILESTORE")"
    tar xzf "$FS_TAR" -C "$(dirname "$FILESTORE")"
    info "Filestore restored: $(du -sh "$FILESTORE" 2>/dev/null | awk '{print $1}')"

    # Fix permissions
    chown -R 101:101 "$FILESTORE" 2>/dev/null || true  # Odoo UID in Docker
fi

# ============================================================
# Step 4: Start the container back up
# ============================================================
if [ -n "$CONTAINER" ]; then
    heading "Starting container: $CONTAINER"
    docker start "$CONTAINER"
    info "Container started"

    # Wait for it to be healthy
    info "Waiting for container to be ready..."
    for i in $(seq 1 30); do
        if docker inspect --format='{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null | grep -q "healthy"; then
            info "Container is healthy"
            break
        fi
        sleep 2
    done
fi

# ============================================================
# Summary
# ============================================================
heading "Restore Complete"
info "Database: $DB_NAME"
[ -n "$FILESTORE" ] && info "Filestore: $FILESTORE"
[ -n "$CONTAINER" ] && info "Container: $CONTAINER"
echo ""
info "Please verify the application is working correctly."
echo ""
