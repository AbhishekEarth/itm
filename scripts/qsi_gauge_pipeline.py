"""
QSi_gauge -> R2 pipeline.

1. Reads R2 credentials from backend/.env.production
2. Downloads the public Google Drive folder to ./qsi_gauge_staging/
3. Uploads every file to R2 under the prefix QSi_gauge/<subfolder>/<file>
4. Prints the public CDN base so we can confirm the vercel.json rewrite

Run from the repo root:
    python scripts/qsi_gauge_pipeline.py [--skip-download] [--skip-upload]
"""
from __future__ import annotations

import argparse
import mimetypes
import os
import socket
import sys
import time
from pathlib import Path

# Router DNS is timing out — force Python's socket layer to use 8.8.8.8 / 1.1.1.1
# instead. Affects every requests/urllib3 call below.
def _install_dns_resolver() -> None:
    try:
        import dns.resolver  # type: ignore
    except ImportError:
        print("[dns] dnspython not installed; using system DNS (may fail)")
        return
    resolver = dns.resolver.Resolver(configure=False)
    resolver.nameservers = ["8.8.8.8", "1.1.1.1", "8.8.4.4"]
    resolver.timeout = 5
    resolver.lifetime = 10
    _cache: dict[str, list[str]] = {}

    _orig_getaddrinfo = socket.getaddrinfo

    def _resolve(host: str) -> list[str]:
        if host in _cache:
            return _cache[host]
        ips: list[str] = []
        for qtype in ("A", "AAAA"):
            try:
                ans = resolver.resolve(host, qtype, raise_on_no_answer=False)
                ips.extend(str(r) for r in ans)
            except Exception:
                pass
        _cache[host] = ips
        return ips

    def patched(host, port, *args, **kwargs):
        try:
            return _orig_getaddrinfo(host, port, *args, **kwargs)
        except socket.gaierror:
            ips = _resolve(host)
            if not ips:
                raise
            results = []
            for ip in ips:
                family = socket.AF_INET6 if ":" in ip else socket.AF_INET
                results.append((family, socket.SOCK_STREAM, 6, "", (ip, port)))
            return results

    socket.getaddrinfo = patched
    print("[dns] patched getaddrinfo -> 8.8.8.8 / 1.1.1.1 fallback")


_install_dns_resolver()

ROOT = Path(__file__).resolve().parents[1]
ENV_FILE = ROOT / "backend" / ".env.production"
STAGING = ROOT / "qsi_gauge_staging"
DRIVE_FOLDER_ID = "1c7BPbFQ9R4aVITOP4tAAh65iFtfNDybR"
R2_PREFIX = "QSi_gauge"

# Drive root folder is named "Qsi_gague_2025-26" — rename to QSi_gauge so URLs match.
EXPECTED_DRIVE_ROOT = "Qsi_gague_2025-26"


def load_env() -> dict[str, str]:
    from dotenv import dotenv_values
    if not ENV_FILE.exists():
        sys.exit(f"missing env file: {ENV_FILE}")
    env = dotenv_values(ENV_FILE)
    required = ["S3_ENDPOINT_URL", "S3_REGION", "S3_BUCKET", "S3_ACCESS_KEY", "S3_SECRET_KEY", "S3_PUBLIC_BASE_URL"]
    missing = [k for k in required if not env.get(k)]
    if missing:
        sys.exit(f"env missing keys: {missing}")
    return env


def download_drive() -> Path:
    import gdown
    STAGING.mkdir(parents=True, exist_ok=True)
    url = f"https://drive.google.com/drive/folders/{DRIVE_FOLDER_ID}"
    print(f"[download] gdown -> {STAGING}")
    # Retry the entire folder pull a handful of times. gdown.resume=True
    # makes each retry pick up where the previous one died.
    attempts = 8
    last_err: Exception | None = None
    for i in range(1, attempts + 1):
        try:
            gdown.download_folder(
                url=url,
                output=str(STAGING),
                quiet=False,
                use_cookies=False,
                resume=True,
            )
            last_err = None
            break
        except Exception as e:
            last_err = e
            print(f"[download] attempt {i}/{attempts} failed: {type(e).__name__}: {e}")
            if i < attempts:
                time.sleep(min(30, 4 * i))
    if last_err is not None:
        raise last_err
    # gdown creates a subfolder named after the Drive root.
    candidates = [p for p in STAGING.iterdir() if p.is_dir()]
    if not candidates:
        sys.exit(f"[download] nothing downloaded into {STAGING}")
    root = candidates[0]
    print(f"[download] done -> {root}")
    return root


def find_local_root() -> Path:
    if not STAGING.exists():
        sys.exit(f"[upload] staging dir {STAGING} doesn't exist — run without --skip-download first")
    # Prefer EXPECTED_DRIVE_ROOT, else the first folder we find.
    expected = STAGING / EXPECTED_DRIVE_ROOT
    if expected.exists():
        return expected
    candidates = [p for p in STAGING.iterdir() if p.is_dir()]
    if not candidates:
        sys.exit(f"[upload] no subdir in {STAGING}")
    return candidates[0]


def upload_to_r2(env: dict[str, str], local_root: Path) -> int:
    import boto3
    from botocore.config import Config

    client = boto3.client(
        "s3",
        endpoint_url=env["S3_ENDPOINT_URL"],
        region_name=env["S3_REGION"],
        aws_access_key_id=env["S3_ACCESS_KEY"],
        aws_secret_access_key=env["S3_SECRET_KEY"],
        config=Config(signature_version="s3v4", retries={"max_attempts": 5, "mode": "standard"}),
    )
    bucket = env["S3_BUCKET"]

    files = sorted(p for p in local_root.rglob("*") if p.is_file())
    total = len(files)
    print(f"[upload] {total} files -> r2://{bucket}/{R2_PREFIX}/")

    uploaded = 0
    skipped = 0
    bytes_sent = 0
    for i, f in enumerate(files, 1):
        rel = f.relative_to(local_root).as_posix()
        key = f"{R2_PREFIX}/{rel}"
        size = f.stat().st_size
        mime, _ = mimetypes.guess_type(f.name)
        mime = mime or "application/octet-stream"

        # Skip if already present with same size (idempotent re-runs).
        try:
            head = client.head_object(Bucket=bucket, Key=key)
            if head.get("ContentLength") == size:
                skipped += 1
                if i % 50 == 0 or i == total:
                    print(f"  [{i}/{total}] skip (exists) {key}")
                continue
        except client.exceptions.ClientError:
            pass

        try:
            client.upload_file(
                Filename=str(f),
                Bucket=bucket,
                Key=key,
                ExtraArgs={
                    "ContentType": mime,
                    "CacheControl": "public, max-age=31536000, immutable",
                },
            )
            uploaded += 1
            bytes_sent += size
            print(f"  [{i}/{total}] up   {size/1024:>9.1f} KiB  {key}")
        except Exception as e:
            print(f"  [{i}/{total}] FAIL {key}: {e}")

    print(f"[upload] uploaded={uploaded}, skipped={skipped}, sent={bytes_sent/1024/1024:.1f} MiB")
    return uploaded + skipped


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--skip-download", action="store_true")
    p.add_argument("--skip-upload", action="store_true")
    args = p.parse_args()

    env = load_env()
    print(f"[env] bucket={env['S3_BUCKET']}  cdn={env['S3_PUBLIC_BASE_URL']}")

    if args.skip_download:
        local_root = find_local_root()
    else:
        local_root = download_drive()

    if not args.skip_upload:
        upload_to_r2(env, local_root)

    print()
    print("=" * 60)
    print(f"Public base URL for /QSi_gauge/* rewrites: {env['S3_PUBLIC_BASE_URL']}")
    print(f"Sample: {env['S3_PUBLIC_BASE_URL'].rstrip('/')}/{R2_PREFIX}/06_Social_Responsibility/NSS_REPORT_2023-24.pdf")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
