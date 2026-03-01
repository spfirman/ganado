#!/bin/bash
# ============================================================
# GPCB — FreePBX Backup Script
# ============================================================
# Backs up FreePBX via fwconsole or manual fallback.
# Captures: Asterisk configs, MySQL/MariaDB databases,
#           voicemail, recordings, CDR data.
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

while [[ $# -gt 0 ]]; do
    case "$1" in
        --backup-dir) BACKUP_DIR="$2"; shift 2 ;;
        --date)       DATE="$2";       shift 2 ;;
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
# Configuration
# ============================================================
# FreePBX paths (adjust if your install differs)
ASTERISK_CONF_DIR="/etc/asterisk"
FREEPBX_CONF_DIR="/etc/freepbx.conf"
VOICEMAIL_DIR="/var/spool/asterisk/voicemail"
RECORDINGS_DIR="/var/spool/asterisk/monitor"
SOUNDS_CUSTOM_DIR="/var/lib/asterisk/sounds/custom"
MOH_DIR="/var/lib/asterisk/moh"
AGI_DIR="/var/lib/asterisk/agi-bin"
CDR_DB="/var/log/asterisk/cdr-csv"
FREEPBX_BACKUP_DIR="/var/spool/asterisk/backup"

# MySQL credentials (read from FreePBX config if available)
MYSQL_USER="freepbxuser"
MYSQL_PASS=""
MYSQL_HOST="localhost"

if [ -f "$FREEPBX_CONF_DIR" ]; then
    MYSQL_USER=$(grep '^\$amp_conf\[.AMPDBUSER.\]' "$FREEPBX_CONF_DIR" 2>/dev/null | sed "s/.*= *['\"]//;s/['\"].*//" || echo "$MYSQL_USER")
    MYSQL_PASS=$(grep '^\$amp_conf\[.AMPDBPASS.\]' "$FREEPBX_CONF_DIR" 2>/dev/null | sed "s/.*= *['\"]//;s/['\"].*//" || echo "")
    MYSQL_HOST=$(grep '^\$amp_conf\[.AMPDBHOST.\]' "$FREEPBX_CONF_DIR" 2>/dev/null | sed "s/.*= *['\"]//;s/['\"].*//" || echo "$MYSQL_HOST")
fi

ERRORS=0

# ============================================================
# Method 1: Try fwconsole backup (preferred)
# ============================================================
FWCONSOLE_SUCCESS=false

if command -v fwconsole &>/dev/null; then
    log "Attempting fwconsole backup..."

    # Create a backup using fwconsole
    if fwconsole backup --id=nightly 2>>"$LOG_FILE"; then
        # Find the latest backup created by fwconsole
        LATEST_FW_BACKUP=$(find "$FREEPBX_BACKUP_DIR" -name "*.tgz" -newer "$DEST" -type f 2>/dev/null | sort -r | head -1)

        if [ -n "$LATEST_FW_BACKUP" ] && [ -f "$LATEST_FW_BACKUP" ]; then
            cp "$LATEST_FW_BACKUP" "$DEST/freepbx_fwconsole_${DATE}.tgz"
            log "  fwconsole backup saved: $(du -sh "$LATEST_FW_BACKUP" | awk '{print $1}')"
            FWCONSOLE_SUCCESS=true
        else
            warn "  fwconsole ran but no backup file found"
        fi
    else
        warn "  fwconsole backup failed, falling back to manual backup"
    fi
else
    log "fwconsole not found, using manual backup method"
fi

# ============================================================
# Method 2: Manual fallback (always runs as supplementary)
# ============================================================
log "Running manual backup components..."

# --- 2a: Asterisk configuration files ---
if [ -d "$ASTERISK_CONF_DIR" ]; then
    log "  Archiving Asterisk configs..."
    tar czf "$DEST/asterisk_config_${DATE}.tar.gz" \
        -C "$(dirname "$ASTERISK_CONF_DIR")" \
        "$(basename "$ASTERISK_CONF_DIR")" \
        2>>"$LOG_FILE" || {
        error "  Failed to archive Asterisk configs"
        ERRORS=$((ERRORS + 1))
    }
else
    warn "  Asterisk config dir not found: $ASTERISK_CONF_DIR"
fi

# --- 2b: FreePBX config file ---
if [ -f "$FREEPBX_CONF_DIR" ]; then
    # Copy but redact credentials
    REDACTED_CONF="$DEST/freepbx.conf.redacted"
    sed \
        -e "s/\(AMPDBPASS.*= *['\"\]\)[^'\"]*\(['\"\]\)/\1REDACTED\2/g" \
        -e "s/\(AMPMGRPASS.*= *['\"\]\)[^'\"]*\(['\"\]\)/\1REDACTED\2/g" \
        "$FREEPBX_CONF_DIR" > "$REDACTED_CONF" 2>/dev/null || true
    log "  FreePBX config saved (credentials redacted)"
fi

# --- 2c: MySQL/MariaDB databases ---
if command -v mysqldump &>/dev/null && [ -n "$MYSQL_PASS" ]; then
    log "  Dumping MySQL databases..."

    for DB in asterisk asteriskcdrdb; do
        DB_DUMP="$DEST/mysql_${DB}_${DATE}.sql.gz"
        if mysqldump \
            -h "$MYSQL_HOST" \
            -u "$MYSQL_USER" \
            -p"$MYSQL_PASS" \
            --single-transaction \
            --routines \
            --triggers \
            "$DB" 2>>"$LOG_FILE" | gzip > "$DB_DUMP"; then
            log "  Database $DB: $(du -sh "$DB_DUMP" | awk '{print $1}')"
        else
            error "  Failed to dump database: $DB"
            ERRORS=$((ERRORS + 1))
        fi
    done
elif command -v mysqldump &>/dev/null; then
    warn "  MySQL password not found, skipping database dump"
    warn "  Set credentials in /etc/freepbx.conf or /etc/gpcb/backup.conf"
else
    warn "  mysqldump not found, skipping database dump"
fi

# --- 2d: Voicemail ---
if [ -d "$VOICEMAIL_DIR" ]; then
    VOICEMAIL_SIZE=$(du -sh "$VOICEMAIL_DIR" 2>/dev/null | awk '{print $1}')
    log "  Archiving voicemail ($VOICEMAIL_SIZE)..."
    tar czf "$DEST/voicemail_${DATE}.tar.gz" \
        -C "$(dirname "$VOICEMAIL_DIR")" \
        "$(basename "$VOICEMAIL_DIR")" \
        2>>"$LOG_FILE" || {
        error "  Failed to archive voicemail"
        ERRORS=$((ERRORS + 1))
    }
else
    log "  No voicemail directory found (skipping)"
fi

# --- 2e: Call recordings ---
if [ -d "$RECORDINGS_DIR" ]; then
    RECORDINGS_SIZE=$(du -sh "$RECORDINGS_DIR" 2>/dev/null | awk '{print $1}')
    log "  Archiving call recordings ($RECORDINGS_SIZE)..."

    # Only archive recordings from the last 30 days to keep size manageable
    RECORDINGS_TAR="$DEST/recordings_${DATE}.tar.gz"
    find "$RECORDINGS_DIR" -type f -mtime -30 -print0 2>/dev/null | \
        tar czf "$RECORDINGS_TAR" --null -T - 2>>"$LOG_FILE" || {
        warn "  Recording archive had issues (may be empty)"
    }
else
    log "  No recordings directory found (skipping)"
fi

# --- 2f: Custom sounds and music-on-hold ---
for DIR_ENTRY in "$SOUNDS_CUSTOM_DIR:sounds_custom" "$MOH_DIR:moh" "$AGI_DIR:agi_scripts"; do
    IFS=':' read -r SRC_DIR LABEL <<< "$DIR_ENTRY"
    if [ -d "$SRC_DIR" ]; then
        tar czf "$DEST/${LABEL}_${DATE}.tar.gz" \
            -C "$(dirname "$SRC_DIR")" \
            "$(basename "$SRC_DIR")" \
            2>>"$LOG_FILE" || true
        log "  Archived $LABEL"
    fi
done

# --- 2g: CDR CSV data ---
if [ -d "$CDR_DB" ]; then
    tar czf "$DEST/cdr_csv_${DATE}.tar.gz" \
        -C "$(dirname "$CDR_DB")" \
        "$(basename "$CDR_DB")" \
        2>>"$LOG_FILE" || true
    log "  CDR CSV data archived"
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

log "FreePBX backup complete: $FILE_COUNT files, $TOTAL_SIZE total → $DEST"

if [ "$FWCONSOLE_SUCCESS" = true ]; then
    log "  Method: fwconsole + manual supplementary"
else
    log "  Method: manual fallback only"
fi

if [ "$ERRORS" -gt 0 ]; then
    error "FreePBX backup completed with $ERRORS error(s)"
    exit 1
fi

exit 0
