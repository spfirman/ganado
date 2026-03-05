# Ganado Backend — Production Dockerfile
# Pre-built dist/ is already available; just install deps and run.

FROM node:20-alpine

WORKDIR /app

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
