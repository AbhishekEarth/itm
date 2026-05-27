# ITM Gwalior — Backend (FastAPI + PostgreSQL)

Production-grade CMS + RBAC backend for the ITM Gwalior website.
See **`../BACKEND_IMPLEMENTATION_PLAN.md`** for the full design.

---

## Quickstart (Docker, recommended)

```bash
cd backend
cp .env.example .env             # edit as needed
docker compose up -d --build
docker compose exec api alembic upgrade head
docker compose exec api python -m scripts.seed
```

- API:        http://localhost:8000/api
- Docs:       http://localhost:8000/api/docs
- Adminer:    http://localhost:8080      (server=db user=itm pass=itm db=itm)
- Health:     http://localhost:8000/api/health/ready

Default super-admin: `admin / admin123`  — **must be rotated on first login**.

## Quickstart (no Docker)

```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate          # Windows
# . .venv/bin/activate            # Linux/macOS
pip install -r requirements.txt
cp .env.example .env
# Point DATABASE_URL at your Postgres OR keep the SQLite fallback
alembic upgrade head
python -m scripts.seed
uvicorn app.main:app --reload --port 8000
```

## Common tasks

```bash
# new migration after editing models
alembic revision --autogenerate -m "add foo table"
alembic upgrade head

# run tests
pytest

# lint / format
ruff check .
ruff format .
```

## Layout

```
app/
  core/           config, db, security, rbac, storage, logging, errors
  models/         SQLAlchemy ORM
  schemas/        Pydantic request/response models
  routers/        FastAPI routers (one per resource)
  services/       business logic / side effects
  utils/          helpers
  deps.py         FastAPI dependencies (get_current_user, require())
  main.py         app factory
alembic/          migrations
scripts/          seed.py, migrate_from_sqlite.py
tests/            pytest suite
```

## Auth & RBAC at a glance

- `POST /api/auth/login`  — username + password  → `access_token` + `refresh_token` + `role` + `scopes`
- `POST /api/auth/refresh` — rotates the pair
- `POST /api/auth/logout`  — revokes the refresh token
- `GET  /api/auth/me`      — current user with scopes
- Scope registry: `app/core/rbac.py` (single source of truth)
- Endpoint protection: `dependencies=[Depends(require("placements.tap"))]`
- Super-admins bypass every scope check.

## Storage

- `STORAGE_BACKEND=local` writes to `UPLOAD_DIR` and serves under `/uploads/*` (dev).
- `STORAGE_BACKEND=s3` pushes to any S3-compatible bucket (Cloudflare R2 / Hostinger Object Storage / AWS).
- Adapter lives in `app/core/storage.py`.

## Production deploy

See **`../BACKEND_IMPLEMENTATION_PLAN.md`** §10–§11.
TL;DR: `docker compose up -d` behind nginx + Let's Encrypt on a Hostinger VPS; nightly `pg_dump` to S3; GitHub Actions for CI/CD.
