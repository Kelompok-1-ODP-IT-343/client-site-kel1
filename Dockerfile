# syntax=docker/dockerfile:1

# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install required system dependencies for image optimization
RUN apk add --no-cache libc6-compat

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . .

# Build Next.js app (no linting)
RUN npm run build --no-lint

# ---------- Runtime Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN adduser -D -u 1001 nextjs

# Copy build artifacts and public assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose app port
EXPOSE 3000

USER nextjs
CMD ["node", "server.js"]
