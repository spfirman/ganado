# Ganado Frontend — Production Dockerfile
# Serves pre-built Flutter web app via nginx, proxies /api/ to backend.

FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Flutter web app static files (excluding canvaskit — HTML renderer is used)
COPY index.html favicon.png flutter.js flutter_bootstrap.js flutter_service_worker.js \
     manifest.json version.json 50x.html .last_build_id \
     /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY icons/ /usr/share/nginx/html/icons/
COPY main.dart.js /usr/share/nginx/html/
COPY i18n-overlay.js /usr/share/nginx/html/

# Pre-compress large assets for gzip_static (serves .gz directly, no CPU cost)
RUN apk add --no-cache gzip \
    && gzip -k -9 /usr/share/nginx/html/main.dart.js \
    && gzip -k -9 /usr/share/nginx/html/flutter_bootstrap.js

# Copy entrypoint script
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
