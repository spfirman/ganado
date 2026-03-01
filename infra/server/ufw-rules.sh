#!/bin/bash
# ============================================================
# GPCB — UFW Firewall Rules
# ============================================================
# Configures firewall for a server running:
#   - Docker (Ganado app, ChirpStack)
#   - Asterisk/FreePBX (SIP, RTP)
#   - PostgreSQL (local only)
#   - NGINX reverse proxy (HTTP/S)
#   - SSH (rate-limited)
#
# Usage:
#   sudo bash ufw-rules.sh [--apply]
#
# Without --apply, rules are displayed but not applied.
# ============================================================

set -euo pipefail

APPLY=false

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
        --apply) APPLY=true; shift ;;
        *)       shift ;;
    esac
done

# ============================================================
# Pre-flight
# ============================================================
if [ "$(id -u)" -ne 0 ]; then
    error "This script must be run as root (sudo)"
    exit 1
fi

if ! command -v ufw &>/dev/null; then
    error "UFW is not installed. Install with: sudo apt install ufw"
    exit 1
fi

info "GPCB — Firewall Configuration"
echo ""

# ============================================================
# Display planned rules
# ============================================================
echo -e "${CYAN}Planned firewall rules:${NC}"
echo ""
echo "  Default policy: deny incoming, allow outgoing"
echo ""
echo "  SSH (22/tcp)              — rate-limited (6 attempts/30s)"
echo "  HTTP (80/tcp)             — allow (NGINX → certbot + redirect)"
echo "  HTTPS (443/tcp)           — allow (NGINX → Ganado app)"
echo "  SIP (5060/tcp,udp)        — allow (Asterisk signaling)"
echo "  SIP-TLS (5061/tcp)        — allow (Asterisk secure signaling)"
echo "  RTP (10000-20000/udp)     — allow (Asterisk media)"
echo "  IAX2 (4569/udp)           — allow (Asterisk inter-PBX)"
echo "  ChirpStack GW (1700/udp)  — allow (LoRaWAN gateway)"
echo "  MQTT (1884/tcp)           — allow (ChirpStack MQTT)"
echo ""
echo "  Internal only (not exposed):"
echo "  PostgreSQL (5432)         — localhost only (via pg_hba.conf)"
echo "  Redis (6380)              — localhost/Docker only"
echo "  Ganado backend (3100)     — proxied via NGINX"
echo "  Ganado frontend (8180)    — proxied via NGINX"
echo ""

if [ "$APPLY" != true ]; then
    warn "Dry run — pass --apply to apply these rules"
    warn "  sudo bash $(basename "$0") --apply"
    exit 0
fi

# ============================================================
# Apply rules
# ============================================================
info "Applying firewall rules..."

# Reset to clean state
ufw --force reset

# Default policies
ufw default deny incoming
ufw default allow outgoing

# --- SSH with rate limiting ---
# Limits to 6 connection attempts within 30 seconds
ufw limit 22/tcp comment "SSH rate-limited"

# --- Web traffic ---
ufw allow 80/tcp comment "HTTP (NGINX/certbot)"
ufw allow 443/tcp comment "HTTPS (NGINX → Ganado)"

# --- SIP signaling ---
ufw allow 5060/tcp comment "SIP TCP (Asterisk)"
ufw allow 5060/udp comment "SIP UDP (Asterisk)"
ufw allow 5061/tcp comment "SIP-TLS (Asterisk)"

# --- RTP media ---
ufw allow 10000:20000/udp comment "RTP media (Asterisk)"

# --- IAX2 (inter-Asterisk) ---
ufw allow 4569/udp comment "IAX2 (Asterisk)"

# --- ChirpStack LoRaWAN gateway ---
ufw allow 1700/udp comment "ChirpStack GW (LoRaWAN)"

# --- MQTT for ChirpStack ---
ufw allow 1884/tcp comment "ChirpStack MQTT"

# ============================================================
# Docker compatibility
# ============================================================
# Docker manages its own iptables rules and bypasses UFW by default.
# To make UFW work with Docker, you may need to add to /etc/docker/daemon.json:
#   { "iptables": false }
# Or use DOCKER-USER chain. See: https://docs.docker.com/network/packet-filtering-firewalls/

info "Note: Docker manages its own iptables rules."
info "Internal Docker ports (5432, 6380, 3100, 8180) are not"
info "exposed to the host and don't need UFW rules."

# ============================================================
# Enable UFW
# ============================================================
ufw --force enable

echo ""
info "Firewall rules applied:"
ufw status verbose
echo ""
info "Firewall configuration complete."
