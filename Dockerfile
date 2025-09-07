# ---- Base image ----
FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- Dependencies ----
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
RUN pnpm install --frozen-lockfile

# ---- Build ----
FROM base AS builder
# Enable pnpm in this stage too
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ---- Runner ----
FROM base AS runner
WORKDIR /app
# Install curl for Coolify healthcheck
RUN apk add --no-cache curl
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Copy artifacts
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Start Next.js
CMD ["node", "server.js"]
