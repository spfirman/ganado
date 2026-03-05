#!/bin/bash
# ============================================================
# GPCB — Rocket.Chat + MongoDB Backup Script
# ============================================================
# Backs up:
#   1. MongoDB database (rocketchat) via mongodump
#   2. Rocket.Chat uploads volume
#
# Usage:
#   sudo bash backup-rocketchat.sh --backup-dir /srv/backups/rocketchat --date 2026-03-01_0200
# ============================================================

set -euo pipefail

BACKUP_DIR=""
DATE=""
MONGO_CONTAINER="mongo-rocketchat"
RC_UPLOADS_VOLUME="rocketchat_rc_uploads"

# ============================================================
# Parse arguments
# ============================================================
while [[ $# -gt 0 ]]; do
    case "$1" in
        --backup-dir) BACKUP_DIR="$2"; shift 2 ;;
        --date) DATE="$2"; shift 2 ;;
        *) shift ;;
    esac
done

if [ -z "$BACKUP_DIR" ] || [ -z "$DATE" ]; then
    echo "Usage: backup-rocketchat.sh --backup-dir <dir> --date <YYYY-MM-DD_HHMM>"
    exit 1
fi

log()   { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [INFO]  $1"; }
error() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] [ERROR] $1" >&2; }

mkdir -p "$BACKUP_DIR"

# ============================================================
# Step 1: MongoDB dump
# ============================================================
log "Dumping MongoDB database..."

MONGO_DUMP_FILE="$BACKUP_DIR/${DATE}_rocketchat_mongo.gz"

docker exec "$MONGO_CONTAINER" mongodump \
    --db rocketchat \
    --archive=/tmp/rc-backup.gz \
    --gzip \
    --quiet 2>/dev/null

docker cp "$MONGO_CONTAINER":/tmp/rc-backup.gz "$MONGO_DUMP_FILE"
docker exec "$MONGO_CONTAINER" rm -f /tmp/rc-backup.gz

log "  MongoDB dump: $(du -sh "$MONGO_DUMP_FILE" | awk '{print $1}')"

# Generate checksum
sha256sum "$MONGO_DUMP_FILE" > "$MONGO_DUMP_FILE.sha256"

# ============================================================
# Step 2: Uploads volume backup
# ============================================================
log "Backing up RC uploads volume..."

UPLOADS_FILE="$BACKUP_DIR/${DATE}_rc_uploads.tar.gz"

docker run --rm \
    -v "$RC_UPLOADS_VOLUME":/data:ro \
    -v "$BACKUP_DIR":/backup \
    alpine tar czf "/backup/$(basename "$UPLOADS_FILE")" -C /data . 2>/dev/null

log "  Uploads backup: $(du -sh "$UPLOADS_FILE" | awk '{print $1}')"

# Generate checksum
sha256sum "$UPLOADS_FILE" > "$UPLOADS_FILE.sha256"

# ============================================================
# Summary
# ============================================================
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | awk '{print $1}')
log "Rocket.Chat backup complete. Total: $TOTAL_SIZE"
