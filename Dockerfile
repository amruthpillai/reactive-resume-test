# Multi-stage Dockerfile for Reactive Resume

# ---------- Dependencies Layer (Cache Efficiently) ----------
FROM oven/bun:1 AS dependencies

WORKDIR /usr/src/app

# Copy only package manifests for dependency caching
COPY package.json bun.lock bunfig.toml ./

# Install dependencies (use frozen lockfile)
RUN bun install --frozen-lockfile

# ---------- Build Layer (Minimize Context and Artifacts) ----------
FROM oven/bun:1 AS builder

WORKDIR /usr/src/app

# Re-use node_modules from dependencies layer
COPY --from=dependencies /usr/src/app/node_modules ./node_modules

# Copy only necessary app sources
COPY . .

# Build for production
RUN bun run build

# ---------- Runtime Layer (Smallest Possible) ----------
FROM oven/bun:1 AS runtime

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy ONLY production build output and migrations
COPY --from=builder /usr/src/app/.output ./.output
COPY --from=builder /usr/src/app/migrations ./migrations

# Lightweight Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

EXPOSE 3000

CMD ["bun", "run", ".output/server/index.mjs"]