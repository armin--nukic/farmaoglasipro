# Google SSO - FARMA OGLASI PRO

Ovaj projekat radi i bez Google SSO preko lokalnog JWT login/register sistema. Google dugme se aktivira tek kada postoje pravi OAuth client ID podaci.

## 1. Lokalni JWT test

Pokreni:

```bash
docker compose up -d
```

Test login:

```txt
testuser@farmaoglasi.pro
Password123!
```

Admin login:

```txt
superadmin@farmaoglasi.pro
Password123!
```

Registracija normalnog usera radi na `/register`. Novi korisnik dobija rolu `REGISTERED_USER`.

## 2. Google Cloud Console

1. Otvori Google Cloud Console.
2. Napravi novi projekat, npr. `Farma Oglasi Pro`.
3. Idi na `APIs & Services` -> `OAuth consent screen`.
4. Izaberi `External`.
5. Popuni:
   - App name: `FARMA OGLASI PRO`
   - User support email
   - Developer contact email
6. Dodaj scope:
   - `openid`
   - `email`
   - `profile`
7. Idi na `Credentials` -> `Create Credentials` -> `OAuth client ID`.
8. Izaberi `Web application`.

## 3. Authorized JavaScript origins

Za lokalni test dodaj:

```txt
http://localhost:8088
http://localhost:5173
```

Za produkciju dodaj:

```txt
https://farma.ice.lol
```

## 4. Environment varijable

U `.env` dodaj isti Google client ID za backend i frontend:

```env
GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

Ako deploy ide na VPS:

```env
APP_URL=https://farma.ice.lol
VITE_API_URL=https://farma.ice.lol/api
GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

Nakon promjene env-a:

```bash
docker compose build backend frontend
docker compose up -d
```

## 5. Kako radi tok

Frontend učita Google script `https://accounts.google.com/gsi/client`.

Kada korisnik klikne Google dugme, Google vrati `id_token`.

Frontend šalje token na:

```txt
POST /api/auth/google
```

Backend provjerava token preko Google `tokeninfo` endpointa, provjerava `aud` protiv `GOOGLE_CLIENT_ID`, provjerava da je email verifikovan, zatim kreira ili ažurira usera u PostgreSQL bazi.

Nakon toga backend vraća:

```json
{
  "user": "...",
  "accessToken": "...",
  "refreshToken": "..."
}
```

Frontend sprema token u `localStorage` i korisnik je logovan.

## 6. Najčešće greške

Ako vidiš:

```txt
Google SSO not configured
```

Nema `VITE_GOOGLE_CLIENT_ID` u frontend build env-u.

Ako vidiš:

```txt
Google token audience mismatch
```

Backend `GOOGLE_CLIENT_ID` nije isti kao frontend `VITE_GOOGLE_CLIENT_ID`.

Ako Google popup ne radi:

Provjeri da je domen dodan u `Authorized JavaScript origins`.

Ako radi lokalno, a ne radi na VPS-u:

Provjeri:

```bash
docker compose exec backend printenv | grep GOOGLE
docker compose exec frontend nginx -T
```

Frontend env varijable se ugrađuju tokom builda, zato se frontend mora rebuildati poslije promjene `VITE_GOOGLE_CLIENT_ID`.
