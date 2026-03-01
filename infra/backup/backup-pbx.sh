#!/bin/bash
# ============================================================
# GPCB — FreePBX Backup Script (Dockerized)
# ============================================================
# Backs up FreePBX from Docker containers:
#   - freepbx:    Asterisk configs, voicemail, recordings, sounds
#   - freepbx-db: MariaDB databases (asterisk, asteriskcdrdb)
#
# Uses fwconsole backup (preferred) + manual docker cp/exec fallback.
#
# Usage:
#   sudo bash backup-pbx.sh --backup-dir /srv/backups/pbx [--date 2026-03-01_0200]
#
# Called by backup-all.sh or can be run standalone.
# ============================================================

set -euo pipefail

LOG_FILE="/var/log/gpcb-backup.log"

log()   { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  [pbx] $1" | tee -a "$LOG_FILE"; }
warn()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [WARN]  [pbx] $1" | tee -a "$LOG_FILE"; }
error() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] [pbx] $1" | tee -a "$LOG_FILE"; }

# ============================================================
# Parse arguments
# ============================================================
BACKUP_DIR=""
DATE=$(date '+%Y-%m-%d_%H%M')
CONTAINER="freepbx"
DB_CONTAINER="freepbx-db"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --backup-dir)    BACKUP_DIR="$2";    shift 2 ;;
        --date)          DATE="$2";          shift 2 ;;
        --container)     CONTAINER="$2";     shift 2 ;;
        --db-container)  DB_CONTAINER="$2";  shift 2 ;;
        *)
            error "Unknown argument: $1"
            exit 1
            ;;
    esac
done

if [ -z "$BACKUP_DIR" ]; then
    error "Required: --backup-dir"
    exit 1
fi

DEST="$BACKUP_DIR/$DATE"
mkdir -p "$DEST"

log "FreePBX backup started → $DEST"

# ============================================================
# Pre-flight: verify containers are running
# ============================================================
if ! docker ps --format "{{.Names}}" | grep -q "^${CONTAINER}$"; then
    error "FreePBX container '$CONTAINER' is not running"
    exit 1
fi

if ! docker ps --format "{{.Names}}" | grep -q "^${DB_CONTAINER}$"; then
    error "FreePBX DB container '$DB_CONTAINER' is not running"
    exit 1
fi

log "Containers running: $CONTAINER, $DB_CONTAINER"

# Helper
dexec() { docker exec "$CONTAINER" "$@"; }

ERRORS=0

# ============================================================
# 1. fwconsole backup (preferred — comprehensive)
# ============================================================
FWCONSOLE_SUCCESS=false

log "Attempting fwconsole backup..."
if dexec fwconsole backup --id=nightly 2>>"$LOG_FILE"; then
    # Find the latest backup created by fwconsole inside the container
    LATEST_FW_BACKUP=$(dexec find /var/spool/asterisk/backup -name "*.tgz" -type f -newer /tmp 2>/dev/null | sort -r | head -1)

    if [ -n "$LATEST_FW_BACKUP" ]; then
        docker cp "${CONTAINER}:${LATEST_FW_BACKUP}" "$DEST/freepbx_fwconsole_${DATE}.tgz" 2>/dev/null
        if [ -s "$DEST/freepbx_fwconsole_${DATE}.tgz" ]; then
            FW_SIZE=$(du -sh "$DEST/freepbx_fwconsole_${DATE}.tgz" | awk '{print $1}')
            log "  fwconsole backup: $FW_SIZE"
            FWCONSOLE_SUCCESS=true
        fi
    fi

    if [ "$FWCONSOLE_SUCCESS" = false ]; then
        warn "  fwconsole ran but no backup file found"
    fi
else
    warn "  fwconsole backup failed, using manual method only"
fi

# ============================================================
# 2. MariaDB database dumps
# ============================================================
log "Dumping MariaDB databases..."

# Read DB root password from Docker secret
DB_PASS=$(docker exec "$DB_CONTAINER" cat /run/secrets/mysql_root_password 2>/dev/null || echo "")

if [ -n "$DB_PASS" ]; then
    for DB in asterisk asteriskcdrdb; do
        DB_DUMP="$DEST/mysql_${DB}_${DATE}.sql.gz"
        if docker exec "$DB_CONTAINER" mysqldump \
            -u root -p"$DB_PASS" \
            --single-transaction \
            --routines \
            --triggers \
            "$DB" 2>>"$LOG_FILE" | gzip > "$DB_DUMP"; then

            if [ -s "$DB_DUMP" ]; then
                DUMP_SIZE=$(du -sh "$DB_DUMP" | awk '{print $1}')
                log "  Database $DB: $DUMP_SIZE"
            else
                warn "  Database $DB dump is empty"
                rm -f "$DB_DUMP"
                ERRORS=$((ERRORS + 1))
            fi
        else
            error "  Failed to dump database: $DB"
            rm -f "$DB_DUMP"
            ERRORS=$((ERRORS + 1))
        fi
    done
else
    error "  Cannot read MariaDB root password from secret"
    ERRORS=$((ERRORS + 1))
fi

# ============================================================
# 3. Asterisk configuration files
# ============================================================
log "Archiving Asterisk configs..."

ASTERISK_TAR="$DEST/asterisk_config_${DATE}.tar.gz"
if docker exec "$CONTAINER" tar czf - -C /etc asterisk 2>>"$LOG_FILE" > "$ASTERISK_TAR"; then
    if [ -s "$ASTERISK_TAR" ]; then
        TAR_SIZE=$(du -sh "$ASTERISK_TAR" | awk '{print $1}')
        log "  Asterisk configs: $TAR_SIZE"
    else
        warn "  Asterisk config archive is empty"
        rm -f "$ASTERISK_TAR"
    fi
else
    error "  Failed to archive Asterisk configs"
    ERRORS=$((ERRORS + 1))
fi

# ============================================================
# 4. Voicemail
# ============================================================
log "Archiving voicemail..."

if dexec test -d /var/spool/asterisk/voicemail 2>/dev/null; then
    VM_TAR="$DEST/voicemail_${DATE}.tar.gz"
    if docker exec "$CONTAINER" tar czf - -C /var/spool/asterisk voicemail 2>>"$LOG_FILE" > "$VM_TAR"; then
        if [ -s "$VM_TAR" ]; then
            VM_SIZE=$(du -sh "$VM_TAR" | awk '{print $1}')
            log "  Voicemail: $VM_SIZE"
        else
            log "  Voicemail archive is empty (no messages)"
            rm -f "$VM_TAR"
        fi
    fi
else
    log "  No voicemail directory in container"
fi

# ============================================================
# 5. Call recordings (last 30 days)
# ============================================================
log "Archiving call recordings..."

if dexec test -d /var/spool/asterisk/monitor 2>/dev/null; then
    REC_TAR="$DEST/recordings_${DATE}.tar.gz"
    if docker exec "$CONTAINER" bash -c \
        'find /var/spool/asterisk/monitor -type f -mtime -30 -print0 | tar czf - --null -T -' \
        > "$REC_TAR" 2>>"$LOG_FILE"; then
        if [ -s "$REC_TAR" ]; then
            REC_SIZE=$(du -sh "$REC_TAR" | awk '{print $1}')
            log "  Recordings (30d): $REC_SIZE"
        else
            log "  No recent recordings"
            rm -f "$REC_TAR"
        fi
    fi
else
    log "  No recordings directory in container"
fi

# ============================================================
# 6. Custom sounds and music-on-hold
# ============================================================
log "Archiving custom sounds..."

for ENTRY in "/var/lib/asterisk/sounds/custom:sounds_custom" "/var/lib/asterisk/moh:moh" "/var/lib/asterisk/agi-bin:agi_scripts"; do
    IFS=':' read -r SRC_PATH LABEL <<< "$ENTRY"
    if dexec test -d "$SRC_PATH" 2>/dev/null; then
        EXTRA_TAR="$DEST/${LABEL}_${DATE}.tar.gz"
        docker exec "$CONTAINER" tar czf - -C "$(dirname "$SRC_PATH")" "$(basename "$SRC_PATH")" \
            > "$EXTRA_TAR" 2>/dev/null || true
        if [ -s "$EXTRA_TAR" ]; then
            log "  Archived $LABEL"
        else
            rm -f "$EXTRA_TAR"
        fi
    fi
done

# ============================================================
# 7. FreePBX config (redacted copy)
# ============================================================
FPBX_CONF="$DEST/freepbx.conf.redacted"
if docker cp "${CONTAINER}:/etc/freepbx.conf" "$FPBX_CONF" 2>/dev/null; then
    sed -i -E \
        -e "s/(AMPDBPASS.*= *')[^']*'/\1REDACTED'/" \
        -e "s/(AMPMGRPASS.*= *')[^']*'/\1REDACTED'/" \
        -e "s/(AMPDBUSER.*= *')[^']*'/\1REDACTED'/" \
        "$FPBX_CONF"
    log "  FreePBX config saved (redacted)"
fi

# ============================================================
# Create checksums
# ============================================================
cd "$DEST"
sha256sum ./* > checksums.sha256 2>/dev/null || true
log "  Checksums generated"

# ============================================================
# Summary
# ============================================================
TOTAL_SIZE=$(du -sh "$DEST" 2>/dev/null | awk '{print $1}')
FILE_COUNT=$(find "$DEST" -type f | wc -l)

log "FreePBX backup complete: $FILE_COUNT files, $TOTAL_SIZE → $DEST"

if [ "$FWCONSOLE_SUCCESS" = true ]; then
    log "  Method: fwconsole + manual supplementary"
else
    log "  Method: manual only"
fi

if [ "$ERRORS" -gt 0 ]; then
    error "FreePBX backup completed with $ERRORS error(s)"
    exit 1
fi

exit 0
