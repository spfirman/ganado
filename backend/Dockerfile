# Ganado Backend — Production Dockerfile
# Pre-built dist/ is already available; just install deps and run.

FROM node:20-alpine

WORKDIR /app

# Version metadata build args
ARG GIT_COMMIT=dev
ARG GIT_BRANCH=unknown
ARG BUILD_TIME=unknown
ARG APP_VERSION=0.0.1
ARG DOCKER_IMAGE=unknown
ARG DOCKER_TAG=latest
ENV GIT_COMMIT=${GIT_COMMIT} GIT_BRANCH=${GIT_BRANCH} BUILD_TIME=${BUILD_TIME} APP_VERSION=${APP_VERSION} DOCKER_IMAGE=${DOCKER_IMAGE} DOCKER_TAG=${DOCKER_TAG}

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy pre-built application
COPY dist/ ./dist/

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main"]
