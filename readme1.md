# FARMA OGLASI PRO - deploy i povezivanje servisa

Ovaj dokument objasnjava kako se sistem pokrece, kako su povezani frontend, backend, baza, cache, storage, realtime i notifikacije.

## Lokalni Docker deploy

Najjednostavnije:

```bash
docker compose up -d
```

Ovo pokrece:

- nginx
- frontend
- backend
- PostgreSQL
- Redis
- MinIO
- MinIO bucket init
- Socket.io kroz backend

## URL-ovi

```text
App kroz nginx:       http://localhost
Frontend direktno:    http://localhost:5173
Backend direktno:     http://localhost:4002
Backend health:       http://localhost:4002/health
Socket.io host:       http://localhost:4003
PostgreSQL host:      localhost:5433
Redis host:           localhost:6380
MinIO API:            http://localhost:9000
MinIO console:        http://localhost:9001
```

Unutar Docker mreze servisi komuniciraju ovako:

```text
frontend -> nginx -> backend:4000
backend -> postgres:5432
backend -> redis:6379
backend -> minio:9000
browser -> nginx -> frontend
browser -> nginx -> /api -> backend
browser -> nginx -> /socket.io -> backend Socket.io
```

## Env varijable

Kopiraj primjer:

```bash
cp .env.example .env
```

Najbitnije varijable:

```env
APP_URL=http://localhost
DATABASE_URL=postgres://farma:farma_password@postgres:5432/farma_oglasi
REDIS_URL=redis://redis:6379
JWT_SECRET=change-me-in-production
JWT_REFRESH_SECRET=change-me-too-in-production
S3_ENDPOINT=http://minio:9000
S3_BUCKET=farma-media
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Kako radi deploy u Dockeru

1. Docker build napravi frontend image.
2. Frontend se builda u static fajlove.
3. Frontend container koristi nginx i servira static build.
4. Backend image builda TypeScript u JavaScript.
5. Backend container prvo pokrece migracije.
6. Backend zatim pokrece seed demo podataka.
7. Backend starta Express API na `4000`.
8. Backend starta Socket.io server na `4001`.
9. Glavni nginx container routa sav web saobracaj.

Backend command:

```text
node apps/backend/dist/db/migrate.js &&
node apps/backend/dist/db/seed.js &&
node apps/backend/dist/server.js
```

## Nginx routing

Fajl:

```text
infrastructure/nginx/nginx.conf
```

Rute:

```text
/           -> frontend
/api/       -> backend
/health     -> backend
/socket.io/ -> backend realtime server
```

## Database migracije

Migracije su u:

```text
apps/backend/src/db/migrations
```

Rucno:

```bash
npm run db:migrate
```

Seed:

```bash
npm run db:seed
```

Seed kreira:

- 1 super admin
- 5 admina
- 50 korisnika
- 20 veterinara
- 10 veterinarskih stanica
- 100 zivotinja
- 300 oglasa
- 100 recenzija
- 50 farmi

## Login i registracija

Frontend:

```text
/login
/register
```

Backend:

```text
POST /api/auth/login
POST /api/auth/register
```

Demo super admin:

```text
superadmin@farmaoglasi.pro
Password123!
```

Frontend cuva:

```text
farma:token
farma:refresh
farma:user
```

u `localStorage`.

## Google SSO

Google SSO ruta:

```text
POST /api/auth/google
```

Da radi:

1. Otvori Google Cloud Console.
2. Kreiraj OAuth Client ID tipa Web application.
3. Dodaj authorized JavaScript origins:

```text
http://localhost
http://localhost:5173
https://tvoj-domen.com
```

4. Dodaj u `.env`:

```env
GOOGLE_CLIENT_ID=client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=client-id.apps.googleusercontent.com
```

5. Rebuild:

```bash
docker compose build frontend backend
docker compose up -d
```

Kako radi:

- Google vrati ID token frontend aplikaciji.
- Frontend posalje token backendu.
- Backend validira token preko Google tokeninfo endpointa.
- Backend napravi ili azurira korisnika.
- Backend vrati JWT tokene.

## Notifikacije

Notifikacije su dizajnirane kroz dva sloja:

1. Trajna notifikacija u PostgreSQL tabeli `notifications`.
2. Realtime push kroz Socket.io.

Tabela:

```text
notifications
```

Socket event:

```text
notification:subscribe
```

Tipican flow:

1. Korisnik se loginuje.
2. Frontend otvori Socket.io konekciju prema `VITE_SOCKET_URL`.
3. Frontend posalje `notification:subscribe` sa ID korisnika.
4. Backend stavi socket u sobu `user:{userId}`.
5. Kada se desi akcija, backend upise notifikaciju u bazu.
6. Backend emituje realtime event u korisnicku sobu.

Primjeri akcija koje mogu slati notifikacije:

- nova poruka
- novi bid na aukciji
- pobjeda na aukciji
- potvrda termina
- podsjetnik za vakcinu
- listing istice uskoro
- admin odobrio/verifikovao profil

Email/SMS/push:

- email provider: Resend, SendGrid ili AWS SES
- SMS provider: Twilio ili lokalni SMS gateway
- push: Web Push VAPID ili Firebase Cloud Messaging

## Night mode

Night mode je frontend-only funkcija.

Fajl:

```text
apps/frontend/src/theme.tsx
```

Radi preko:

```text
localStorage key: farma:theme
html class: dark
Tailwind dark: klase
```

## Bosanski/Engleski

Prevodi:

```text
packages/shared/src/locales.ts
```

Header prikazuje `BS` ili `EN` uz ikonu globusa.

## Ikone

Ikone se koriste iz:

```text
lucide-react
```

Primjeri:

- `Globe2` za jezik
- `Moon` i `Sun` za night mode
- `LogIn` i `LogOut` za auth
- `Bell` za notifikacije
- `Heart` za favorite
- `Stethoscope` za veterinare
- `Gavel` za aukcije

## Production deploy napomena

Za produkciju obavezno:

- promijeni JWT secret
- koristi managed PostgreSQL
- koristi managed Redis
- koristi pravi S3 bucket
- ukljuci HTTPS
- postavi realan domen u Google OAuth
- postavi backup baze
- ukljuci monitoring i logove

