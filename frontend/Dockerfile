# ══════════════════════════════════════════════════════════════════════
#  React (Vite) Multi-Stage Dockerfile
#  Stage 1: Node 20 builds the static production bundle.
#  Stage 2: Nginx Alpine serves it on port 80.
# ══════════════════════════════════════════════════════════════════════

# ── Stage 1: Build ────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies (uses package-lock.json for reproducible builds)
COPY package*.json ./
RUN npm ci --silent

# Inject the API Gateway URL at build time.
# In Docker, the browser on the host machine reaches the api-gateway
# via its published host port (8080), so localhost:8080 is correct.
ARG VITE_API_BASE_URL=http://localhost:8080
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy all source files and build
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────────────────────
FROM nginx:alpine

# Copy the built static files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom nginx config (handles React SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
