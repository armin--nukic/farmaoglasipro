# FARMA OGLASI PRO - admin panel

Admin panel je na:

```text
http://localhost:5173/admin
```

ili kroz nginx:

```text
http://localhost/admin
```

## Login za admina

```text
Email: superadmin@farmaoglasi.pro
Password: Password123!
```

Nakon logina frontend cuva JWT token u:

```text
localStorage farma:token
```

Admin forme salju taj token kao:

```text
Authorization: Bearer TOKEN
```

## Ko moze koristiti admin API

Backend dozvoljava:

```text
SUPER_ADMIN
ADMINISTRATOR
MODERATOR
```

Za premium, role i kreiranje vaznih zapisa u pravoj produkciji preporuka je ograniciti neke akcije samo na `SUPER_ADMIN`.

## Sta admin sada moze dodavati

Admin UI ima tabove:

- dodaj korisnika
- dodaj veterinarsku stanicu
- dodaj farmu
- dodaj grlo/zivotinju
- dodaj oglas
- aktiviraj Premium Full

## Backend rute

```text
POST /api/admin/users
POST /api/admin/veterinary-stations
POST /api/admin/farms
POST /api/admin/animals
POST /api/admin/listings
POST /api/admin/premium
GET  /api/admin/users
GET  /api/admin/dashboard
GET  /api/admin/logs
```

## Dodavanje usera i role

Admin unosi:

- email
- password
- full name
- phone
- role
- city

Role:

```text
REGISTERED_USER
VERIFIED_BREEDER
VETERINARIAN
VETERINARY_STATION
PREMIUM_USER
MODERATOR
ADMINISTRATOR
SUPER_ADMIN
```

Upisuje se u tabelu:

```text
users
```

I u audit:

```text
audit_logs
```

## Dodavanje veterinarske stanice

Admin unosi:

- naziv
- grad
- adresa
- latitude
- longitude
- usluge
- radno vrijeme
- emergency contact

Upisuje se u:

```text
veterinary_stations
```

## Dodavanje farme

Admin unosi:

- ownerId
- naziv
- opis
- grad
- latitude
- longitude

Upisuje se u:

```text
farms
```

Owner ID uzmes iz baze:

```sql
SELECT id, email, full_name FROM users LIMIT 20;
```

## Dodavanje grla/zivotinje

Admin unosi:

- ownerId
- farmId opcionalno
- ime
- animalId
- microchip
- kategorija
- rasa
- datum rodjenja
- tezina
- health status

Upisuje se u:

```text
animals
animal_health_records
```

Backend automatski kreira prvi health record:

```text
Animal profile created
```

## Dodavanje oglasa

Admin unosi:

- ownerId
- title
- description
- price
- type
- category
- breed
- gender
- age
- weight
- color
- location
- phone
- featured
- urgent

Upisuje se u:

```text
listings
```

## Premium Full

Cijena:

```text
10 KM mjesecno
```

Admin unosi:

- userId
- months
- provider

Backend radi:

1. Kreira `subscriptions` zapis.
2. Kreira `payments` zapis.
3. Mijenja user role u `PREMIUM_USER`.
4. Postavlja `verified = true`.
5. Dodaje notifikaciju u tabelu `notifications`.
6. Dodaje audit log.

Premium pogodnosti:

- Premium badge
- verified user
- featured listing logika
- prioritet u pretrazi
- bolja vidljivost
- marketplace preporuke
- statistika pregleda
- prioritetna podrska

## Bosanski i engleski

Admin panel koristi isti translation sistem:

```text
packages/shared/src/locales.ts
```

U headeru se mijenja:

```text
BS / EN
```

## Kako testirati

1. Login kao superadmin.
2. Otvori `/admin`.
3. Dodaj usera.
4. Kopiraj novi user ID iz baze ili dodaj preko admin forme.
5. Dodaj farmu sa tim ownerId.
6. Dodaj grlo sa ownerId i opcionalno farmId.
7. Dodaj oglas sa ownerId.
8. Aktiviraj Premium Full za userId.

SQL provjera:

```sql
SELECT email, role, verified FROM users ORDER BY created_at DESC LIMIT 10;
SELECT name, city FROM farms ORDER BY created_at DESC LIMIT 10;
SELECT name, animal_id, breed FROM animals ORDER BY created_at DESC LIMIT 10;
SELECT title, price, featured, urgent FROM listings ORDER BY created_at DESC LIMIT 10;
SELECT plan, status, current_period_end FROM subscriptions ORDER BY created_at DESC LIMIT 10;
SELECT title, body FROM notifications ORDER BY created_at DESC LIMIT 10;
```

