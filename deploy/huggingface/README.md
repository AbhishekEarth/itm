---
title: ITM Gwalior API
emoji: 🎓
colorFrom: red
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
short_description: FastAPI backend for the ITM Gwalior website CMS.
---

# ITM Gwalior API — Hugging Face Space

FastAPI + SQLAlchemy + Alembic backend powering the ITM Gwalior website CMS.
Source repo: <https://github.com/AnshulSharma9340/ITMGOI-Frontend>

## What this Space does

- Boots a Python 3.11 image, installs the API, runs `alembic upgrade head`
  and `python -m scripts.seed` on every container start (idempotent), then
  serves `uvicorn` on port 7860 — which HF Spaces exposes at
  `https://<owner>-itmgoi-api.hf.space/`.
- The full CMS API is at `/api/*`; OpenAPI docs at `/api/docs`.

## Storage caveat (read this!)

The **free** HF Spaces tier has **ephemeral** storage:

- Anything written under `/home/user/data/{uploads,db}` survives container
  restarts only as long as the Space stays warm. When the Space sleeps and
  cold-boots, **the SQLite DB is wiped and re-seeded** with the default
  super-admin + sample editors.
- For long-lived admin edits, either (a) enable HF
  [Persistent Storage](https://huggingface.co/docs/hub/spaces-storage)
  (paid), or (b) point `DATABASE_URL` at a managed Postgres
  (Neon / Supabase / Railway) and `STORAGE_BACKEND=s3` at Cloudflare R2.

## Required Space secrets (Settings → Variables and secrets)

| Variable | Value |
|---|---|
| `JWT_SECRET` | a 48-char random string (`python -c "import secrets;print(secrets.token_urlsafe(48))"`) |
| `FRONTEND_ORIGINS` | `https://<your-vercel-app>.vercel.app` (comma-separated for multiple) |
| `DEFAULT_ADMIN_PASSWORD` | strong password; rotate via the admin UI after first login |
| `SMTP_HOST` `SMTP_USER` `SMTP_PASSWORD` `SMTP_FROM` | optional, for admission-lead notifications |

(The Dockerfile sets sensible defaults for `DATABASE_URL`, `UPLOAD_DIR`,
`STORAGE_BACKEND`, `REDIS_URL`, `ENV` — override only if you need to.)

## Default seeded accounts

| Role | Username | Password |
|---|---|---|
| Super-admin | `admin` | value of `DEFAULT_ADMIN_PASSWORD` (or `admin123`) |
| CS dept editor | `cs_editor` | `cs-editor@123` |
| Placement editor | `placement_editor` | `placement@123` |
| Faculty | `faculty@itmgoi.in` | `faculty@123` |
| Student | `ITM2022CS001` | `ITM2022CS001` |

## Quick health check

After the Space finishes building (~3 min):

```bash
curl https://<owner>-itmgoi-api.hf.space/api/health/ready
# {"status":"ok","db":"ok"}

curl https://<owner>-itmgoi-api.hf.space/api/public/home | head -c 200
```

If you see a 503 or "Space is starting up", the container is still warming.

## Updating

Push to the Space's git remote (HF gives you one). On every push, the Space
rebuilds and re-deploys; the next request triggers a fresh migrate + seed.
