# ─── Build stage ────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
ARG NPM_TOKEN
ENV NPM_TOKEN=${NPM_TOKEN}
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY . .

# Variabili iniettate a build-time (baked nel bundle JS)
ARG VITE_OIDC_CLIENT_ID=portal-ui

RUN pnpm run build

# ─── Runtime stage ──────────────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
