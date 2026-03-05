# Ganado Frontend — Production Dockerfile
# Serves pre-built Flutter web app via nginx, proxies /api/ to backend.

FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Flutter web app static files
COPY index.html favicon.png flutter.js flutter_bootstrap.js flutter_service_worker.js \
     manifest.json version.json 50x.html .last_build_id \
     /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY canvaskit/ /usr/share/nginx/html/canvaskit/
COPY icons/ /usr/share/nginx/html/icons/
COPY main.dart.js /usr/share/nginx/html/

# Copy entrypoint script
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
