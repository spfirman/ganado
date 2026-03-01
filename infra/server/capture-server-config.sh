#!/bin/bash
# ============================================================
# GPCB — Capture Server Configuration
# ============================================================
# Snapshots the current server state for documentation and
# disaster recovery: firewall, SSH, sysctl, packages, Docker.
#
# Usage:
#   sudo bash capture-server-config.sh
#   sudo bash capture-server-config.sh --output-dir /path/to/output
#
# IMPORTANT: Run with sudo for full access to system configs.
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="${SCRIPT_DIR}/captured"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
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
info "GPCB — Server Configuration Capture"
info "Output directory: $OUTPUT_DIR"
echo ""

if [ "$(id -u)" -ne 0 ]; then
    warn "Running without root — some captures may be incomplete"
fi

mkdir -p "$OUTPUT_DIR"

CAPTURED=0

# ============================================================
# 1. System Information
# ============================================================
info "Capturing system information..."

{
    echo "# Server Information — captured $TIMESTAMP"
    echo "# ============================================"
    echo ""
    echo "## Hostname"
    hostname -f 2>/dev/null || hostname
    echo ""
    echo "## OS Release"
    cat /etc/os-release 2>/dev/null || echo "N/A"
    echo ""
    echo "## Kernel"
    uname -a
    echo ""
    echo "## Uptime"
    uptime
    echo ""
    echo "## CPU"
    lscpu 2>/dev/null | grep -E "^(Architecture|CPU\(s\)|Model name|CPU MHz)" || echo "N/A"
    echo ""
    echo "## Memory"
    free -h
    echo ""
    echo "## Disk"
    df -h
    echo ""
    echo "## Block Devices"
    lsblk 2>/dev/null || echo "N/A"
} > "$OUTPUT_DIR/system-info.txt"
CAPTURED=$((CAPTURED + 1))
info "  system-info.txt"

# ============================================================
# 2. Firewall (UFW)
# ============================================================
info "Capturing firewall configuration..."

if command -v ufw &>/dev/null; then
    {
        echo "# UFW Firewall Status — captured $TIMESTAMP"
        echo "# ============================================"
        echo ""
        echo "## Status"
        ufw status verbose 2>/dev/null || echo "Unable to read UFW status"
        echo ""
        echo "## Numbered Rules"
        ufw status numbered 2>/dev/null || echo "N/A"
    } > "$OUTPUT_DIR/ufw-status.txt"
    CAPTURED=$((CAPTURED + 1))
    info "  ufw-status.txt"
fi

if command -v iptables &>/dev/null; then
    iptables -L -n -v > "$OUTPUT_DIR/iptables.txt" 2>/dev/null || true
    CAPTURED=$((CAPTURED + 1))
    info "  iptables.txt"
fi

# ============================================================
# 3. SSH Configuration
# ============================================================
info "Capturing SSH configuration..."

if [ -f /etc/ssh/sshd_config ]; then
    # Copy the effective config (with includes resolved where possible)
    cp /etc/ssh/sshd_config "$OUTPUT_DIR/sshd_config.current"
    CAPTURED=$((CAPTURED + 1))
    info "  sshd_config.current"
fi

# Capture SSH authorized keys (usernames only, not the actual keys)
{
    echo "# SSH Authorized Keys Summary — captured $TIMESTAMP"
    echo "# ============================================"
    for USER_HOME in /home/*/; do
        USERNAME=$(basename "$USER_HOME")
        AUTH_FILE="$USER_HOME/.ssh/authorized_keys"
        if [ -f "$AUTH_FILE" ]; then
            KEY_COUNT=$(grep -c "^ssh-" "$AUTH_FILE" 2>/dev/null || echo "0")
            echo "$USERNAME: $KEY_COUNT key(s)"
        fi
    done
    # Root
    if [ -f /root/.ssh/authorized_keys ]; then
        KEY_COUNT=$(grep -c "^ssh-" /root/.ssh/authorized_keys 2>/dev/null || echo "0")
        echo "root: $KEY_COUNT key(s)"
    fi
} > "$OUTPUT_DIR/ssh-keys-summary.txt"
CAPTURED=$((CAPTURED + 1))
info "  ssh-keys-summary.txt"

# ============================================================
# 4. Sysctl (Kernel Parameters)
# ============================================================
info "Capturing sysctl settings..."

sysctl -a > "$OUTPUT_DIR/sysctl-all.txt" 2>/dev/null || true
CAPTURED=$((CAPTURED + 1))
info "  sysctl-all.txt"

# Capture custom sysctl files
if [ -d /etc/sysctl.d ]; then
    mkdir -p "$OUTPUT_DIR/sysctl.d"
    cp /etc/sysctl.d/*.conf "$OUTPUT_DIR/sysctl.d/" 2>/dev/null || true
    info "  sysctl.d/*.conf"
fi

# ============================================================
# 5. Installed Packages
# ============================================================
info "Capturing installed packages..."

if command -v dpkg &>/dev/null; then
    dpkg --get-selections > "$OUTPUT_DIR/packages-dpkg.txt" 2>/dev/null || true
    CAPTURED=$((CAPTURED + 1))
    info "  packages-dpkg.txt"
fi

if command -v apt &>/dev/null; then
    apt list --installed > "$OUTPUT_DIR/packages-apt.txt" 2>/dev/null || true
    info "  packages-apt.txt"
fi

# Capture package repositories
if [ -d /etc/apt/sources.list.d ]; then
    mkdir -p "$OUTPUT_DIR/apt-sources"
    cp /etc/apt/sources.list "$OUTPUT_DIR/apt-sources/" 2>/dev/null || true
    cp /etc/apt/sources.list.d/*.list "$OUTPUT_DIR/apt-sources/" 2>/dev/null || true
    cp /etc/apt/sources.list.d/*.sources "$OUTPUT_DIR/apt-sources/" 2>/dev/null || true
    info "  apt-sources/"
fi

# ============================================================
# 6. Docker State
# ============================================================
info "Capturing Docker state..."

if command -v docker &>/dev/null; then
    {
        echo "# Docker State — captured $TIMESTAMP"
        echo "# ============================================"
        echo ""
        echo "## Docker Version"
        docker version 2>/dev/null || echo "N/A"
        echo ""
        echo "## Docker Info"
        docker info 2>/dev/null || echo "N/A"
        echo ""
        echo "## Running Containers"
        docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "N/A"
        echo ""
        echo "## All Containers"
        docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.CreatedAt}}" 2>/dev/null || echo "N/A"
        echo ""
        echo "## Docker Networks"
        docker network ls 2>/dev/null || echo "N/A"
        echo ""
        echo "## Docker Volumes"
        docker volume ls 2>/dev/null || echo "N/A"
        echo ""
        echo "## Docker Images"
        docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" 2>/dev/null || echo "N/A"
        echo ""
        echo "## Disk Usage"
        docker system df 2>/dev/null || echo "N/A"
    } > "$OUTPUT_DIR/docker-state.txt"
    CAPTURED=$((CAPTURED + 1))
    info "  docker-state.txt"

    # Capture compose files for all running projects
    docker compose ls --format json 2>/dev/null | while read -r LINE; do
        PROJECT=$(echo "$LINE" | grep -oP '"Name":"\K[^"]+' 2>/dev/null || true)
        CONFIG=$(echo "$LINE" | grep -oP '"ConfigFiles":"\K[^"]+' 2>/dev/null || true)
        if [ -n "$PROJECT" ] && [ -n "$CONFIG" ]; then
            info "    Compose project: $PROJECT → $CONFIG"
        fi
    done
fi

# ============================================================
# 7. Systemd Services (custom/active)
# ============================================================
info "Capturing systemd services..."

{
    echo "# Active Services — captured $TIMESTAMP"
    echo "# ============================================"
    systemctl list-units --type=service --state=running --no-pager 2>/dev/null || echo "N/A"
    echo ""
    echo "## Enabled Timers"
    systemctl list-timers --no-pager 2>/dev/null || echo "N/A"
    echo ""
    echo "## Failed Units"
    systemctl --failed --no-pager 2>/dev/null || echo "N/A"
} > "$OUTPUT_DIR/systemd-services.txt"
CAPTURED=$((CAPTURED + 1))
info "  systemd-services.txt"

# ============================================================
# 8. Crontab entries
# ============================================================
info "Capturing crontab entries..."

{
    echo "# Crontab Entries — captured $TIMESTAMP"
    echo "# ============================================"
    echo ""
    echo "## Root crontab"
    crontab -l 2>/dev/null || echo "(empty)"
    echo ""
    echo "## System cron directories"
    for DIR in /etc/cron.d /etc/cron.daily /etc/cron.weekly /etc/cron.monthly; do
        if [ -d "$DIR" ]; then
            echo "## $DIR"
            ls -la "$DIR" 2>/dev/null
            echo ""
        fi
    done
} > "$OUTPUT_DIR/crontabs.txt"
CAPTURED=$((CAPTURED + 1))
info "  crontabs.txt"

# ============================================================
# 9. Network Configuration
# ============================================================
info "Capturing network configuration..."

{
    echo "# Network Configuration — captured $TIMESTAMP"
    echo "# ============================================"
    echo ""
    echo "## IP Addresses"
    ip addr show 2>/dev/null || ifconfig 2>/dev/null || echo "N/A"
    echo ""
    echo "## Routes"
    ip route show 2>/dev/null || route -n 2>/dev/null || echo "N/A"
    echo ""
    echo "## DNS"
    cat /etc/resolv.conf 2>/dev/null || echo "N/A"
    echo ""
    echo "## Listening Ports"
    ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null || echo "N/A"
} > "$OUTPUT_DIR/network.txt"
CAPTURED=$((CAPTURED + 1))
info "  network.txt"

# ============================================================
# 10. PostgreSQL Configuration
# ============================================================
info "Capturing PostgreSQL configuration..."

if command -v psql &>/dev/null; then
    {
        echo "# PostgreSQL Configuration — captured $TIMESTAMP"
        echo "# ============================================"
        echo ""
        echo "## Version"
        psql --version 2>/dev/null || echo "N/A"
        echo ""
        echo "## Databases"
        sudo -u postgres psql -l 2>/dev/null || echo "N/A"
        echo ""
        echo "## Key Settings"
        sudo -u postgres psql -c "SHOW ALL;" 2>/dev/null | grep -E "(max_connections|shared_buffers|work_mem|effective_cache_size|maintenance_work_mem|wal_buffers|checkpoint)" || echo "N/A"
    } > "$OUTPUT_DIR/postgresql.txt" 2>/dev/null || true
    CAPTURED=$((CAPTURED + 1))
    info "  postgresql.txt"

    # Copy pg_hba.conf if accessible
    PG_HBA=$(find /etc/postgresql -name "pg_hba.conf" 2>/dev/null | head -1)
    if [ -n "$PG_HBA" ] && [ -f "$PG_HBA" ]; then
        cp "$PG_HBA" "$OUTPUT_DIR/pg_hba.conf"
        info "  pg_hba.conf"
    fi
fi

# ============================================================
# Write metadata
# ============================================================
cat > "$OUTPUT_DIR/CAPTURE_INFO.txt" << EOF
# Server Configuration Capture
# ============================================
# Captured: $TIMESTAMP
# Host:     $(hostname -f 2>/dev/null || hostname)
# User:     $(whoami)
# Files:    $CAPTURED
#
# To update, re-run:
#   sudo bash $(realpath "$0")
EOF

# ============================================================
# Summary
# ============================================================
echo ""
info "=========================================="
info "Server config capture complete"
info "  Files captured: $CAPTURED"
info "  Output:         $OUTPUT_DIR"
info "=========================================="
echo ""
info "Next steps:"
info "  1. Review captured files in $OUTPUT_DIR"
info "  2. git add infra/server/captured/ && git commit -m 'Capture server config'"
echo ""
