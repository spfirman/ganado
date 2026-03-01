#!/bin/bash
# ============================================================
# GPCB — Capture FreePBX/Asterisk Configuration (Dockerized)
# ============================================================
# Captures Asterisk/FreePBX configuration from the "freepbx"
# Docker container into the config/ directory with secrets
# automatically redacted.
#
# Captures: dialplan, SIP/PJSIP, voicemail config, ring groups,
#           IVR menus, trunks, extensions, feature codes,
#           FreePBX module list, Asterisk runtime status.
#
# Usage:
#   sudo bash capture-pbx-config.sh
#   sudo bash capture-pbx-config.sh --container freepbx
#   sudo bash capture-pbx-config.sh --output-dir /path/to/output
#
# Container: freepbx (escomputers/freepbx:17 + Asterisk 21)
# DB:        freepbx-db (MariaDB 10.11)
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/config"
CONTAINER="freepbx"
DB_CONTAINER="freepbx-db"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
ASTERISK_DIR="/etc/asterisk"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC}  $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ============================================================
# Parse arguments
# ============================================================
while [[ $# -gt 0 ]]; do
    case "$1" in
        --output-dir)    OUTPUT_DIR="$2";    shift 2 ;;
        --container)     CONTAINER="$2";     shift 2 ;;
        --db-container)  DB_CONTAINER="$2";  shift 2 ;;
        *)               shift ;;
    esac
done

# ============================================================
# Pre-flight
# ============================================================
info "GPCB — FreePBX/Asterisk Config Capture (Docker)"
info "Container:        $CONTAINER"
info "DB Container:     $DB_CONTAINER"
info "Output directory: $OUTPUT_DIR"
info "Timestamp:        $TIMESTAMP"
echo ""

# Check Docker access
if ! command -v docker &>/dev/null; then
    error "Docker is not installed"
    exit 1
fi

# Verify the FreePBX container is running
if ! docker ps --format "{{.Names}}" | grep -q "^${CONTAINER}$"; then
    error "Container '$CONTAINER' is not running"
    error "Running containers:"
    docker ps --format "  {{.Names}} ({{.Image}})" 2>/dev/null
    exit 1
fi

info "Container is running: $(docker inspect --format='{{.Config.Image}}' "$CONTAINER" 2>/dev/null)"
echo ""

mkdir -p "$OUTPUT_DIR"/{dialplan,sip,voicemail,features,trunks,queues}

# ============================================================
# Helper: execute command inside the FreePBX container
# ============================================================
dexec() {
    docker exec "$CONTAINER" "$@"
}

# ============================================================
# Helper: copy file from container, then redact secrets
# ============================================================
capture_file() {
    local SRC="$1"
    local DEST_DIR="$2"
    local FILENAME
    FILENAME=$(basename "$SRC")

    if dexec test -f "$SRC" 2>/dev/null; then
        docker cp "${CONTAINER}:${SRC}" "$DEST_DIR/$FILENAME" 2>/dev/null
        if [ -f "$DEST_DIR/$FILENAME" ]; then
            redact_secrets "$DEST_DIR/$FILENAME"
            info "  Captured: $FILENAME"
            return 0
        fi
    fi
    return 1
}

# ============================================================
# Secret redaction function
# ============================================================
redact_secrets() {
    local FILE="$1"
    if [ ! -f "$FILE" ]; then
        return
    fi

    sed -i \
        -e 's/\(secret\s*=\s*\).*/\1REDACTED/' \
        -e 's/\(password\s*=\s*\).*/\1REDACTED/' \
        -e 's/\(md5secret\s*=\s*\).*/\1REDACTED/' \
        -e 's/\(auth_pass\s*=\s*\).*/\1REDACTED/' \
        -e 's/\(outbound_auth\/password\s*=\s*\).*/\1REDACTED/' \
        -e 's/\(remotesecret\s*=\s*\).*/\1REDACTED/' \
        -e 's/\(registration\s*=\s*\)[^@]*@/\1REDACTED@/' \
        -e 's/\(register\s*=>\s*\)[^@]*@/\1REDACTED@/' \
        -e 's/\(callerid\s*=.*<\)[0-9]\{7,\}\(>\)/\1REDACTED\2/' \
        "$FILE"

    # Redact external IPs and hostnames
    sed -i -E \
        -e 's/\b(externaddr\s*=\s*).*/\1REDACTED_IP/' \
        -e 's/\b(externhost\s*=\s*).*/\1REDACTED_HOST/' \
        -e 's/\b(externip\s*=\s*).*/\1REDACTED_IP/' \
        -e 's/\b(external_media_address\s*=\s*).*/\1REDACTED_IP/' \
        -e 's/\b(external_signaling_address\s*=\s*).*/\1REDACTED_IP/' \
        "$FILE"
}

CAPTURED=0

# ============================================================
# 1. Dialplan
# ============================================================
info "Capturing dialplan configuration..."

for FILE in extensions.conf extensions_additional.conf extensions_custom.conf extensions_override_freepbx.conf; do
    if capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR/dialplan"; then
        CAPTURED=$((CAPTURED + 1))
    fi
done

# Capture dialplan from Asterisk runtime
RUNTIME_DIALPLAN="$OUTPUT_DIR/dialplan/dialplan_runtime.txt"
if dexec asterisk -rx "dialplan show" > "$RUNTIME_DIALPLAN" 2>/dev/null; then
    if [ -s "$RUNTIME_DIALPLAN" ]; then
        info "  Captured runtime dialplan dump"
        CAPTURED=$((CAPTURED + 1))
    else
        rm -f "$RUNTIME_DIALPLAN"
    fi
fi

# ============================================================
# 2. SIP / PJSIP Configuration
# ============================================================
info "Capturing SIP/PJSIP configuration..."

for FILE in sip.conf sip_additional.conf sip_custom.conf sip_general_custom.conf \
            pjsip.conf pjsip_additional.conf pjsip_custom.conf \
            pjsip.endpoint.conf pjsip.aor.conf pjsip.auth.conf \
            pjsip.registration.conf pjsip.identify.conf pjsip.transports.conf; do
    if capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR/sip"; then
        CAPTURED=$((CAPTURED + 1))
    fi
done

# Capture SIP/PJSIP runtime state
for CMD_PAIR in \
    "pjsip show endpoints:pjsip_endpoints_runtime.txt" \
    "sip show peers:sip_peers_runtime.txt" \
    "pjsip show registrations:pjsip_registrations_runtime.txt" \
    "pjsip show contacts:pjsip_contacts_runtime.txt"; do

    IFS=':' read -r CMD OUTFILE <<< "$CMD_PAIR"
    DEST="$OUTPUT_DIR/sip/$OUTFILE"
    if dexec asterisk -rx "$CMD" > "$DEST" 2>/dev/null && [ -s "$DEST" ]; then
        redact_secrets "$DEST"
        info "  Captured: $OUTFILE"
    else
        rm -f "$DEST"
    fi
done

# ============================================================
# 3. Voicemail
# ============================================================
info "Capturing voicemail configuration..."

for FILE in voicemail.conf voicemail_additional.conf voicemail_custom.conf; do
    if capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR/voicemail"; then
        CAPTURED=$((CAPTURED + 1))
    fi
done

# ============================================================
# 4. Feature codes, ring groups, IVR
# ============================================================
info "Capturing features, ring groups, IVR..."

for FILE in features.conf features_general_custom.conf \
            queues.conf queues_additional.conf queues_custom.conf \
            followme.conf followme_additional.conf \
            ivr.conf ivr_additional.conf; do
    DEST_SUBDIR="features"
    [[ "$FILE" == queues* ]] && DEST_SUBDIR="queues"
    if capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR/$DEST_SUBDIR"; then
        CAPTURED=$((CAPTURED + 1))
    fi
done

# Capture FreePBX feature codes and settings via fwconsole
SETTINGS_FILE="$OUTPUT_DIR/features/freepbx_settings.txt"
if dexec fwconsole setting --list > "$SETTINGS_FILE" 2>/dev/null && [ -s "$SETTINGS_FILE" ]; then
    redact_secrets "$SETTINGS_FILE"
    info "  Captured FreePBX settings"
    CAPTURED=$((CAPTURED + 1))
fi

# ============================================================
# 5. Trunk configuration
# ============================================================
info "Capturing trunk configuration..."

for FILE in sip_registrations.conf iax.conf iax_additional.conf \
            pjsip.registration.conf chan_dahdi.conf; do
    if capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR/trunks"; then
        CAPTURED=$((CAPTURED + 1))
    fi
done

# ============================================================
# 6. Additional important configs
# ============================================================
info "Capturing additional configs..."

for FILE in manager.conf modules.conf musiconhold.conf \
            cdr.conf cdr_custom.conf cel.conf rtp.conf \
            http.conf indications.conf logger.conf asterisk.conf; do
    if capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR"; then
        CAPTURED=$((CAPTURED + 1))
    fi
done

# ============================================================
# 7. FreePBX config (redacted)
# ============================================================
info "Capturing FreePBX config..."

FREEPBX_CONF="$OUTPUT_DIR/freepbx.conf.redacted"
if docker cp "${CONTAINER}:/etc/freepbx.conf" "$FREEPBX_CONF" 2>/dev/null; then
    # Redact PHP credentials
    sed -i -E \
        -e "s/(AMPDBPASS.*= *')[^']*'/\1REDACTED'/" \
        -e "s/(AMPMGRPASS.*= *')[^']*'/\1REDACTED'/" \
        -e "s/(AMPDBUSER.*= *')[^']*'/\1REDACTED'/" \
        "$FREEPBX_CONF"
    info "  Captured: freepbx.conf (credentials redacted)"
    CAPTURED=$((CAPTURED + 1))
fi

# ============================================================
# 8. FreePBX module list
# ============================================================
info "Capturing FreePBX module list..."

MODULES_FILE="$OUTPUT_DIR/freepbx_modules.txt"
if dexec fwconsole ma list > "$MODULES_FILE" 2>/dev/null && [ -s "$MODULES_FILE" ]; then
    info "  Captured: freepbx_modules.txt"
    CAPTURED=$((CAPTURED + 1))
fi

# ============================================================
# 9. Asterisk version and runtime status
# ============================================================
info "Capturing Asterisk version and status..."

{
    echo "# Asterisk Status — captured $TIMESTAMP"
    echo "# Container: $CONTAINER"
    echo "# ============================================"
    echo ""
    echo "## Version"
    dexec asterisk -rx "core show version" 2>/dev/null || echo "N/A"
    echo ""
    echo "## Uptime"
    dexec asterisk -rx "core show uptime" 2>/dev/null || echo "N/A"
    echo ""
    echo "## Channels"
    dexec asterisk -rx "core show channels" 2>/dev/null || echo "N/A"
    echo ""
    echo "## Codecs"
    dexec asterisk -rx "core show codecs" 2>/dev/null || echo "N/A"
    echo ""
    echo "## Modules"
    dexec asterisk -rx "module show" 2>/dev/null || echo "N/A"
} > "$OUTPUT_DIR/asterisk_status.txt"
CAPTURED=$((CAPTURED + 1))
info "  Captured: asterisk_status.txt"

# ============================================================
# 10. Docker container info
# ============================================================
info "Capturing Docker container info..."

{
    echo "# FreePBX Docker Info — captured $TIMESTAMP"
    echo "# ============================================"
    echo ""
    echo "## Container: $CONTAINER"
    docker inspect "$CONTAINER" --format='Image:    {{.Config.Image}}
Created:  {{.Created}}
Status:   {{.State.Status}}
Pid:      {{.State.Pid}}
Memory:   {{.HostConfig.Memory}}
Restart:  {{.HostConfig.RestartPolicy.Name}}
' 2>/dev/null || echo "N/A"
    echo ""
    echo "## Ports"
    docker port "$CONTAINER" 2>/dev/null || echo "N/A"
    echo ""
    echo "## Volumes"
    docker inspect "$CONTAINER" --format='{{range .Mounts}}{{.Type}}: {{.Source}} → {{.Destination}}
{{end}}' 2>/dev/null || echo "N/A"
    echo ""
    echo "## Networks"
    docker inspect "$CONTAINER" --format='{{range $k, $v := .NetworkSettings.Networks}}{{$k}}: {{$v.IPAddress}}
{{end}}' 2>/dev/null || echo "N/A"
    echo ""
    echo "## DB Container: $DB_CONTAINER"
    docker inspect "$DB_CONTAINER" --format='Image:    {{.Config.Image}}
Status:   {{.State.Status}}
' 2>/dev/null || echo "N/A"
} > "$OUTPUT_DIR/docker_info.txt"
CAPTURED=$((CAPTURED + 1))
info "  Captured: docker_info.txt"

# ============================================================
# 11. MariaDB schema dump (structure only, no data)
# ============================================================
info "Capturing MariaDB schema..."

if docker ps --format "{{.Names}}" | grep -q "^${DB_CONTAINER}$"; then
    # Read password from the Docker secret
    DB_PASS=$(docker exec "$DB_CONTAINER" cat /run/secrets/mysql_root_password 2>/dev/null || echo "")

    if [ -n "$DB_PASS" ]; then
        for DB in asterisk asteriskcdrdb; do
            SCHEMA_FILE="$OUTPUT_DIR/mysql_${DB}_schema.sql"
            if docker exec "$DB_CONTAINER" mysqldump \
                -u root -p"$DB_PASS" \
                --no-data \
                --routines \
                --triggers \
                "$DB" > "$SCHEMA_FILE" 2>/dev/null && [ -s "$SCHEMA_FILE" ]; then
                info "  Captured: mysql_${DB}_schema.sql (structure only)"
                CAPTURED=$((CAPTURED + 1))
            else
                rm -f "$SCHEMA_FILE"
                warn "  Could not dump schema for: $DB"
            fi
        done
    else
        warn "  Could not read DB root password from secret"
    fi
else
    warn "  DB container '$DB_CONTAINER' not running"
fi

# ============================================================
# Write metadata
# ============================================================
cat > "$OUTPUT_DIR/CAPTURE_INFO.txt" << EOF
# PBX Configuration Capture (Docker)
# ============================================
# Captured:   $TIMESTAMP
# Host:       $(hostname -f 2>/dev/null || hostname)
# Container:  $CONTAINER ($(docker inspect --format='{{.Config.Image}}' "$CONTAINER" 2>/dev/null))
# DB:         $DB_CONTAINER ($(docker inspect --format='{{.Config.Image}}' "$DB_CONTAINER" 2>/dev/null))
# Files:      $CAPTURED
#
# IMPORTANT: Secrets have been automatically redacted.
# Patterns redacted:
#   - SIP/PJSIP passwords and secrets
#   - Registration credentials
#   - External IP addresses and hostnames
#   - Manager interface passwords
#   - Trunk authentication credentials
#   - FreePBX/MySQL database credentials
#
# To update, re-run:
#   sudo bash $(realpath "$0")
EOF

# ============================================================
# Summary
# ============================================================
echo ""
info "=========================================="
info "PBX config capture complete (Docker)"
info "  Container:      $CONTAINER"
info "  Files captured: $CAPTURED"
info "  Output:         $OUTPUT_DIR"
info "  Secrets:        REDACTED"
info "=========================================="
echo ""
info "Next steps:"
info "  1. Review captured files in $OUTPUT_DIR"
info "  2. Verify no secrets leaked: grep -ri 'password\|secret' $OUTPUT_DIR"
info "  3. git add infra/pbx/config/ && git commit -m 'Capture PBX config'"
echo ""
