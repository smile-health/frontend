FROM node:18-alpine3.19 AS base

FROM base AS builder
RUN apk update && apk add --no-cache gcompat=1.1.0-r4 && rm -rf /var/cache/apk/*
WORKDIR /app
RUN npm install -g turbo@2.5.6
COPY . .
RUN turbo prune storybook --docker

FROM base AS installer
RUN apk update && apk add --no-cache gcompat=1.1.0-r4 && rm -rf /var/cache/apk/*
WORKDIR /app

# Install dependencies
COPY --from=builder /app/out/json/ .
RUN npm install

# Copy source code
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
ENV TURBO_TEAM=storybook

# Build Storybook
RUN npx turbo build --filter=storybook

FROM base AS runner
WORKDIR /app

# Add non-root user
RUN npm install -g http-server@14.1.1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 storybook
USER storybook

# Copy built Storybook files
COPY --from=installer --chown=storybook:nodejs /app/apps/storybook/storybook-static ./storybook-static

# Expose default Storybook port
EXPOSE 6006

# Start http-server
CMD ["http-server", "storybook-static", "-p", "3000"]