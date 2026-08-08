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
# --ingroup is load-bearing: without it, busybox adduser drops the user into
# `nogroup` (gid 65533) rather than the nodejs group just created, so the
# runtime uid/gid ends up 1001:65533 and does not match anything chowned to
# nextjs:nodejs.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# public/uploads is gitignored, so it does not exist in the build context and
# the COPY above cannot create it. Docker then creates the mount target for
# the `uploads` named volume itself, owned by root, and the app (uid 1001)
# gets EACCES on every single upload — which is exactly what happened in
# production: writes failed with "EACCES: permission denied, open
# '/app/public/uploads/blog/<uuid>.jpg'" for every format, not just webp.
# Creating it here means Docker seeds a *fresh* volume from this directory and
# inherits this ownership. This only helps an empty volume: Docker never
# re-applies image ownership to a volume that already has content, so an
# already-broken volume has to be chown'd separately.
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]