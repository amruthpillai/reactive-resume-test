# ---------- Dependencies Layer ----------
FROM oven/bun:1-slim AS dependencies

RUN mkdir -p /tmp/dev
RUN mkdir -p /tmp/prod

COPY package.json bun.lock bunfig.toml /tmp/dev
COPY package.json bun.lock bunfig.toml /tmp/prod

RUN cd /tmp/dev && bun install --frozen-lockfile
RUN cd /tmp/prod && bun install --frozen-lockfile --production

# ---------- Builder Layer ----------
FROM oven/bun:1-slim AS builder

WORKDIR /app

COPY --from=dependencies /tmp/dev/node_modules ./node_modules

COPY . .

RUN bun run build

# ---------- Runtime Layer ----------
FROM oven/bun:1-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/migrations ./migrations
COPY --from=dependencies /tmp/prod/node_modules ./node_modules

USER bun
EXPOSE 3000/tcp

ENTRYPOINT ["bun", "run", "server.ts"]
