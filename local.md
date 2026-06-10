# FARMA OGLASI PRO - lokalno pokretanje i testiranje

Ovaj dokument je brz vodic kako lokalno pokrenuti, testirati login, pregledati bazu i provjeriti da sve radi.

## Test login korisnici

Obicni test user:

```text
Email: testuser@farmaoglasi.pro
Password: Password123!
Role: REGISTERED_USER
```

Super admin:

```text
Email: superadmin@farmaoglasi.pro
Password: Password123!
Role: SUPER_ADMIN
```

Seedani korisnici:

```text
user1@farmaoglasi.pro
user2@farmaoglasi.pro
...
user50@farmaoglasi.pro
Password za sve: Password123!
```

Admini:

```text
admin1@farmaoglasi.pro
admin2@farmaoglasi.pro
...
admin5@farmaoglasi.pro
Password za sve: Password123!
```

Veterinari:

```text
vet1@farmaoglasi.pro
vet2@farmaoglasi.pro
...
vet20@farmaoglasi.pro
Password za sve: Password123!
```

## Pokretanje lokalno preko Docker-a

Iz root foldera:

```bash
docker compose up -d
```

To pokrece:

- frontend
- backend
- PostgreSQL
- Redis
- MinIO
- nginx
- Socket.io server kroz backend

## Lokalni URL-ovi

```text
Glavna aplikacija:       http://localhost
Frontend direktno:       http://localhost:5173
Backend direktno:        http://localhost:4002
Backend health:          http://localhost:4002/health
Nginx health:            http://localhost/health
Socket.io host:          http://localhost:4003
PostgreSQL host:         localhost:5433
Redis host:              localhost:6380
MinIO API:               http://localhost:9000
MinIO console:           http://localhost:9001
```

## Brzi test da li radi

PowerShell:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost/health
Invoke-WebRequest -UseBasicParsing http://localhost:4002/health
Invoke-WebRequest -UseBasicParsing http://localhost:5173
```

Ocekivano za health:

```json
{"status":"ok","service":"farma-backend"}
```

## Login test kroz browser

1. Otvori:

```text
http://localhost/login
```

2. Unesi:

```text
testuser@farmaoglasi.pro
Password123!
```

3. Nakon logina header prikazuje korisnika i role info.

4. Za admin test koristi:

```text
superadmin@farmaoglasi.pro
Password123!
```

## Login test kroz API

PowerShell:

```powershell
$body = @{
  email = "testuser@farmaoglasi.pro"
  password = "Password123!"
} | ConvertTo-Json

Invoke-WebRequest `
  -UseBasicParsing `
  -Method Post `
  -Uri "http://localhost:4002/api/auth/login" `
  -ContentType "application/json" `
  -Body $body
```

Ako radi, backend vraca:

```json
{
  "data": {
    "user": {},
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

## Registracija lokalno

Browser:

```text
http://localhost/register
```

API:

```powershell
$body = @{
  email = "novi@farmaoglasi.pro"
  password = "Password123!"
  fullName = "Novi Korisnik"
  phone = "+38761123456"
} | ConvertTo-Json

Invoke-WebRequest `
  -UseBasicParsing `
  -Method Post `
  -Uri "http://localhost:4002/api/auth/register" `
  -ContentType "application/json" `
  -Body $body
```

## Night mode lokalno

Night mode dugme je u headeru.

Ikone:

- `Moon` ukljucuje tamni mod
- `Sun` vraca svijetli mod

Kako radi:

```text
localStorage key: farma:theme
html class: dark
Tailwind: dark: klase
```

Ako hoces rucno resetovati temu u browseru:

```js
localStorage.removeItem("farma:theme")
location.reload()
```

## Bosanski / English

U headeru imas dugme sa `Globe2` ikonom:

```text
BS -> bosanski
EN -> engleski
```

Prevodi su u:

```text
packages/shared/src/locales.ts
```

## Pregled baze

Ulazak u PostgreSQL container:

```bash
docker compose exec postgres psql -U farma -d farma_oglasi
```

Primjeri SQL upita:

```sql
SELECT email, full_name, role, verified FROM users ORDER BY created_at DESC LIMIT 10;
SELECT count(*) FROM listings;
SELECT count(*) FROM animals;
SELECT count(*) FROM veterinarians;
SELECT count(*) FROM veterinary_stations;
```

Izlaz iz psql:

```text
\q
```

## Reset lokalne baze

Ako hoces sve ispocetka:

```bash
docker compose down -v
docker compose up -d
```

Ovo brise Docker volume baze i ponovo pokrece migracije i seed.

## Sta se seeduje

Seed skripta:

```text
apps/backend/src/db/seed.ts
```

Kreira:

- super admin
- test user
- admin korisnike
- regularne korisnike
- veterinare
- veterinarske stanice
- farme
- zivotinje
- oglase
- recenzije
- aukcije
- bidove

## Google SSO lokalno

Google login dugme postoji na:

```text
http://localhost/login
http://localhost/register
```

Da stvarno radi, moras podesiti Google OAuth Client ID.

U `.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

U Google Cloud Console dodaj authorized origins:

```text
http://localhost
http://localhost:5173
```

Nakon izmjene:

```bash
docker compose build frontend backend
docker compose up -d
```

## Test listing API-ja

```powershell
Invoke-WebRequest -UseBasicParsing "http://localhost:4002/api/listings"
```

Kroz nginx:

```powershell
Invoke-WebRequest -UseBasicParsing "http://localhost/api/listings"
```

## Test admin API-ja

Prvo login kao super admin i kopiraj `accessToken`.

Zatim:

```powershell
$token = "PASTE_ACCESS_TOKEN"

Invoke-WebRequest `
  -UseBasicParsing `
  -Uri "http://localhost:4002/api/admin/dashboard" `
  -Headers @{ Authorization = "Bearer $token" }
```

Ako koristis obicnog korisnika, dobit ces `403 Insufficient permissions`.

## Test Socket.io lokalno

Socket.io server radi na:

```text
http://localhost:4003
```

Kroz nginx:

```text
http://localhost/socket.io/
```

Eventovi:

```text
conversation:join
typing
message:send
message:new
notification:subscribe
```

## Notifikacije lokalno

Trenutna infrastruktura:

- tabela `notifications`
- Socket.io event `notification:subscribe`
- user room format `user:{userId}`

Primjer toka:

1. Korisnik se loginuje.
2. Frontend ima njegov `user.id`.
3. Socket.io se subscribe-a na `notification:subscribe`.
4. Backend moze emitovati notifikaciju tom korisniku.
5. Za trajne notifikacije upisuje se red u tabelu `notifications`.

Email notifikacije jos nisu spojene na provider. Za to se dodaje Resend, SendGrid, AWS SES ili slican servis.

## Stop lokalnog sistema

```bash
docker compose down
```

## Restart samo aplikacije

```bash
docker compose up -d backend frontend nginx
```

## Rebuild nakon izmjena koda

```bash
docker compose build
docker compose up -d
```

## Najcesci problemi

Ako je port zauzet:

```text
Backend host port: 4002
Socket host port: 4003
PostgreSQL host port: 5433
Redis host port: 6380
```

Mozes promijeniti u `.env`:

```env
BACKEND_PORT=4010
SOCKET_HOST_PORT=4011
POSTGRES_PORT=5440
REDIS_PORT=6390
```

Ako login ne radi:

1. Provjeri `http://localhost:4002/health`.
2. Provjeri da li je baza healthy:

```bash
docker compose ps
```

3. Provjeri backend logove:

```bash
docker compose logs backend --tail 100
```

