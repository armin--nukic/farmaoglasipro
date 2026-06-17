# VPS deploy na bosanskom - vise domena na jednom serveru

Ovaj dokument objasnjava kako na jednom VPS-u drzati vise aplikacija i domena pomocu:

- Docker
- Docker Compose
- `.env`
- host nginx reverse proxy
- SSL certifikata

Primjer VPS-a:

```text
IP: 13.140.166.66
```

Postojeci domeni:

```text
hidzama.ice.lol
vozilo.ice.lol
```

Nova aplikacija:

```text
farma.ice.lol
```

## Glavna ideja

Na jednom serveru samo jedan servis moze slusati javni port `80` i `443`.

Zato:

- host nginx slusa `80` i `443`
- svaka aplikacija u Dockeru radi na svom internom localhost portu
- host nginx preusmjerava domene na odgovarajuci port

Primjer:

```text
hidzama.ice.lol -> 127.0.0.1:1111
vozilo.ice.lol  -> 127.0.0.1:2222
farma.ice.lol   -> 127.0.0.1:3333
```

Ovo znaci da Docker aplikacije nisu direktno javne. Javan je samo nginx.

## DNS

Za svaki subdomain dodaj A record prema istoj IP adresi:

```text
hidzama.ice.lol A 13.140.166.66
vozilo.ice.lol  A 13.140.166.66
farma.ice.lol   A 13.140.166.66
```

Provjera:

```bash
dig farma.ice.lol
dig vozilo.ice.lol
dig hidzama.ice.lol
```

Svi trebaju pokazivati:

```text
13.140.166.66
```

## Instalacija osnovnih paketa

Na VPS-u:

```bash
apt update
apt upgrade -y
apt install -y nginx certbot python3-certbot-nginx git curl ufw
```

## Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

Ne otvaraj PostgreSQL, Redis, MinIO ili backend portove javno.

## Docker instalacija

Ako Docker nije instaliran:

```bash
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Provjera:

```bash
docker --version
docker compose version
```

## Folder struktura

Preporuka:

```text
/opt/hidzama
/opt/vozilo
/opt/farma
```

Za farmu:

```bash
mkdir -p /opt/farma
cd /opt/farma
```

## Pravilo za portove

Za svaku aplikaciju uzmi poseban lokalni port:

```text
hidzama: 1111
vozilo:  2222
farma:   3333
```

Ako je `3333` zauzet, koristi:

```text
4444
5555
8088
8090
```

Provjera zauzetih portova:

```bash
ss -tulpn | grep -E ':1111|:2222|:3333|:4444|:80|:443'
```

## Nginx reverse proxy princip

Za svaku domenu imas poseban nginx config u:

```text
/etc/nginx/sites-available/
```

I symlink u:

```text
/etc/nginx/sites-enabled/
```

Primjer za `farma.ice.lol`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name farma.ice.lol;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3333;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3333/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktivacija:

```bash
ln -s /etc/nginx/sites-available/farma.ice.lol /etc/nginx/sites-enabled/farma.ice.lol
nginx -t
systemctl reload nginx
```

## SSL certifikat

Kada HTTP radi:

```bash
certbot --nginx -d farma.ice.lol
```

Test:

```bash
curl https://farma.ice.lol/health
```

## Update aplikacije

U folderu aplikacije:

```bash
git pull
docker compose build
docker compose up -d
```

## Logovi

Docker:

```bash
docker compose ps
docker compose logs backend --tail 100
docker compose logs frontend --tail 100
docker compose logs nginx --tail 100
```

Host nginx:

```bash
nginx -t
systemctl status nginx
journalctl -u nginx -n 100 --no-pager
tail -f /var/log/nginx/error.log
```

## Najcesci problemi

Ako domen ne radi:

1. Provjeri DNS:

```bash
dig farma.ice.lol
```

2. Provjeri lokalni Docker port:

```bash
curl http://127.0.0.1:3333/health
```

3. Provjeri nginx:

```bash
nginx -t
systemctl reload nginx
```

Ako `curl http://127.0.0.1:3333/health` radi, a domen ne radi, problem je host nginx ili DNS.

Ako taj curl ne radi, problem je Docker aplikacija.

## Detaljno: Nginx za FARMA OGLASI PRO na 13.140.166.66

Ovaj dio je tacno za:

```text
VPS IP: 13.140.166.66
Domena: farma.ice.lol
Aplikacija: FARMA OGLASI PRO
Interni Docker app port: 3333
```

Postojeci domeni na istom VPS-u:

```text
hidzama.ice.lol
vozilo.ice.lol
```

Bitno pravilo:

```text
Host nginx slusa javno 80/443.
Docker aplikacija FARMA slusa samo lokalno 127.0.0.1:3333.
```

Tako ne diras postojece stranice.

### 1. DNS za farma.ice.lol

U DNS panelu dodaj:

```text
Type: A
Name: farma
Value: 13.140.166.66
TTL: Auto
```

Na VPS-u ili lokalno provjeri:

```bash
dig farma.ice.lol
```

Treba da vrati:

```text
13.140.166.66
```

### 2. Docker .env za FARMA port 3333

U projektu FARMA OGLASI PRO, npr:

```bash
cd /opt/farma/farmaoglasipro
nano .env
```

Postavi ove portove:

```env
APP_URL=https://farma.ice.lol
API_URL=https://farma.ice.lol/api

NGINX_BIND=127.0.0.1
NGINX_PORT=3333

FRONTEND_BIND=127.0.0.1
FRONTEND_PORT=3334

BACKEND_BIND=127.0.0.1
BACKEND_PORT=3335

SOCKET_BIND=127.0.0.1
SOCKET_HOST_PORT=3336

POSTGRES_BIND=127.0.0.1
POSTGRES_PORT=3337

REDIS_BIND=127.0.0.1
REDIS_PORT=3338

MINIO_BIND=127.0.0.1
MINIO_PORT=3339

MINIO_CONSOLE_BIND=127.0.0.1
MINIO_CONSOLE_PORT=3340
```

Ovo znaci:

```text
FARMA Docker nginx: 127.0.0.1:3333
FARMA frontend direktno: 127.0.0.1:3334
FARMA backend direktno: 127.0.0.1:3335
FARMA socket direktno: 127.0.0.1:3336
FARMA postgres lokalno: 127.0.0.1:3337
FARMA redis lokalno: 127.0.0.1:3338
FARMA minio lokalno: 127.0.0.1:3339
FARMA minio console lokalno: 127.0.0.1:3340
```

### 3. Pokreni Docker aplikaciju

```bash
cd /opt/farma/farmaoglasipro
docker compose build
docker compose up -d
```

Provjeri:

```bash
docker compose ps
```

Zatim testiraj lokalni Docker nginx:

```bash
curl http://127.0.0.1:3333/health
```

Ocekivano:

```json
{"status":"ok","service":"farma-backend"}
```

Ako ovo ne radi, ne nastavljaj na SSL. Prvo popravi Docker aplikaciju.

### 3A. Kompletan .env primjer za VPS

Ovo mozes kopirati direktno u:

```bash
nano /opt/farma/farmaoglasipro/.env
```

Ako ti je projekat u drugom folderu, udji u taj folder pa:

```bash
nano .env
```

Primjer za `farma.ice.lol` na portu `3333`:

```env
NODE_ENV=production

# Javni URL aplikacije
APP_URL=https://farma.ice.lol
API_URL=https://farma.ice.lol/api

# Backend interni portovi unutar containera
PORT=4000
SOCKET_PORT=4001

# Docker nginx za FARMA app.
# Ovo NE ide javno na internet, nego samo lokalno na VPS-u.
# Host nginx ce raditi proxy sa farma.ice.lol na ovaj port.
NGINX_BIND=127.0.0.1
NGINX_PORT=3333

# Direktan frontend container port, samo lokalno.
FRONTEND_BIND=127.0.0.1
FRONTEND_PORT=3334

# Direktan backend API port, samo lokalno.
BACKEND_BIND=127.0.0.1
BACKEND_PORT=3335

# Direktan Socket.io port, samo lokalno.
SOCKET_BIND=127.0.0.1
SOCKET_HOST_PORT=3336

# PostgreSQL samo lokalno na VPS-u.
POSTGRES_BIND=127.0.0.1
POSTGRES_PORT=3337
POSTGRES_DB=farma_oglasi
POSTGRES_USER=farma
POSTGRES_PASSWORD=OVDJE_STAVI_JAK_POSTGRES_PASSWORD
DATABASE_URL=postgres://farma:OVDJE_STAVI_JAK_POSTGRES_PASSWORD@postgres:5432/farma_oglasi

# Redis samo lokalno.
REDIS_BIND=127.0.0.1
REDIS_PORT=3338
REDIS_URL=redis://redis:6379

# JWT tajne.
# Obavezno zamijeni sa dugim random vrijednostima.
JWT_SECRET=OVDJE_STAVI_DUG_RANDOM_SECRET_MIN_32_CHAR
JWT_REFRESH_SECRET=OVDJE_STAVI_DRUGI_DUG_RANDOM_SECRET_MIN_32_CHAR

# MinIO / S3 compatible storage.
# MinIO portovi su samo lokalni. Console otvaraj preko SSH tunela.
MINIO_BIND=127.0.0.1
MINIO_PORT=3339
MINIO_CONSOLE_BIND=127.0.0.1
MINIO_CONSOLE_PORT=3340
S3_ENDPOINT=http://minio:9000
S3_REGION=eu-central-1
S3_BUCKET=farma-media
S3_ACCESS_KEY=OVDJE_STAVI_MINIO_ACCESS
S3_SECRET_KEY=OVDJE_STAVI_MINIO_SECRET
S3_PUBLIC_URL=https://farma.ice.lol/minio/farma-media

# Frontend build varijable.
# Posto sve ide preko iste domene, koristi relativne URL-ove.
VITE_API_URL=/api
VITE_SOCKET_URL=/socket.io
VITE_APP_NAME=FARMA OGLASI PRO

# Google SSO - ostavi prazno ako jos ne koristis.
GOOGLE_CLIENT_ID=
VITE_GOOGLE_CLIENT_ID=

# Payment provideri - za demo moze ostati placeholder.
STRIPE_SECRET_KEY=sk_test_replace
PAYPAL_CLIENT_ID=replace
PAYPAL_CLIENT_SECRET=replace
MONRI_AUTH_TOKEN=replace
```

Obavezno promijeni ove vrijednosti:

```text
POSTGRES_PASSWORD
DATABASE_URL password dio
JWT_SECRET
JWT_REFRESH_SECRET
S3_ACCESS_KEY
S3_SECRET_KEY
```

Generisi random secret-e:

```bash
openssl rand -hex 32
openssl rand -hex 32
```

Primjer:

```env
JWT_SECRET=1f2a0e0b9e5d8f0b33c1c5d0a8a9f2e11d7c4b8a3f9e2d6c7b1a0f3e4d5c6b7a
JWT_REFRESH_SECRET=74f0ad7c4b6f1e9a2d3c5b7a8e9f0d1c2b3a4e5f60718293a4b5c6d7e8f90123
```

Ako hoces koristiti port `4444` umjesto `3333`, promijeni samo ovaj dio:

```env
NGINX_PORT=4444
FRONTEND_PORT=4445
BACKEND_PORT=4446
SOCKET_HOST_PORT=4447
POSTGRES_PORT=4448
REDIS_PORT=4449
MINIO_PORT=4450
MINIO_CONSOLE_PORT=4451
```

I u host nginx configu koristi:

```nginx
proxy_pass http://127.0.0.1:4444;
```

### 4. Host Nginx config za farma.ice.lol

Kreiraj fajl:

```bash
nano /etc/nginx/sites-available/farma.ice.lol
```

Ubaci ovaj kompletan config:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name farma.ice.lol;

    client_max_body_size 100M;

    access_log /var/log/nginx/farma.ice.lol.access.log;
    error_log /var/log/nginx/farma.ice.lol.error.log;

    location / {
        proxy_pass http://127.0.0.1:3333;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;

        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:3333/socket.io/;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
```

Aktiviraj config:

```bash
ln -s /etc/nginx/sites-available/farma.ice.lol /etc/nginx/sites-enabled/farma.ice.lol
```

Ako symlink vec postoji:

```bash
ls -la /etc/nginx/sites-enabled/ | grep farma
```

Testiraj nginx:

```bash
nginx -t
```

Ako pise `syntax is ok` i `test is successful`, reload:

```bash
systemctl reload nginx
```

### 5. Test preko domene bez SSL-a

```bash
curl http://farma.ice.lol/health
```

Ocekivano:

```json
{"status":"ok","service":"farma-backend"}
```

Ako ne radi, provjeri:

```bash
curl http://127.0.0.1:3333/health
nginx -t
tail -n 100 /var/log/nginx/farma.ice.lol.error.log
docker compose logs backend --tail 100
```

### 6. SSL za farma.ice.lol

Kada HTTP radi, pokreni:

```bash
certbot --nginx -d farma.ice.lol
```

Certbot ce sam dodati SSL server blokove i redirect.

Izaberi opciju:

```text
Redirect HTTP to HTTPS
```

Test:

```bash
curl https://farma.ice.lol/health
```

Ocekivano:

```json
{"status":"ok","service":"farma-backend"}
```

### 7. Provjera da hidzama i vozilo nisu pokvareni

Nakon reload-a nginx-a:

```bash
curl -I https://hidzama.ice.lol
curl -I https://vozilo.ice.lol
curl -I https://farma.ice.lol
```

Sva tri trebaju vratiti neki `HTTP/2 200`, `301`, `302` ili drugi normalan HTTP odgovor.

Ako `hidzama` ili `vozilo` prestanu raditi, provjeri da nisi pregazio njihove fajlove u:

```text
/etc/nginx/sites-available/
/etc/nginx/sites-enabled/
```

### 8. Ako je port 3333 zauzet

Provjeri:

```bash
ss -tulpn | grep ':3333'
```

Ako je zauzet, koristi port `4444`.

U FARMA `.env` promijeni:

```env
NGINX_PORT=4444
FRONTEND_PORT=4445
BACKEND_PORT=4446
SOCKET_HOST_PORT=4447
POSTGRES_PORT=4448
REDIS_PORT=4449
MINIO_PORT=4450
MINIO_CONSOLE_PORT=4451
```

Restartuj Docker:

```bash
docker compose up -d
```

U host nginx configu zamijeni:

```nginx
proxy_pass http://127.0.0.1:3333;
proxy_pass http://127.0.0.1:3333/socket.io/;
```

sa:

```nginx
proxy_pass http://127.0.0.1:4444;
proxy_pass http://127.0.0.1:4444/socket.io/;
```

Zatim:

```bash
nginx -t
systemctl reload nginx
```

### 9. Finalna provjera

```bash
dig farma.ice.lol
curl http://127.0.0.1:3333/health
curl http://farma.ice.lol/health
curl https://farma.ice.lol/health
docker compose ps
nginx -t
certbot renew --dry-run
```

Ako sve ovo prodje, FARMA OGLASI PRO radi na:

```text
https://farma.ice.lol
```
