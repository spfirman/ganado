#!/bin/sh
set -e

# Generate runtime environment config for Flutter web app
cat > /usr/share/nginx/html/env-config.js <<EOF
window.ENV = {
  API_BASE_URL: "${API_BASE_URL:-}",
  FORCE_WEB_CACHE_CLEANUP: "${FORCE_WEB_CACHE_CLEANUP:-false}"
};
EOF

echo "Generated env-config.js with API_BASE_URL=${API_BASE_URL:-}"

exec nginx -g 'daemon off;'
