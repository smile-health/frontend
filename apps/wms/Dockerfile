FROM node:18-alpine3.19 AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat && rm -rf /var/cache/apk/*
# Set working directory
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune wms --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat && rm -rf /var/cache/apk/*
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm install

# Build the project
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
ENV TURBO_API=http://dev.badr.co.id:12000
ENV TURBO_TEAM=wms

# ARG TURBO_TOKEN

RUN npx turbo build --filter=wms

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN apk update && apk add --no-cache jq && rm -rf /var/cache/apk/*
RUN addgroup --system --gid 1002 nodejs
RUN adduser --system --uid 1002 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/wms/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/wms/.next/static ./apps/wms/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/wms/public ./apps/wms/public

CMD node apps/wms/server.js