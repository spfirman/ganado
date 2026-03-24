# Ganado Web — Next.js Production Dockerfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG NEXT_PUBLIC_API_URL=""
ARG BACKEND_URL=http://ganado-backend:3000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV BACKEND_URL=$BACKEND_URL

RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "server.js"]
