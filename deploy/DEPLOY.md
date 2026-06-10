# Production deployment — Hostinger VPS

Single-VPS topology: nginx terminates TLS, proxies `/api/*` to the FastAPI container,
serves the React bundle from `/var/www/itmgoi/dist`, serves user uploads from
`/var/itm/uploads`. Postgres + Redis run in the same compose stack but bound to
`127.0.0.1`, so they're never exposed to the internet.

```
   Internet ──▶ nginx :443  ──┬──▶ React static (/var/www/itmgoi/dist)
                              ├──▶ /api/* ──▶ itm-api :8000 ──▶ itm-db :5432
                              │                           └──▶ itm-redis :6379
                              └──▶ /uploads/* ──▶ /var/itm/uploads
```

---

## 0. One-time prep on the VPS  (~30 min)

Connect with the SSH key Hostinger gave you, then:

```bash
# Update & basic hardening
apt-get update && apt-get -y upgrade
ufw allow 22,80,443/tcp && ufw --force enable
adduser --gecos "" deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy: ~/.ssh /home/deploy/

# Disable root SSH & password auth
sed -i 's/^#*PermitRootLogin .*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl reload ssh

# Docker + nginx + certbot + brotli
apt-get -y install ca-certificates curl gnupg lsb-release
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
apt-get -y install nginx libnginx-mod-brotli certbot python3-certbot-nginx
usermod -aG docker deploy
```

## 1. DNS

In Hostinger DNS panel:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A    | `@`  | `<vps_ipv4>` | 300 |
| A    | `www`| `<vps_ipv4>` | 300 |
| AAAA | `@`  | `<vps_ipv6>` (if assigned) | 300 |
| CNAME| `cdn`| `<r2_public_bucket_url>` | 300 |

> Use TTL 300 for the first 24 h so you can cut back quickly if anything's wrong.

## 2. SSL

```bash
certbot --nginx -d itmgoi.in -d www.itmgoi.in --redirect --hsts \
  -m ops@itmgoi.in --agree-tos --no-eff-email
certbot renew --dry-run
```

## 3. Filesystem layout

```bash
mkdir -p /opt/itmgoi /var/itm/uploads /var/itm/pgdata /var/itm/backups /var/www/itmgoi/dist
chown -R deploy:deploy /opt/itmgoi /var/itm /var/www/itmgoi
```

## 4. Drop in the compose stack

```bash
sudo -u deploy bash <<'EOF'
cd /opt/itmgoi
cp /path/to/repo/deploy/docker-compose.prod.yml docker-compose.yml
cp /path/to/repo/deploy/.env.example .env       # edit with real values + secrets
cp /path/to/repo/deploy/backup.sh backup.sh
chmod 600 .env
chmod +x backup.sh
EOF
```

Edit `/opt/itmgoi/.env` and fill in:

- `POSTGRES_PASSWORD`  →  `openssl rand -base64 32`
- `JWT_SECRET`         →  `python3 -c "import secrets;print(secrets.token_urlsafe(48))"`
- `DEFAULT_ADMIN_PASSWORD` → strong one-time password (rotate on first login)
- `S3_*`               →  R2 / Hostinger object storage keys
- `S3_BACKUP_BUCKET`   →  separate bucket
- `GPG_RECIPIENT`      →  `gpg --import ops_pubkey.asc` first, then put the email here
- `SMTP_*`             →  Hostinger mail
- `SENTRY_DSN`         →  optional

## 5. nginx

```bash
cp /path/to/repo/deploy/nginx.conf /etc/nginx/sites-available/itmgoi.conf
ln -sf /etc/nginx/sites-available/itmgoi.conf /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

## 6. First boot

```bash
cd /opt/itmgoi
docker compose pull           # pulls ghcr.io/...itmgoi-api:latest
docker compose up -d db redis
docker compose run --rm api alembic upgrade head
docker compose run --rm api python -m scripts.seed
docker compose up -d api backup
docker compose ps
curl -fsS http://127.0.0.1:8000/api/health/ready
```

## 7. Push the React bundle

From your laptop or via GitHub Actions:

```bash
rsync -avz --delete frontend/dist/ deploy@<vps>:/var/www/itmgoi/dist/
```

Visit `https://itmgoi.in` — homepage, `/admin/login`, public payloads all live.

## 8. Cut-over from old itmgoi.in

24 h ahead:
- Lower DNS TTL on the OLD host to 300.
- Subscribe to the new host's Sentry / uptime alerts.

Cut-over hour:
1. Stop new-content edits in the OLD admin.
2. Re-run `scripts/import_legacy_content.py` against the OLD scraped JSON (one-shot, idempotent).
3. Flip A-records to the new VPS.
4. Watch `journalctl -u nginx -f` + `docker logs -f itm-api` for the first hour.
5. Run `curl -fsS https://itmgoi.in/api/health/ready`.

## 9. Monitoring

- **UptimeRobot** (free): HTTP monitor every 5 min on `https://itmgoi.in/api/health/ready`.
- **Sentry** (free): paste `SENTRY_DSN` into `.env` and restart api.
- **Hostinger panel**: CPU + RAM alerts at 80%.
- **GitHub Actions**: deploys auto-run on push to `main`; failures send email.

## 10. Backups & restore

- Backups: see `backup.sh` (mounted into `itm-backup`, cron 03:00 IST daily).
- Restore drill: see [`RESTORE.md`](./RESTORE.md). Run quarterly.

---

## Common operations

| Need to … | Run on the VPS |
|---|---|
| See logs           | `docker compose logs -f api` |
| Restart API only   | `docker compose restart api` |
| Update API image   | `docker compose pull api && docker compose up -d api` (GitHub Actions does this automatically) |
| Open a DB shell    | `docker compose exec db psql -U itm -d itm` |
| Rotate JWT secret  | edit `.env` → `docker compose up -d api` (forces all sessions to re-login) |
| Wipe Redis cache   | `docker compose exec redis redis-cli FLUSHALL` |
| Force a backup     | `docker compose exec backup /usr/local/bin/backup.sh` |
| One-off seed step  | `docker compose run --rm api python -m scripts.seed_research` |

---

## Sign-off checklist for go-live

- [ ] DNS points to the VPS (verified via `dig +short itmgoi.in`)
- [ ] HTTPS works on apex AND www (no certificate warnings)
- [ ] `https://itmgoi.in/api/health/ready` returns `{"status":"ok"}`
- [ ] `https://itmgoi.in/sitemap.xml` returns a valid `urlset`
- [ ] `https://itmgoi.in/robots.txt` returns the right disallow rules
- [ ] Super-admin can log in at `/admin/login`
- [ ] Default super-admin password has been changed
- [ ] First nightly backup landed in R2 (check tomorrow morning)
- [ ] Sentry has received the test event
- [ ] Cloudflare R2 / object storage bucket is **not** publicly listable (only objects)
- [ ] Old VPS / shared-hosting plan parked for a week before cancellation
