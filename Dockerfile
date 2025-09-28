# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Build arguments for memory optimization
ARG LOW_MEMORY=false
ARG NODE_OPTIONS="--max-old-space-size=512"

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./

# Configure npm with conditional memory optimizations
RUN if [ "$LOW_MEMORY" = "true" ]; then \
  npm config set fetch-retry-mintimeout 30000 && \
  npm config set fetch-retry-maxtimeout 180000 && \
  npm config set fetch-timeout 900000 && \
  npm config set maxsockets 1; \
  else \
  npm config set fetch-retry-mintimeout 20000 && \
  npm config set fetch-retry-maxtimeout 120000 && \
  npm config set fetch-timeout 600000 && \
  npm config set maxsockets 1; \
  fi

# Install dependencies with memory optimizations
RUN npm ci --omit=dev --prefer-offline --no-audit --no-fund --maxsockets=1 --loglevel=error


# Rebuild the source code only when needed
FROM base AS builder

# Pass build arguments to this stage
ARG LOW_MEMORY=false
ARG NODE_OPTIONS="--max-old-space-size=512"

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Disable telemetry to save memory and build time
ENV NEXT_TELEMETRY_DISABLED=1

# Set Node.js memory limits conditionally
ENV NODE_OPTIONS=${NODE_OPTIONS}

# Set additional environment variables for low memory builds
RUN if [ "$LOW_MEMORY" = "true" ]; then \
  export npm_config_cache=/tmp/.npm && \
  export npm_config_progress=false && \
  export CI=true && \
  rm -rf .git .gitignore README.md docs/ *.md 2>/dev/null || true; \
  fi

# Build with memory constraints and monitoring
RUN if [ "$LOW_MEMORY" = "true" ]; then \
  echo "Memory before build:" && free -h 2>/dev/null || echo "Memory info not available" && \
  export NODE_OPTIONS="--max-old-space-size=100 --optimize-for-size --gc-interval=100" && \
  export NEXT_TELEMETRY_DISABLED=1 && \
  echo "Using NODE_OPTIONS for low memory: $NODE_OPTIONS"; \
  else \
  export NODE_OPTIONS="${NODE_OPTIONS:-"--max-old-space-size=512"}" && \
  echo "Using NODE_OPTIONS for normal memory: $NODE_OPTIONS"; \
  fi && \
  npm run build && \
  if [ "$LOW_MEMORY" = "true" ]; then \
  echo "Memory after build:" && free -h 2>/dev/null || echo "Memory info not available"; \
  fi

# Production image, copy all the files and run next
FROM base AS runner

# Pass build arguments to final stage
ARG LOW_MEMORY=false

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Set runtime memory limits conditionally
ENV NODE_OPTIONS="${LOW_MEMORY:+--max-old-space-size=128}"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["node", "server.js"]