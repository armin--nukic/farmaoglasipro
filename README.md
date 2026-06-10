# FARMA OGLASI PRO

Production-ready monorepo foundation for a bilingual livestock, farming, veterinary, auction and farm real-estate marketplace for Bosnia and Herzegovina.

## Stack

- Frontend: React 19, TypeScript, Vite, TailwindCSS, Shadcn-style UI, React Query, React Router
- Backend: Node.js, Express.js, TypeScript
- Data: PostgreSQL, Redis
- Storage: S3 compatible storage via MinIO
- Realtime: Socket.io
- Maps: OpenStreetMap-ready latitude/longitude model and UI map panel
- Deployment: Docker, Docker Compose, nginx

## Apps

- `apps/frontend`: bilingual marketplace UI with listings, farms, vets, stations, auctions, appointments, messaging and admin screens
- `apps/backend`: Express API with auth, listing, catalog, appointment, admin, AI-helper, cache, S3 and realtime modules
- `packages/shared`: shared types, constants, translations and Zod schemas

## Quick Start

```bash
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Frontend runs on `http://localhost:5173`, API on `http://localhost:4000`, Socket.io on `http://localhost:4001`.

## Docker

```bash
cp .env.example .env
docker compose up -d
```

Open `http://localhost`. Docker starts:

- `frontend`
- `backend`
- `postgres`
- `redis`
- `nginx`
- `minio`
- Socket.io through the backend container on port `4001`

Default Docker host ports avoid common local conflicts:

- nginx app: `http://localhost`
- frontend container: `http://localhost:5173`
- backend API: `http://localhost:4002`
- Socket.io: `http://localhost:4003`
- PostgreSQL: `localhost:5433`
- Redis: `localhost:6380`

MinIO console: `http://localhost:9001`.

## Demo Login

Seeded users use password:

```text
Password123!
```

Super admin:

```text
superadmin@farmaoglasi.pro
```

Seed data includes 1 super admin, 5 admins, 50 users, 20 veterinarians, 10 veterinary stations, 100 animals, 300 listings, 100 reviews and 50 farms.

## Database

Migrations live in `apps/backend/src/db/migrations`.

```bash
npm run db:migrate
npm run db:seed
```

The schema includes users, roles through user role enum values, farms, animals, animal health records, veterinarians, veterinary stations, appointments, listings, favorites, conversations, messages, notifications, reviews, auctions, bids, subscriptions, payments, reports, audit logs and settings.

## Tests

```bash
npm run typecheck
npm test
npm run build
```

CI runs typecheck, tests, build and Docker build through GitHub Actions.

## Production Notes

Before production:

- Replace all secrets in `.env`.
- Configure real S3 bucket policy and CDN URLs.
- Configure Stripe, PayPal and Monri webhooks.
- Add SMS, email and push providers.
- Add real OpenStreetMap rendering with Leaflet or MapLibre if interactive tiles are required.
- Restrict admin routes behind hardened RBAC and audit policies.
