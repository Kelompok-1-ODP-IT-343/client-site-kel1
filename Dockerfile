# syntax=docker/dockerfile:1

# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install OS deps for sharp/next image optimizations if needed
RUN apk add --no-cache libc6-compat

# Copy package manifests first (better caching)
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Install deps (prefer npm since project uses package-lock)
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install --frozen-lockfile; \
    else npm install; fi

# Copy source code
COPY . .

# Build Next.js (standalone output enabled in next.config.ts)
RUN npm run build

# ---------- Runtime Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN adduser -D -u 1001 nextjs

# Copy the standalone build and public assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Use non-root user
USER nextjs

# Start Next.js
CMD ["node", "server.js"]