#!/bin/bash
# ============================================================
# GPCB — Capture FreePBX/Asterisk Configuration
# ============================================================
# Run on the PBX server to export Asterisk/FreePBX configuration
# into the config/ directory with secrets automatically redacted.
#
# Captures: dialplan, SIP/PJSIP, voicemail config, ring groups,
#           IVR menus, trunks, extensions, and feature codes.
#
# Usage:
#   sudo bash capture-pbx-config.sh
#   sudo bash capture-pbx-config.sh --output-dir /path/to/infra/pbx/config
#
# IMPORTANT: Run with sudo — needs access to /etc/asterisk
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="${1:-$SCRIPT_DIR/config}"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

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
        --output-dir) OUTPUT_DIR="$2"; shift 2 ;;
        *)            shift ;;
    esac
done

# ============================================================
# Pre-flight
# ============================================================
info "GPCB — FreePBX/Asterisk Config Capture"
info "Output directory: $OUTPUT_DIR"
info "Timestamp: $TIMESTAMP"
echo ""

if [ "$(id -u)" -ne 0 ]; then
    error "This script must be run as root (sudo)"
    exit 1
fi

ASTERISK_DIR="/etc/asterisk"
if [ ! -d "$ASTERISK_DIR" ]; then
    error "Asterisk config directory not found: $ASTERISK_DIR"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"/{dialplan,sip,voicemail,features,trunks,queues}

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
        -e 's/\(amaflags\s*=\s*\).*/\1REDACTED/' \
        -e 's/\(registration\s*=\s*\)[^@]*@/\1REDACTED@/' \
        -e 's/\(register\s*=>\s*\)[^@]*@/\1REDACTED@/' \
        -e 's/\(callerid\s*=.*<\)[0-9]\{7,\}\(>\)/\1REDACTED\2/' \
        "$FILE"

    # Redact external IPs (public IPs, not RFC1918)
    # Matches IPs not starting with 10., 172.16-31., 192.168., or 127.
    sed -i -E \
        -e 's/\b(externaddr\s*=\s*).*/\1REDACTED_IP/' \
        -e 's/\b(externhost\s*=\s*).*/\1REDACTED_HOST/' \
        -e 's/\b(externip\s*=\s*).*/\1REDACTED_IP/' \
        -e 's/\b(external_media_address\s*=\s*).*/\1REDACTED_IP/' \
        -e 's/\b(external_signaling_address\s*=\s*).*/\1REDACTED_IP/' \
        "$FILE"
}

# ============================================================
# Capture and redact a config file
# ============================================================
capture_file() {
    local SRC="$1"
    local DEST_DIR="$2"
    local FILENAME
    FILENAME=$(basename "$SRC")

    if [ -f "$SRC" ]; then
        cp "$SRC" "$DEST_DIR/$FILENAME"
        redact_secrets "$DEST_DIR/$FILENAME"
        info "  Captured: $FILENAME"
    fi
}

CAPTURED=0

# ============================================================
# 1. Dialplan
# ============================================================
info "Capturing dialplan configuration..."

for FILE in extensions.conf extensions_additional.conf extensions_custom.conf extensions_override_freepbx.conf; do
    if [ -f "$ASTERISK_DIR/$FILE" ]; then
        capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR/dialplan"
        CAPTURED=$((CAPTURED + 1))
    fi
done

# Capture dialplan from Asterisk runtime if available
if command -v asterisk &>/dev/null; then
    asterisk -rx "dialplan show" > "$OUTPUT_DIR/dialplan/dialplan_runtime.txt" 2>/dev/null || true
    info "  Captured runtime dialplan dump"
    CAPTURED=$((CAPTURED + 1))
fi

# ============================================================
# 2. SIP / PJSIP Configuration
# ============================================================
info "Capturing SIP/PJSIP configuration..."

for FILE in sip.conf sip_additional.conf sip_custom.conf sip_general_custom.conf \
            pjsip.conf pjsip_additional.conf pjsip_custom.conf \
            pjsip.endpoint.conf pjsip.aor.conf pjsip.auth.conf \
            pjsip.registration.conf pjsip.identify.conf pjsip.transports.conf; do
    if [ -f "$ASTERISK_DIR/$FILE" ]; then
        capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR/sip"
        CAPTURED=$((CAPTURED + 1))
    fi
done

# Capture SIP/PJSIP peers from runtime
if command -v asterisk &>/dev/null; then
    asterisk -rx "pjsip show endpoints" > "$OUTPUT_DIR/sip/pjsip_endpoints_runtime.txt" 2>/dev/null || true
    asterisk -rx "sip show peers" > "$OUTPUT_DIR/sip/sip_peers_runtime.txt" 2>/dev/null || true
    asterisk -rx "pjsip show registrations" > "$OUTPUT_DIR/sip/pjsip_registrations_runtime.txt" 2>/dev/null || true
fi

# ============================================================
# 3. Voicemail
# ============================================================
info "Capturing voicemail configuration..."

for FILE in voicemail.conf voicemail_additional.conf voicemail_custom.conf; do
    if [ -f "$ASTERISK_DIR/$FILE" ]; then
        capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR/voicemail"
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
    if [ -f "$ASTERISK_DIR/$FILE" ]; then
        DEST_SUBDIR="features"
        [[ "$FILE" == queues* ]] && DEST_SUBDIR="queues"
        capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR/$DEST_SUBDIR"
        CAPTURED=$((CAPTURED + 1))
    fi
done

# Capture FreePBX feature codes if fwconsole available
if command -v fwconsole &>/dev/null; then
    fwconsole setting --list > "$OUTPUT_DIR/features/freepbx_settings.txt" 2>/dev/null || true
    info "  Captured FreePBX settings"
fi

# ============================================================
# 5. Trunk configuration
# ============================================================
info "Capturing trunk configuration..."

for FILE in sip_registrations.conf iax.conf iax_additional.conf \
            pjsip.registration.conf chan_dahdi.conf; do
    if [ -f "$ASTERISK_DIR/$FILE" ]; then
        capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR/trunks"
        CAPTURED=$((CAPTURED + 1))
    fi
done

# ============================================================
# 6. Additional important configs
# ============================================================
info "Capturing additional configs..."

for FILE in manager.conf modules.conf musiconhold.conf \
            cdr.conf cdr_custom.conf cel.conf rtp.conf \
            http.conf indications.conf logger.conf; do
    if [ -f "$ASTERISK_DIR/$FILE" ]; then
        capture_file "$ASTERISK_DIR/$FILE" "$OUTPUT_DIR"
        CAPTURED=$((CAPTURED + 1))
    fi
done

# Redact manager.conf passwords specifically
if [ -f "$OUTPUT_DIR/manager.conf" ]; then
    sed -i 's/\(secret\s*=\s*\).*/\1REDACTED/' "$OUTPUT_DIR/manager.conf"
fi

# ============================================================
# 7. FreePBX module list
# ============================================================
if command -v fwconsole &>/dev/null; then
    info "Capturing FreePBX module list..."
    fwconsole ma list > "$OUTPUT_DIR/freepbx_modules.txt" 2>/dev/null || true
    CAPTURED=$((CAPTURED + 1))
fi

# ============================================================
# 8. Asterisk version and status
# ============================================================
if command -v asterisk &>/dev/null; then
    info "Capturing Asterisk version and status..."
    {
        echo "# Asterisk Status — captured $TIMESTAMP"
        echo "# ============================================"
        echo ""
        echo "## Version"
        asterisk -rx "core show version" 2>/dev/null || echo "N/A"
        echo ""
        echo "## Modules"
        asterisk -rx "module show" 2>/dev/null || echo "N/A"
        echo ""
        echo "## Channels"
        asterisk -rx "core show channels" 2>/dev/null || echo "N/A"
    } > "$OUTPUT_DIR/asterisk_status.txt"
    CAPTURED=$((CAPTURED + 1))
fi

# ============================================================
# Write metadata
# ============================================================
cat > "$OUTPUT_DIR/CAPTURE_INFO.txt" << EOF
# PBX Configuration Capture
# ============================================
# Captured: $TIMESTAMP
# Host:     $(hostname -f 2>/dev/null || hostname)
# User:     $(whoami)
# Files:    $CAPTURED
#
# IMPORTANT: Secrets have been automatically redacted.
# Patterns redacted:
#   - SIP/PJSIP passwords and secrets
#   - Registration credentials
#   - External IP addresses and hostnames
#   - Manager interface passwords
#   - Trunk authentication credentials
#
# To update, re-run:
#   sudo bash $(realpath "$0")
EOF

# ============================================================
# Summary
# ============================================================
echo ""
info "=========================================="
info "PBX config capture complete"
info "  Files captured: $CAPTURED"
info "  Output:         $OUTPUT_DIR"
info "  Secrets:        REDACTED"
info "=========================================="
echo ""
info "Next steps:"
info "  1. Review captured files in $OUTPUT_DIR"
info "  2. Verify no secrets leaked: grep -ri 'password\\|secret' $OUTPUT_DIR"
info "  3. git add infra/pbx/config/ && git commit -m 'Capture PBX config'"
echo ""
