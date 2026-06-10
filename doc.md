# FARMA OGLASI PRO - kako sistem radi

Ovaj projekat je monorepo marketplace platforma za stoku, farme, opremu, veterinarske usluge, aukcije, poruke i zdravstvenu historiju zivotinja.

## Struktura

```text
apps/frontend   React 19 aplikacija
apps/backend    Express API + Socket.io
packages/shared Dijeljeni tipovi, Zod validacije, prevodi
docker-compose.yml Kompletan lokalni sistem
infrastructure/nginx Reverse proxy
```

## Glavni tok

1. Korisnik otvori `http://localhost`.
2. Nginx prikazuje frontend i prosljedjuje `/api/*` zahtjeve backendu.
3. Frontend preko React Query poziva backend API.
4. Backend cita/pise podatke u PostgreSQL.
5. Redis se koristi za cache listinga.
6. MinIO cuva slike, dokumente i video fajlove preko S3 kompatibilnog API-ja.
7. Socket.io server radi realtime chat, typing indicator i realtime notifikacije.

## Frontend

Frontend je u `apps/frontend`.

Koristi:

- React 19
- TypeScript
- Vite
- TailwindCSS
- Shadcn-style komponente
- React Query
- React Router
- Lucide ikone

Glavne stranice:

- `/` pocetna marketplace stranica
- `/listings` oglasi
- `/equipment` oprema
- `/farms` farme
- `/veterinarians` veterinari
- `/stations` veterinarske stanice
- `/auctions` aukcije
- `/appointments` veterinarski termini
- `/messages` realtime poruke
- `/admin` admin dashboard
- `/login` prijava
- `/register` registracija

## Bosanski/Engleski

Prevodi su u:

```text
packages/shared/src/locales.ts
```

Header ima dugme sa ikonom globusa:

- `BS` prikazuje bosanski
- `EN` prikazuje engleski

Promjena jezika se radi kroz `I18nProvider` u:

```text
apps/frontend/src/i18n.tsx
```

## Ikone

Ikone dolaze iz `lucide-react`.

Koriste se za:

- jezik
- login/logout
- notifikacije
- favorite
- dark mode
- veterinarski modul
- aukcije
- admin module
- forme za login/registraciju

## Night mode

Night mode radi kroz:

```text
apps/frontend/src/theme.tsx
```

Logika:

1. Tema se cuva u `localStorage` pod `farma:theme`.
2. Ako je tema `dark`, na `document.documentElement` se dodaje klasa `dark`.
3. Tailwind koristi `dark:` klase za boje.
4. Header ima dugme sa `Moon` i `Sun` ikonama.

## Login i registracija

Backend rute:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/google
```

Frontend stranice:

```text
/login
/register
```

Regularni login:

1. Korisnik posalje email i lozinku.
2. Backend poredi lozinku preko `bcryptjs`.
3. Backend vraca `accessToken`, `refreshToken` i korisnika.
4. Frontend cuva tokene u `localStorage`.
5. Header prikazuje ime korisnika i logout dugme.

Demo super admin:

```text
Email: superadmin@farmaoglasi.pro
Password: Password123!
```

## Google SSO

Google SSO je pripremljen ovako:

Backend:

```text
POST /api/auth/google
```

Frontend:

```text
apps/frontend/src/pages/AuthPage.tsx
```

Kako radi:

1. Frontend ucita Google Identity Services skriptu.
2. Korisnik klikne `Continue with Google`.
3. Google vrati `id_token`.
4. Frontend salje `id_token` backendu.
5. Backend provjeri token preko Google `tokeninfo` endpointa.
6. Ako je email verifikovan, backend kreira korisnika ili ga prijavi.
7. Backend vraca JWT tokene.

Potrebne varijable:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

## Marketplace oglasi

Listing model podrzava:

- title
- description
- price
- currency
- type
- category
- breed
- gender
- age
- weight
- color
- location
- vaccinated
- pedigree
- health status
- images
- videos
- contact telefone
- WhatsApp
- Viber
- Telegram
- views
- favorites
- featured
- urgent
- expiry date

Rute:

```text
GET /api/listings
GET /api/listings/:slug
POST /api/listings
PATCH /api/listings/:id/renew
```

## Animal health modul

Baza ima tabele:

```text
animals
animal_health_records
```

Podrzava:

- animal ID
- microchip number
- QR code URL
- vaccination history
- medical history
- veterinary notes
- prescriptions
- certificates
- documents
- photos
- videos

API:

```text
GET /api/animals
GET /api/animals/:id/health
```

## Veterinari i stanice

API:

```text
GET /api/veterinarians
GET /api/veterinary-stations
```

Podrzano:

- profil veterinara
- licenca
- specijalizacije
- iskustvo
- rating
- online konsultacije
- hitna dostupnost
- stanice na mapi
- usluge
- radno vrijeme
- emergency contact

## Termini

API:

```text
GET /api/appointments
POST /api/appointments
```

Termini imaju:

- veterinarianId
- animalId
- userId
- scheduledAt
- reason
- status
- reminderSent

## Notifikacije

U bazi postoji tabela:

```text
notifications
```

Socket.io podrzava:

```text
notification:subscribe
```

Predvidjeni tok:

1. Korisnik se prijavi.
2. Frontend se spoji na Socket.io.
3. Frontend posalje `notification:subscribe` sa `userId`.
4. Backend moze poslati notifikaciju u sobu `user:{userId}`.
5. Paralelno se notifikacija moze upisati u PostgreSQL tabelu `notifications`.

Kanali koji su predvidjeni:

- realtime
- email
- SMS
- push

Trenutno je realtime infrastruktura spremna, a provider integracije za email/SMS/push se dodaju kao posebni servisi.

## Poruke

Socket.io eventovi:

```text
conversation:join
typing
message:send
message:new
notification:subscribe
```

Tabele:

```text
conversations
messages
```

Podrzano u modelu:

- realtime chat
- typing indicator
- read receipts
- file URL
- voice URL

## AI modul

API:

```text
POST /api/ai/listing-description
```

Trenutno generise opis oglasa i vraca:

- description
- fraudRisk
- spamScore
- recommendations

Kasnije se moze povezati sa pravim AI providerom.

## Admin

API:

```text
GET /api/admin/dashboard
GET /api/admin/logs
```

Admin dashboard pokriva:

- korisnike
- oglase
- zivotinje
- prihode
- reportove
- audit log

Pristup je zasticen JWT tokenom i rolama:

- ADMINISTRATOR
- SUPER_ADMIN
- MODERATOR

