# FARMA OGLASI PRO - deploy na farma.ice.lol

Ovaj dokument je konkretan plan da dodas FARMA OGLASI PRO kao novu stranicu:

```text
farma.ice.lol
```

na isti VPS:

```text
13.140.166.66
```

gdje vec postoje:

```text
hidzama.ice.lol
vozilo.ice.lol
```

Plan je da FARMA radi preko Docker Compose-a na internom portu:

```text
127.0.0.1:3333
```

Ako je `3333` zauzet, koristi:

```text
127.0.0.1:4444
```

Host nginx ce preusmjeriti:

```text
https://farma.ice.lol -> http://127.0.0.1:3333
```

## 1. DNS

U DNS panelu dodaj:

```text
Type: A
Name: farma
Value: 13.140.166.66
TTL: Auto
```

Provjeri:

```bash
dig farma.ice.lol
```

Treba vratiti:

```text
13.140.166.66
```

## 2. SSH na VPS

```bash
ssh root@13.140.166.66
```

## 3. Napravi folder

```bash
mkdir -p /opt/farma
cd /opt/farma
```

## 4. Prebaci kod

Opcija A - git clone:

```bash
git clone https://github.com/TVOJ_USER/farmaoglasipro.git .
```

Opcija B - upload sa lokalnog racunara:

```bash
scp -r C:/programming/farmaoglasipro root@13.140.166.66:/opt/farma
```

Ako se napravi folder `/opt/farma/farmaoglasipro`, udji u njega:

```bash
cd /opt/farma/farmaoglasipro
```

## 5. Production .env

U root folderu projekta:

```bash
cp .env.example .env
nano .env
```

Stavi ovaj primjer:

```env
NODE_ENV=production
APP_URL=https://farma.ice.lol
API_URL=https://farma.ice.lol/api
PORT=4000
SOCKET_PORT=4001

# Docker app nginx interno na VPS-u.
# Host nginx ce proxy raditi na ovaj port.
NGINX_BIND=127.0.0.1
NGINX_PORT=3333

# Direktni container portovi samo lokalno na VPS-u.
FRONTEND_BIND=127.0.0.1
FRONTEND_PORT=3334
BACKEND_BIND=127.0.0.1
BACKEND_PORT=3335
SOCKET_BIND=127.0.0.1
SOCKET_HOST_PORT=3336

# Baza i cache samo lokalno.
POSTGRES_BIND=127.0.0.1
POSTGRES_PORT=3337
POSTGRES_DB=farma_oglasi
POSTGRES_USER=farma
POSTGRES_PASSWORD=PROMIJENI_OVO_JAK_PASSWORD
DATABASE_URL=postgres://farma:PROMIJENI_OVO_JAK_PASSWORD@postgres:5432/farma_oglasi

REDIS_BIND=127.0.0.1
REDIS_PORT=3338
REDIS_URL=redis://redis:6379

JWT_SECRET=STAVI_DUG_RANDOM_SECRET_32_PLUS_CHAR
JWT_REFRESH_SECRET=STAVI_DRUGI_DUG_RANDOM_SECRET_32_PLUS_CHAR

# MinIO samo lokalno. Console otvaraj preko SSH tunela.
MINIO_BIND=127.0.0.1
MINIO_PORT=3339
MINIO_CONSOLE_BIND=127.0.0.1
MINIO_CONSOLE_PORT=3340
S3_ENDPOINT=http://minio:9000
S3_REGION=eu-central-1
S3_BUCKET=farma-media
S3_ACCESS_KEY=PROMIJENI_MINIO_USER
S3_SECRET_KEY=PROMIJENI_MINIO_PASSWORD
S3_PUBLIC_URL=https://farma.ice.lol/minio/farma-media

VITE_API_URL=/api
VITE_SOCKET_URL=/socket.io
VITE_APP_NAME=FARMA OGLASI PRO

GOOGLE_CLIENT_ID=
VITE_GOOGLE_CLIENT_ID=

STRIPE_SECRET_KEY=sk_test_replace
PAYPAL_CLIENT_ID=replace
PAYPAL_CLIENT_SECRET=replace
MONRI_AUTH_TOKEN=replace
```

Ako zelis koristiti port `4444` umjesto `3333`, promijeni:

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

I kasnije u host nginx configu koristi:

```nginx
proxy_pass http://127.0.0.1:4444;
```

## 6. Generisi secret-e

Na VPS-u:

```bash
openssl rand -hex 32
openssl rand -hex 32
```

Prvi stavi u:

```env
JWT_SECRET=
```

Drugi stavi u:

```env
JWT_REFRESH_SECRET=
```

## 7. Build i start Docker aplikacije

```bash
docker compose build
docker compose up -d
```

Provjera:

```bash
docker compose ps
```

Health lokalno na VPS-u:

```bash
curl http://127.0.0.1:3333/health
```

Ocekivano:

```json
{"status":"ok","service":"farma-backend"}
```

Ako koristis port `4444`:

```bash
curl http://127.0.0.1:4444/health
```

## 8. Host nginx za farma.ice.lol

Kreiraj config:

```bash
nano /etc/nginx/sites-available/farma.ice.lol
```

Ubaci za port `3333`:

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

Ako koristis `4444`, zamijeni oba:

```text
127.0.0.1:3333
```

sa:

```text
127.0.0.1:4444
```

Aktiviraj:

```bash
ln -s /etc/nginx/sites-available/farma.ice.lol /etc/nginx/sites-enabled/farma.ice.lol
nginx -t
systemctl reload nginx
```

## 9. Test HTTP prije SSL-a

```bash
curl http://farma.ice.lol/health
```

Ako radi, dobit ces:

```json
{"status":"ok","service":"farma-backend"}
```

Ako ne radi:

```bash
curl http://127.0.0.1:3333/health
nginx -t
docker compose ps
docker compose logs backend --tail 100
```

## 10. SSL certifikat

Kada HTTP radi:

```bash
certbot --nginx -d farma.ice.lol
```

Izaberi redirect na HTTPS.

Test:

```bash
curl https://farma.ice.lol/health
```

Certbot renew test:

```bash
certbot renew --dry-run
```

## 11. Browser test

Otvori:

```text
https://farma.ice.lol
```

Login:

```text
https://farma.ice.lol/login
```

Super admin:

```text
superadmin@farmaoglasi.pro
Password123!
```

Admin:

```text
https://farma.ice.lol/admin
```

## 12. Postojeci domeni ne smiju stati

Provjeri:

```bash
curl -I https://hidzama.ice.lol
curl -I https://vozilo.ice.lol
curl -I https://farma.ice.lol
```

Ako `hidzama` ili `vozilo` prestanu raditi, vjerovatno si pregazio nginx config ili port `80`.

Farma Docker treba biti na:

```text
127.0.0.1:3333
```

a ne direktno na:

```text
0.0.0.0:80
```

## 13. Logovi

Farma Docker:

```bash
cd /opt/farma/farmaoglasipro
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

## 14. Update farme

Ako je git:

```bash
cd /opt/farma/farmaoglasipro
git pull
docker compose build
docker compose up -d
```

Ako uploadujes rucno, nakon upload-a:

```bash
cd /opt/farma/farmaoglasipro
docker compose build
docker compose up -d
```

## 15. Backup baze

```bash
cd /opt/farma/farmaoglasipro
docker compose exec postgres pg_dump -U farma farma_oglasi > farma_backup_$(date +%F).sql
```

Restore:

```bash
cat farma_backup_YYYY-MM-DD.sql | docker compose exec -T postgres psql -U farma -d farma_oglasi
```

## 16. MinIO console preko SSH tunela

Ako koristis port `3340` za MinIO console:

```bash
ssh -L 3340:127.0.0.1:3340 root@13.140.166.66
```

Otvori lokalno:

```text
http://localhost:3340
```

## 17. Brzi troubleshooting

DNS:

```bash
dig farma.ice.lol
```

Docker health:

```bash
curl http://127.0.0.1:3333/health
```

Nginx health:

```bash
curl http://farma.ice.lol/health
```

SSL health:

```bash
curl https://farma.ice.lol/health
```

Portovi:

```bash
ss -tulpn | grep -E ':80|:443|:3333|:4444'
```

Ako `3333` ne radi, prebaci na `4444` u `.env` i nginx configu.

