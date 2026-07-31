# Node 22, not 20: jsdom@30 -> undici@8.9.0 requires >=22.19.0, and
# isomorphic-dompurify@3.20 requires ^22.22.2. On Node 20 the build dies in
# "Collecting page data" with `webidl.util.markAsUncloneable is not a
# function` — markAsUncloneable landed in Node 22. Applies to the runner
# stage too, since the standalone bundle ships undici and would otherwise
# fail at request time rather than at build time.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM builder AS migrator
CMD ["npx", "prisma", "db", "push"]

FROM builder AS seeder
CMD ["npx", "prisma", "db", "seed"]

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]