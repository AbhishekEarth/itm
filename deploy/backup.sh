#!/bin/sh
# Nightly DB backup → encrypted upload to S3/R2.
# Mounted into the `backup` container; cron triggers it daily at 03:00 IST.

set -eu

STAMP=$(date -u +%Y/%m/%d/%H%M%S)
OUT="/var/itm/backups/itm-${STAMP}.dump.gpg"
mkdir -p "$(dirname "$OUT")"

# 1. pg_dump in custom format
pg_dump -Fc -d "$DATABASE_URL" \
  | gpg --batch --yes --trust-model always \
        --encrypt --recipient "${GPG_RECIPIENT:-ops@itmgoi.in}" \
        --output "$OUT"

SIZE=$(wc -c <"$OUT")
echo "[backup] dump=$OUT size=$SIZE"

# 2. Push to S3-compatible bucket
if [ -n "${S3_BACKUP_BUCKET:-}" ]; then
  export AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY"
  export AWS_SECRET_ACCESS_KEY="$S3_SECRET_KEY"
  export AWS_DEFAULT_REGION="${S3_REGION:-auto}"
  EP=""
  [ -n "${S3_ENDPOINT_URL:-}" ] && EP="--endpoint-url $S3_ENDPOINT_URL"
  aws s3 cp $EP "$OUT" "s3://$S3_BACKUP_BUCKET/$STAMP.dump.gpg" --only-show-errors
  echo "[backup] uploaded → s3://$S3_BACKUP_BUCKET/$STAMP.dump.gpg"
fi

# 3. Prune locally older than 7 days
find /var/itm/backups -name "*.dump.gpg" -mtime +7 -delete || true

echo "[backup] done"
