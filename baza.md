# FARMA OGLASI PRO - kako testirati bazu

Ovaj dokument objasnjava kako lokalno testirati PostgreSQL bazu, provjeriti seed podatke, login korisnike, oglase, veterinare i osnovne relacije.

## Podaci za lokalnu bazu

Docker compose pokrece PostgreSQL ovako:

```text
Host: localhost
Port: 5433
Database: farma_oglasi
User: farma
Password: farma_password
```

Unutar Docker mreze backend koristi:

```text
Host: postgres
Port: 5432
Database: farma_oglasi
User: farma
Password: farma_password
```

## Najbrzi test da li baza radi

```bash
docker compose ps
```

Trebas vidjeti:

```text
postgres   Up ... (healthy)
```

Backend health:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:4002/health
```

Ako backend vraca `ok`, znaci aplikacija moze raditi, ali jos uvijek vrijedi direktno provjeriti bazu.

## Ulazak u bazu kroz Docker

```bash
docker compose exec postgres psql -U farma -d farma_oglasi
```

Kada udjes, test:

```sql
SELECT now();
```

Izlaz:

```sql
\q
```

## Provjera tabela

U `psql`:

```sql
\dt
```

Ocekivane tabele ukljucuju:

```text
users
farms
animals
animal_health_records
veterinarians
veterinary_stations
appointments
listings
favorites
conversations
messages
notifications
reviews
auctions
bids
subscriptions
payments
reports
audit_logs
settings
schema_migrations
```

## Provjera migracija

```sql
SELECT * FROM schema_migrations;
```

Trebas vidjeti:

```text
001_initial_schema.sql
```

## Provjera seed podataka

Broj korisnika:

```sql
SELECT count(*) FROM users;
```

Broj oglasa:

```sql
SELECT count(*) FROM listings;
```

Broj zivotinja:

```sql
SELECT count(*) FROM animals;
```

Broj veterinara:

```sql
SELECT count(*) FROM veterinarians;
```

Broj veterinarskih stanica:

```sql
SELECT count(*) FROM veterinary_stations;
```

Jedan upit za sve:

```sql
SELECT 'users' AS table_name, count(*) FROM users
UNION ALL SELECT 'listings', count(*) FROM listings
UNION ALL SELECT 'animals', count(*) FROM animals
UNION ALL SELECT 'farms', count(*) FROM farms
UNION ALL SELECT 'veterinarians', count(*) FROM veterinarians
UNION ALL SELECT 'veterinary_stations', count(*) FROM veterinary_stations
UNION ALL SELECT 'reviews', count(*) FROM reviews
UNION ALL SELECT 'auctions', count(*) FROM auctions;
```

## Test login korisnika u bazi

Provjeri da li postoji test user:

```sql
SELECT id, email, full_name, role, verified
FROM users
WHERE email = 'testuser@farmaoglasi.pro';
```

Test login:

```text
Email: testuser@farmaoglasi.pro
Password: Password123!
```

Super admin:

```sql
SELECT id, email, full_name, role, verified
FROM users
WHERE email = 'superadmin@farmaoglasi.pro';
```

Login:

```text
Email: superadmin@farmaoglasi.pro
Password: Password123!
```

Napomena: lozinke su hashirane u koloni `password_hash`, zato ih ne mozes citati direktno kao plain text.

## Test login kroz API

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

Kroz nginx:

```powershell
Invoke-WebRequest `
  -UseBasicParsing `
  -Method Post `
  -Uri "http://localhost/api/auth/login" `
  -ContentType "application/json" `
  -Body $body
```

Direktno kroz frontend port nakon proxy fixa:

```powershell
Invoke-WebRequest `
  -UseBasicParsing `
  -Method Post `
  -Uri "http://localhost:5173/api/auth/login" `
  -ContentType "application/json" `
  -Body $body
```

Ako radi, dobit ces:

```json
{
  "data": {
    "user": {
      "id": "...",
      "email": "testuser@farmaoglasi.pro"
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

## Test oglasa u bazi

```sql
SELECT title, type, category, price, currency, location, featured, urgent
FROM listings
ORDER BY published_at DESC
LIMIT 10;
```

Featured oglasi:

```sql
SELECT title, price, location
FROM listings
WHERE featured = true
ORDER BY published_at DESC
LIMIT 10;
```

Hitni oglasi:

```sql
SELECT title, price, location
FROM listings
WHERE urgent = true
ORDER BY published_at DESC
LIMIT 10;
```

## Test zivotinja i zdravstvene historije

```sql
SELECT id, name, animal_id, microchip_number, category, breed, health_status
FROM animals
LIMIT 10;
```

Health records:

```sql
SELECT a.name, a.animal_id, h.record_type, h.title, h.notes, h.recorded_at
FROM animal_health_records h
JOIN animals a ON a.id = h.animal_id
ORDER BY h.recorded_at DESC
LIMIT 10;
```

## Test veterinara

```sql
SELECT u.full_name, u.email, u.city, v.license_number, v.specializations, v.experience_years, v.rating
FROM veterinarians v
JOIN users u ON u.id = v.user_id
ORDER BY v.rating DESC
LIMIT 10;
```

## Test veterinarskih stanica

```sql
SELECT name, city, address, latitude, longitude, services, opening_hours, emergency_contact, rating
FROM veterinary_stations
ORDER BY rating DESC
LIMIT 10;
```

## Test aukcija i bidova

```sql
SELECT a.id, l.title, a.current_price, a.status, a.ends_at
FROM auctions a
JOIN listings l ON l.id = a.listing_id
ORDER BY a.ends_at ASC
LIMIT 10;
```

Bidovi:

```sql
SELECT b.amount, b.auto_bid_limit, u.email, b.created_at
FROM bids b
JOIN users u ON u.id = b.bidder_id
ORDER BY b.created_at DESC
LIMIT 10;
```

## Test notifikacija

Provjera tabele:

```sql
SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;
```

Rucno ubaci test notifikaciju:

```sql
INSERT INTO notifications (user_id, title, body, channel)
SELECT id, 'Test notifikacija', 'Ovo je lokalni test notifikacije iz baze.', 'REALTIME'
FROM users
WHERE email = 'testuser@farmaoglasi.pro';
```

Procitaj:

```sql
SELECT u.email, n.title, n.body, n.channel, n.read_at, n.created_at
FROM notifications n
JOIN users u ON u.id = n.user_id
ORDER BY n.created_at DESC
LIMIT 10;
```

## Test appointment rezervacija

Nadji jednog korisnika, veterinara i zivotinju:

```sql
SELECT id FROM users WHERE email = 'testuser@farmaoglasi.pro';
SELECT id FROM veterinarians LIMIT 1;
SELECT id FROM animals LIMIT 1;
```

Rucni insert:

```sql
INSERT INTO appointments (user_id, veterinarian_id, animal_id, scheduled_at, reason, status)
VALUES (
  (SELECT id FROM users WHERE email = 'testuser@farmaoglasi.pro'),
  (SELECT id FROM veterinarians LIMIT 1),
  (SELECT id FROM animals LIMIT 1),
  now() + interval '2 days',
  'Test rezervacija lokalno',
  'CONFIRMED'
);
```

Provjera:

```sql
SELECT a.id, u.email, an.name AS animal_name, a.scheduled_at, a.reason, a.status
FROM appointments a
JOIN users u ON u.id = a.user_id
JOIN animals an ON an.id = a.animal_id
ORDER BY a.scheduled_at DESC
LIMIT 10;
```

## Spajanje preko GUI alata

Mozes koristiti:

- DBeaver
- TablePlus
- pgAdmin
- DataGrip

Connection:

```text
Host: localhost
Port: 5433
Database: farma_oglasi
Username: farma
Password: farma_password
SSL: disable za lokalni Docker
```

## Reset baze

Ako hoces sve ispocetka:

```bash
docker compose down -v
docker compose up -d
```

Ovo brise PostgreSQL volume i ponovo radi migraciju i seed.

## Samo ponovni seed

Backend pri startu trenutno radi migrate + seed.

Ako zelis natjerati ponovni seed:

```bash
docker compose restart backend
```

Posto seed koristi `TRUNCATE ... RESTART IDENTITY CASCADE`, obrisat ce demo podatke i ponovo ih kreirati.

## Backup lokalne baze

Dump:

```bash
docker compose exec postgres pg_dump -U farma farma_oglasi > farma_oglasi_backup.sql
```

Restore:

```bash
docker compose exec -T postgres psql -U farma -d farma_oglasi < farma_oglasi_backup.sql
```

## Ako login ne radi

1. Provjeri da li backend radi:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:4002/health
```

2. Provjeri da li user postoji:

```sql
SELECT email, role FROM users WHERE email = 'testuser@farmaoglasi.pro';
```

3. Ako ne postoji, restartuj backend nakon najnovijeg builda:

```bash
docker compose build backend
docker compose up -d backend
```

4. Ako koristis browser na `http://localhost:5173`, frontend nginx mora imati proxy za `/api`. To je dodano u:

```text
apps/frontend/nginx.conf
```

Nakon izmjene:

```bash
docker compose build frontend
docker compose up -d frontend
```

