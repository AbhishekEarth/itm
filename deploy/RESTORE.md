# Disaster recovery — restore the Postgres dump

Backups land at `s3://itm-backups/<YYYY>/<MM>/<DD>/<HHMMSS>.dump.gpg`, encrypted
to the `GPG_RECIPIENT` public key. To restore on the VPS (or any machine with
matching gpg key + Postgres):

```bash
# 1. Pull the dump
aws s3 cp s3://itm-backups/2026/06/15/030000.dump.gpg ./latest.dump.gpg \
  --endpoint-url $S3_ENDPOINT_URL

# 2. Decrypt
gpg --decrypt latest.dump.gpg > latest.dump

# 3. Drop & recreate (DESTRUCTIVE — only on a known-good target!)
docker compose exec db psql -U itm -c "DROP DATABASE IF EXISTS itm_restore;"
docker compose exec db psql -U itm -c "CREATE DATABASE itm_restore OWNER itm;"

# 4. Restore — `-Fc` custom format
docker compose exec -T db pg_restore -U itm -d itm_restore --clean --if-exists < latest.dump

# 5. Smoke-test the restored DB
docker compose exec db psql -U itm -d itm_restore -c "SELECT count(*) FROM users;"
docker compose exec db psql -U itm -d itm_restore -c "SELECT count(*) FROM departments;"

# 6. Cut over (downtime!)
docker compose stop api
docker compose exec db psql -U postgres -c "ALTER DATABASE itm RENAME TO itm_old_$(date +%s);"
docker compose exec db psql -U postgres -c "ALTER DATABASE itm_restore RENAME TO itm;"
docker compose start api
```

## Quarterly drill (calendar reminder for ops)
1. Spin up a sandbox VPS or local docker stack.
2. Pull yesterday's backup; restore into `itm_restore`.
3. Run `pytest tests --tb=short` against the sandbox.
4. Smoke `curl /api/health/ready` and `curl /api/public/home`.
5. Record drill outcome in `docs/restore-drills.md` (date, time-to-recover, issues).

## What the encryption key holder must do
- Keep an offline copy of the GPG private key (`gpg --export-secret-keys ...`).
- Print the fingerprint and store in a sealed envelope at the institute safe.
- Rotate annually — see `docs/RBAC.md` § Key rotation.
