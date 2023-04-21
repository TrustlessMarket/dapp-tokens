FROM node:18-alpine AS base

# 1. Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat openssh git
RUN git config --global url."https://github".insteadOf ssh://git@github

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN yarn install


# 2. Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
ARG BUILD_ENV=production
ARG NODE_ENV=production

ENV NODE_ENV $NODE_ENV

COPY envs/.env.$BUILD_ENV .env
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build


FROM base AS runner
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
