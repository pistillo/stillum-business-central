# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
COPY . .
RUN npm run build

# ── Runtime stage ────────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Security: create non-root user
RUN addgroup -S stillum && adduser -S stillum -G stillum

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled service
COPY --from=build /app/dist ./dist

# Create temp build directory with proper permissions
RUN mkdir -p /tmp/stillum-builds && chown stillum:stillum /tmp/stillum-builds

ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV BUILD_TEMP_DIR=/tmp/stillum-builds
ENV BUILD_TIMEOUT_MS=120000
ENV BUILD_MAX_CONCURRENT=4

USER stillum
EXPOSE 8090
CMD ["node", "dist/index.js"]
