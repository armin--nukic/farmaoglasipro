# FARMA OGLASI PRO - lokalni deploy i test

Ovaj dokument je za lokalno pokretanje cijele aplikacije preko Docker-a.

Kratak odgovor:

```bash
docker compose up -d
```

Da, to treba biti dovoljno da se pokrene cijeli sistem, ako Docker Desktop radi i portovi nisu zauzeti.

U ovom projektu su lokalni portovi pomjereni na sigurnije vrijednosti da se ne sudaraju sa drugim servisima:

```text
Glavna aplikacija:        http://localhost:8088
Frontend direktno:        http://localhost:5173
Backend API direktno:     http://localhost:4002
Socket.io direktno:       http://localhost:4003
PostgreSQL lokalno:       localhost:5433
Redis lokalno:            localhost:6380
MinIO API lokalno:        http://localhost:19000
MinIO console lokalno:    http://localhost:19001
```

## 1. Sta se pokrece

`docker compose up -d` pokrece:

- `postgres`
- `redis`
- `minio`
- `minio-init`
- `backend`
- `frontend`
- `nginx`

Backend pri startu radi:

```text
migrations -> Express API -> Socket.io
```

Seed demo podataka se vise ne pokrece na svaki start, da se baza ne resetuje dok testiras oglase, veterinare, forum i premium. Kada zelis svjeze demo podatke, pokreni seed rucno:

```bash
docker compose exec backend node apps/backend/dist/db/seed.js
```

## 2. Prvi start

U root folderu projekta:

```bash
cd C:\programming\farmaoglasipro
docker compose up -d
```

Ako zelis prije toga rebuild:

```bash
docker compose build
docker compose up -d
```

Ako zelis sve ispocetka, sa brisanjem baze:

```bash
docker compose down -v
docker compose build
docker compose up -d
```

## 3. Provjera da radi

```bash
docker compose ps
```

Treba da vidis da su servisi `Up`, a PostgreSQL i Redis `healthy`.

Health check:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8088/health
Invoke-WebRequest -UseBasicParsing http://localhost:4002/health
```

API listings:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8088/api/listings
```

Frontend:

```text
http://localhost:8088
```

ili:

```text
http://localhost:5173
```

## 4. Login podaci

Super admin:

```text
Email: superadmin@farmaoglasi.pro
Password: Password123!
```

Test user:

```text
Email: testuser@farmaoglasi.pro
Password: Password123!
```

Admin panel:

```text
http://localhost:8088/admin
```

ili:

```text
http://localhost:5173/admin
```

## 5. Login i logout

Login stranica:

```text
http://localhost:8088/login
```

Logout dugme se prikaze u headeru nakon prijave.

Tokeni se cuvaju u browseru:

```text
localStorage farma:token
localStorage farma:refresh
localStorage farma:user
```

Ako zelis ocistiti login rucno:

```js
localStorage.removeItem("farma:token")
localStorage.removeItem("farma:refresh")
localStorage.removeItem("farma:user")
location.reload()
```

## 6. Google SSO lokalno

Google SSO je podrzan, ali ne moze raditi bez pravog Google OAuth Client ID-ja.

Ako vidis:

```text
Google SSO not configured
```

to nije bug. To znaci da u `.env` nisi dodao pravi Google client.

Za lokalno testiranje obicni email/password login radi odmah.

Da aktiviras Google SSO:

1. Otvori Google Cloud Console.
2. Kreiraj OAuth Client ID tipa `Web application`.
3. Dodaj Authorized JavaScript origins:

```text
http://localhost:8088
http://localhost:5173
```

4. U `.env` dodaj:

```env
GOOGLE_CLIENT_ID=tvoj-client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=tvoj-client-id.apps.googleusercontent.com
```

5. Rebuild:

```bash
docker compose build frontend backend
docker compose up -d frontend backend nginx
```

Kako radi Google SSO:

```text
Frontend dobije Google ID token
Frontend salje token na /api/auth/google
Backend validira token preko Google tokeninfo endpointa
Backend kreira ili pronadje korisnika u PostgreSQL
Backend vrati JWT accessToken i refreshToken
```

## 7. Logo

Logo je dodan u:

```text
apps/frontend/public/logo.svg
```

PWA ikona:

```text
apps/frontend/public/pwa.svg
```

Header koristi:

```text
/logo.svg
```

Ako promijenis logo, rebuildaj frontend:

```bash
docker compose build frontend
docker compose up -d frontend nginx
```

## 8. Free i placene opcije

### Free opcije

Za obicne korisnike:

- registracija
- login/logout
- pregled oglasa
- pretraga oglasa
- pregled farmi
- pregled veterinara
- pregled veterinarskih stanica
- pregled aukcija
- osnovno kreiranje oglasa
- osnovni kontakt prodavca
- night mode
- bosanski/engleski

Za veterinare i stanice, u demo verziji:

- osnovni profil
- prikaz specijalizacija
- prikaz usluga
- prikaz radnog vremena
- prikaz emergency kontakta

### Placene opcije

Premium Full:

```text
10 KM mjesecno
```

Predvidjene pogodnosti:

- Premium badge
- Verified seller badge
- izdvojeni oglasi
- prioritet u pretrazi
- veca vidljivost
- bolja pozicija na mapi
- automatsko obnavljanje oglasa
- marketplace preporuke
- statistika pregleda
- prioritetna podrska

Admin moze aktivirati Premium Full na:

```text
/admin
```

Tab:

```text
Premium Full
```

Backend tada upisuje:

- `subscriptions`
- `payments`
- `notifications`
- `audit_logs`

i mijenja usera u:

```text
PREMIUM_USER
```

## 9. Portovi i konflikt koji si dobio

Tvoja greska:

```text
ports are not available: exposing port TCP 127.0.0.1:9001
```

Znaci da je `9001` vec zauzet.

Zato je lokalni MinIO console pomjeren na:

```text
http://localhost:19001
```

MinIO API:

```text
http://localhost:19000
```

U `.env` sada treba biti:

```env
MINIO_PORT=19000
MINIO_CONSOLE_PORT=19001
S3_PUBLIC_URL=http://localhost:19000/farma-media
```

Ako je i `19001` zauzet, stavi npr:

```env
MINIO_PORT=29000
MINIO_CONSOLE_PORT=29001
S3_PUBLIC_URL=http://localhost:29000/farma-media
```

Zatim:

```bash
docker compose up -d
```

## 10. Korisne komande

Pokreni sve:

```bash
docker compose up -d
```

Rebuild sve:

```bash
docker compose build
docker compose up -d
```

Restart samo aplikacije:

```bash
docker compose up -d backend frontend nginx
```

Stop:

```bash
docker compose down
```

Stop i brisanje baze:

```bash
docker compose down -v
```

Logovi:

```bash
docker compose logs backend --tail 100
docker compose logs frontend --tail 100
docker compose logs nginx --tail 100
docker compose logs minio --tail 100
```

Status:

```bash
docker compose ps
```

## 11. Baza lokalno

Ulazak u PostgreSQL:

```bash
docker compose exec postgres psql -U farma -d farma_oglasi
```

Provjeri korisnike:

```sql
SELECT email, full_name, role, verified FROM users ORDER BY created_at DESC LIMIT 20;
```

Provjeri oglase:

```sql
SELECT title, type, category, price, location FROM listings LIMIT 20;
```

Izlaz:

```sql
\q
```

GUI konekcija, npr. DBeaver:

```text
Host: localhost
Port: 5433
Database: farma_oglasi
Username: farma
Password: farma_password
SSL: disabled
```

## 12. Ako app ne otvara

1. Provjeri Docker:

```bash
docker compose ps
```

2. Provjeri backend:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:4002/health
```

3. Provjeri app nginx:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:8088/health
```

4. Provjeri frontend direktno:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:5173
```

5. Ako browser prikazuje staru gresku, uradi:

```text
Ctrl + F5
```

ili ocisti browser cache za `localhost`.

## 13. Finalni lokalni checklist

```bash
docker compose up -d
docker compose ps
```

U browseru:

```text
http://localhost:8088
http://localhost:8088/login
http://localhost:8088/admin
```

Login:

```text
superadmin@farmaoglasi.pro
Password123!
```

Ako ovo radi, lokalni deploy fercera.
