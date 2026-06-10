# FARMA OGLASI PRO - VPS deploy za farma.ice.lol

Ovaj vodic je pisan za deploy na VPS:

```text
IP: 13.140.166.66
Domain: farma.ice.lol
Postojeci sajt na istom VPS-u: hidzama.ice.lol
```

Cilj:

```text
https://farma.ice.lol
```

da otvara FARMA OGLASI PRO, sa:

- Docker
- Docker Compose
- PostgreSQL
- Redis
- MinIO
- backend
- frontend
- app nginx container
- host nginx reverse proxy
- SSL preko Let's Encrypt

## Arhitektura na VPS-u

Posto vec imas drugi sajt `hidzama.ice.lol`, host nginx na VPS-u treba drzati portove `80` i `443`.

FARMA OGLASI PRO Docker nginx ne treba direktno zauzeti port `80`, nego neka radi interno na npr:

```text
127.0.0.1:8088
```

Tok saobracaja:

```text
browser
  -> https://farma.ice.lol
  -> host nginx na VPS-u
  -> proxy_pass http://127.0.0.1:8088
  -> docker nginx
  -> frontend / backend / socket.io
```

## 1. DNS podesavanje

U free DNS panelu za `ice.lol` dodaj A record:

```text
Type: A
Name: farma
Value: 13.140.166.66
TTL: Auto ili 300
```

Provjera sa lokalnog racunara:

```bash
nslookup farma.ice.lol
```

Ocekivano:

```text
13.140.166.66
```

Ako DNS jos ne pokazuje IP, cekaj par minuta.

## 2. SSH na VPS

Sa svog racunara:

```bash
ssh root@13.140.166.66
```

Ako koristis drugog usera:

```bash
ssh USER@13.140.166.66
```

## 3. Update servera

Ubuntu/Debian:

```bash
apt update
apt upgrade -y
apt install -y ca-certificates curl gnupg git ufw nginx certbot python3-certbot-nginx
```

## 4. Firewall

Dozvoli samo javne portove:

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

Ne otvaraj PostgreSQL, Redis, backend i MinIO javno. U ovom setupu oni su bindani na `127.0.0.1`.

## 5. Instalacija Docker-a

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

## 6. Folder za aplikaciju

Preporuka:

```bash
mkdir -p /opt/farmaoglasipro
cd /opt/farmaoglasipro
```

## 7. Upload ili git clone projekta

Opcija A - git:

```bash
git clone https://github.com/TVOJ_USER/farmaoglasipro.git .
```

Opcija B - upload preko scp sa lokalnog racunara:

```bash
scp -r C:/programming/farmaoglasipro root@13.140.166.66:/opt/farmaoglasipro
```

Ako upload zavrsi kao `/opt/farmaoglasipro/farmaoglasipro`, udji u taj folder:

```bash
cd /opt/farmaoglasipro/farmaoglasipro
```

## 8. Production .env za farma.ice.lol

U root folderu projekta:

```bash
cp .env.example .env
nano .env
```

Stavi ovako, ali promijeni tajne vrijednosti:

```env
NODE_ENV=production
APP_URL=https://farma.ice.lol
API_URL=https://farma.ice.lol/api
PORT=4000
SOCKET_PORT=4001

NGINX_BIND=127.0.0.1
NGINX_PORT=8088

FRONTEND_BIND=127.0.0.1
FRONTEND_PORT=5173
BACKEND_BIND=127.0.0.1
BACKEND_PORT=4002
SOCKET_BIND=127.0.0.1
SOCKET_HOST_PORT=4003

POSTGRES_BIND=127.0.0.1
POSTGRES_PORT=5433
POSTGRES_DB=farma_oglasi
POSTGRES_USER=farma
POSTGRES_PASSWORD=OVDJE_STAVI_JAK_PASSWORD
DATABASE_URL=postgres://farma:OVDJE_STAVI_JAK_PASSWORD@postgres:5432/farma_oglasi

REDIS_BIND=127.0.0.1
REDIS_PORT=6380
REDIS_URL=redis://redis:6379

JWT_SECRET=OVDJE_STAVI_DUG_RANDOM_SECRET_MIN_32_CHAR
JWT_REFRESH_SECRET=OVDJE_STAVI_DRUGI_DUG_RANDOM_SECRET_MIN_32_CHAR

MINIO_BIND=127.0.0.1
MINIO_PORT=9000
MINIO_CONSOLE_BIND=127.0.0.1
MINIO_CONSOLE_PORT=9001
S3_ENDPOINT=http://minio:9000
S3_REGION=eu-central-1
S3_BUCKET=farma-media
S3_ACCESS_KEY=OVDJE_STAVI_MINIO_USER
S3_SECRET_KEY=OVDJE_STAVI_MINIO_PASSWORD
S3_PUBLIC_URL=https://farma.ice.lol/minio/farma-media

VITE_API_URL=/api
VITE_SOCKET_URL=/socket.io
VITE_APP_NAME=FARMA OGLASI PRO

GOOGLE_CLIENT_ID=
VITE_GOOGLE_CLIENT_ID=
```

Generisi secret-e:

```bash
openssl rand -hex 32
openssl rand -hex 32
```

## 9. Bitno za isti VPS sa hidzama.ice.lol

Ne smijes imati dva procesa koji slusaju isti port `80`.

Zato za FARMA Docker nginx koristimo:

```env
NGINX_BIND=127.0.0.1
NGINX_PORT=8088
```

Host nginx ostaje vlasnik portova:

```text
80
443
```

I samo prosljedjuje `farma.ice.lol` na `127.0.0.1:8088`.

## 10. Build i start aplikacije

U root folderu projekta:

```bash
docker compose build
docker compose up -d
```

Provjera:

```bash
docker compose ps
```

Trebas vidjeti:

```text
backend   Up
frontend  Up
nginx     Up
postgres  Up healthy
redis     Up healthy
minio     Up
```

Health test na VPS-u:

```bash
curl http://127.0.0.1:8088/health
```

Ocekivano:

```json
{"status":"ok","service":"farma-backend"}
```

## 11. Host nginx config za farma.ice.lol

Kreiraj config:

```bash
nano /etc/nginx/sites-available/farma.ice.lol
```

Ubaci:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name farma.ice.lol;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:8088;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:8088/socket.io/;
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

Aktiviraj:

```bash
ln -s /etc/nginx/sites-available/farma.ice.lol /etc/nginx/sites-enabled/farma.ice.lol
nginx -t
systemctl reload nginx
```

Test:

```bash
curl http://farma.ice.lol/health
```

## 12. SSL certifikat

Kad DNS pokazuje na `13.140.166.66` i HTTP radi:

```bash
certbot --nginx -d farma.ice.lol
```

Izaberi opciju redirect HTTP to HTTPS.

Provjera:

```bash
curl https://farma.ice.lol/health
```

Ocekivano:

```json
{"status":"ok","service":"farma-backend"}
```

Certbot auto-renew test:

```bash
certbot renew --dry-run
```

## 13. Login test

Otvori:

```text
https://farma.ice.lol/login
```

Demo super admin:

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
https://farma.ice.lol/admin
```

## 14. Test API-ja

Na VPS-u:

```bash
curl https://farma.ice.lol/health
curl https://farma.ice.lol/api/listings
```

Login API:

```bash
curl -X POST https://farma.ice.lol/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@farmaoglasi.pro","password":"Password123!"}'
```

## 15. MinIO na VPS-u

MinIO je bindan lokalno:

```text
127.0.0.1:9000
127.0.0.1:9001
```

To znaci nije javno otvoren, sto je sigurnije.

Ako hoces otvoriti MinIO console privremeno preko SSH tunela:

```bash
ssh -L 9001:127.0.0.1:9001 root@13.140.166.66
```

Onda lokalno otvori:

```text
http://localhost:9001
```

## 16. Backup baze

Backup:

```bash
cd /opt/farmaoglasipro
docker compose exec postgres pg_dump -U farma farma_oglasi > farma_oglasi_$(date +%F).sql
```

Restore:

```bash
cat farma_oglasi_YYYY-MM-DD.sql | docker compose exec -T postgres psql -U farma -d farma_oglasi
```

## 17. Update aplikacije

Ako koristis git:

```bash
cd /opt/farmaoglasipro
git pull
docker compose build
docker compose up -d
```

Ako uploadujes fajlove preko SCP, nakon upload-a:

```bash
docker compose build
docker compose up -d
```

## 18. Logovi

Backend:

```bash
docker compose logs backend --tail 100
```

Frontend:

```bash
docker compose logs frontend --tail 100
```

Nginx app container:

```bash
docker compose logs nginx --tail 100
```

Host nginx:

```bash
journalctl -u nginx -n 100 --no-pager
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 19. Ako farma.ice.lol ne otvara

Provjeri DNS:

```bash
dig farma.ice.lol
```

Provjeri host nginx:

```bash
nginx -t
systemctl status nginx
```

Provjeri Docker app:

```bash
curl http://127.0.0.1:8088/health
docker compose ps
docker compose logs backend --tail 100
```

Ako `127.0.0.1:8088/health` radi, a domen ne radi, problem je host nginx ili DNS.

Ako `127.0.0.1:8088/health` ne radi, problem je Docker aplikacija.

## 20. Ako se desi konflikt portova

Provjeri:

```bash
ss -tulpn | grep -E ':80|:443|:8088|:5433|:6380|:9000|:9001'
```

Ako je `8088` zauzet, promijeni u `.env`:

```env
NGINX_PORT=8090
```

I promijeni host nginx:

```nginx
proxy_pass http://127.0.0.1:8090;
```

Zatim:

```bash
docker compose up -d
nginx -t
systemctl reload nginx
```

## 21. Google SSO za farma.ice.lol

U Google Cloud Console dodaj:

Authorized JavaScript origins:

```text
https://farma.ice.lol
```

U `.env`:

```env
GOOGLE_CLIENT_ID=client-id.apps.googleusercontent.com
VITE_GOOGLE_CLIENT_ID=client-id.apps.googleusercontent.com
```

Rebuild:

```bash
docker compose build frontend backend
docker compose up -d
```

## 22. Production sigurnost

Obavezno:

- promijeni `POSTGRES_PASSWORD`
- promijeni `JWT_SECRET`
- promijeni `JWT_REFRESH_SECRET`
- promijeni `S3_ACCESS_KEY`
- promijeni `S3_SECRET_KEY`
- ne otvaraj PostgreSQL javno
- ne otvaraj Redis javno
- drzi MinIO console iza SSH tunela ili posebne zastite
- ukljuci firewall
- redovno radi backup baze

## 23. Finalni checklist

```bash
dig farma.ice.lol
curl http://127.0.0.1:8088/health
curl http://farma.ice.lol/health
curl https://farma.ice.lol/health
docker compose ps
certbot renew --dry-run
```

Ako sve ovo radi, deploy je zavrsen.

