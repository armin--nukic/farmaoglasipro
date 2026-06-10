# Free deploy - kako podici FARMA OGLASI PRO pod domenom

Ovaj vodič je za demo deploy koji kosta 0 KM ili minimalno, cisto da vidis kako aplikacija radi pod pravim domenom.

## Vazna realnost

Kompletan sistem ima:

- frontend
- backend
- PostgreSQL
- Redis
- S3 storage
- Socket.io
- nginx

Besplatni hosting rijetko daje sve ovo na jednom mjestu. Najbolji free-demo pristup je:

- frontend na Vercel ili Netlify
- backend na Render, Fly.io ili Railway free/trial
- PostgreSQL na Neon ili Supabase
- Redis na Upstash
- S3 na Cloudflare R2 ili MinIO na VPS-u
- domen preko Cloudflare DNS

## Opcija A - najlaksi free demo

Preporuka:

```text
Frontend: Vercel
Backend: Render
Database: Neon
Redis: Upstash
Storage: Cloudflare R2
DNS: Cloudflare
```

### 1. Kupi ili koristi domen

Primjer:

```text
farmaoglasi.ba
farmaoglasi.pro
demo-farma.com
```

Ako nemas domen, koristi free subdomene:

```text
Vercel: farma-oglasi-pro.vercel.app
Render: farma-api.onrender.com
```

### 2. Postavi PostgreSQL na Neon

1. Otvori Neon.
2. Kreiraj projekat.
3. Kopiraj connection string.
4. Dobijes nesto ovako:

```env
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### 3. Postavi Redis na Upstash

1. Otvori Upstash.
2. Kreiraj Redis database.
3. Kopiraj Redis URL.

```env
REDIS_URL=rediss://default:password@host.upstash.io:6379
```

### 4. Postavi storage na Cloudflare R2

1. Otvori Cloudflare dashboard.
2. Napravi R2 bucket, npr. `farma-media`.
3. Kreiraj API token.
4. Upisi:

```env
S3_ENDPOINT=https://account-id.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=farma-media
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_PUBLIC_URL=https://media.tvoj-domen.com
```

### 5. Deploy backend na Render

Render Web Service:

```text
Build command:
npm install && npm run build --workspace @farma/shared && npm run build --workspace @farma/backend

Start command:
node apps/backend/dist/db/migrate.js && node apps/backend/dist/db/seed.js && node apps/backend/dist/server.js
```

Environment:

```env
NODE_ENV=production
APP_URL=https://tvoj-frontend.vercel.app
PORT=10000
SOCKET_PORT=10001
DATABASE_URL=...
REDIS_URL=...
JWT_SECRET=dug-random-secret
JWT_REFRESH_SECRET=drugi-dug-random-secret
S3_ENDPOINT=...
S3_REGION=auto
S3_BUCKET=farma-media
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_PUBLIC_URL=...
GOOGLE_CLIENT_ID=...
```

Napomena:

Render obicno izlozi samo jedan web port. Ako zelis Socket.io na istom servisu, bolje je u produkciji spojiti Socket.io na isti HTTP server kao Express ili koristiti drugi Render service. Trenutni projekat drzi API na `PORT`, a Socket.io na `SOCKET_PORT`, sto je super za Docker, ali za neke free hostove treba mala prilagodba.

### 6. Deploy frontend na Vercel

Vercel postavke:

```text
Framework: Vite
Root directory: apps/frontend
Build command: cd ../.. && npm install && npm run build --workspace @farma/shared && npm run build --workspace @farma/frontend
Output directory: apps/frontend/dist
```

Environment:

```env
VITE_API_URL=https://tvoj-backend.onrender.com/api
VITE_SOCKET_URL=https://tvoj-backend-socket.onrender.com
VITE_GOOGLE_CLIENT_ID=...
```

### 7. Domen

U Cloudflare DNS dodaj:

```text
app.tvoj-domen.com   CNAME   cname.vercel-dns.com
api.tvoj-domen.com   CNAME   tvoj-backend.onrender.com
```

U Vercel dodaj custom domain:

```text
app.tvoj-domen.com
```

U Render dodaj custom domain:

```text
api.tvoj-domen.com
```

### 8. Google SSO domeni

U Google Cloud Console dodaj:

Authorized JavaScript origins:

```text
https://app.tvoj-domen.com
```

Authorized redirect URIs nisu potrebni za Google Identity Services ID token flow koji se ovdje koristi, ali mozes dodati:

```text
https://app.tvoj-domen.com/login
```

### 9. Test

Otvori:

```text
https://app.tvoj-domen.com
```

Provjeri:

```text
https://api.tvoj-domen.com/health
```

Login:

```text
superadmin@farmaoglasi.pro
Password123!
```

## Opcija B - sve na jednom jeftinom VPS-u

Ako hoces najrealniji production demo, uzmi mali VPS.

Primjer:

```text
Hetzner CX11
Oracle Cloud free VM
Contabo VPS
```

Na serveru:

```bash
git clone https://github.com/tvoj-user/farmaoglasipro.git
cd farmaoglasipro
cp .env.example .env
nano .env
docker compose up -d
```

DNS:

```text
tvoj-domen.com A IP_ADRESA_SERVERA
www            CNAME tvoj-domen.com
```

Za HTTPS dodaj Caddy ili Traefik ispred nginx-a.

Primjer Caddyfile:

```text
tvoj-domen.com {
  reverse_proxy localhost:80
}
```

## Opcija C - samo da pokazes frontend

Ako zelis samo vizuelni demo bez backend deploya:

1. Deploy frontend na Vercel.
2. Ostavi fallback demo podatke u React aplikaciji.
3. `VITE_API_URL` moze pokazivati na lokalni ili nepostojeci API.

Aplikacija ce i dalje prikazati:

- featured oglase
- farme
- veterinare
- stanice
- aukcije
- login/register ekran
- night mode
- bosanski/engleski

Ovo je dobro za prezentaciju, ali nije kompletan sistem.

## Besplatni servisi - kratka mapa

```text
Frontend: Vercel, Netlify, Cloudflare Pages
Backend: Render, Fly.io, Railway trial
PostgreSQL: Neon, Supabase
Redis: Upstash
S3: Cloudflare R2 free tier
DNS: Cloudflare
Email: Resend free tier
Monitoring: Better Stack free tier, Sentry free tier
```

## Kako spojiti notifikacije u free deployu

Realtime:

```env
VITE_SOCKET_URL=https://api.tvoj-domen.com
```

Backend mora biti dostupan za WebSocket konekcije.

Email:

1. Otvori Resend.
2. Verifikuj domen.
3. Dodaj API key u backend:

```env
RESEND_API_KEY=...
```

SMS:

Za free demo preskoci SMS ili koristi Twilio trial.

Push:

Za web push dodaj VAPID keys ili Firebase Cloud Messaging.

## Minimalni production checklist

- Domen radi
- HTTPS radi
- `/health` vraca `ok`
- Frontend moze pozvati `/api/listings`
- Login radi
- Google SSO radi
- PostgreSQL migracije su prosle
- Redis konekcija radi
- S3 upload radi
- Socket.io konekcija radi
- Admin nalog postoji
- JWT secreti su jaki i nisu default
- Backup baze je ukljucen

## Komande za lokalnu provjeru prije deploya

```bash
docker compose build
docker compose up -d
curl http://localhost/health
curl http://localhost:4002/health
```

Ako hoces zaustaviti:

```bash
docker compose down
```

Ako hoces obrisati bazu i krenuti ispocetka:

```bash
docker compose down -v
docker compose up -d
```
