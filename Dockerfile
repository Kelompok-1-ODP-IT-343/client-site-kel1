# syntax=docker/dockerfile:1

# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install required system dependencies for image optimization
RUN apk add --no-cache libc6-compat

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NEXT_DISABLE_ESLINT=1
ENV NEXT_TELEMETRY_DISABLED=1

# Copy all source code
COPY . .

# Build Next.js app (no linting)
RUN NEXT_DISABLE_ESLINT=1 npm run build

# ---------- Runtime Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV NEXT_DISABLE_ESLINT=1

# Create non-root user for security
RUN adduser -D -u 1001 nextjs

# Copy build artifacts and public assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose app port
EXPOSE 3000

USER nextjs
CMD ["node", "server.js", "-H", "0.0.0.0", "-p", "3000"]
