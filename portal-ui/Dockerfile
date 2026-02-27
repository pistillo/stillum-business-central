# ─── Build stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

# Variabili iniettate a build-time (baked nel bundle JS)
ARG VITE_OIDC_AUTHORITY=http://localhost:8080/realms/stillum
ARG VITE_OIDC_CLIENT_ID=portal-ui
ARG VITE_REGISTRY_API_BASE_URL=http://localhost:8081/api
ARG VITE_PUBLISHER_API_BASE_URL=http://localhost:8082/api

RUN pnpm run build

# ─── Runtime stage ──────────────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
