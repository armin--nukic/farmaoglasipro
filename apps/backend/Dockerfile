FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm install

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build --workspace @farma/shared && npm run build --workspace @farma/backend

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/src/db/migrations ./apps/backend/dist/db/migrations
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY package.json ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/shared/package.json ./packages/shared/package.json
EXPOSE 4000 4001
CMD ["node", "apps/backend/dist/server.js"]
