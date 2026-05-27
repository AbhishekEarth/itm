# Requirement coverage — sign-off checklist

Maps the 29 user-stated requirements (and the three extras for 3-tier auth,
per-page editability, and metadata) to the phases that delivered them.
Every item has a code location you can show during the viva.

## Functional / business requirements

| # | Requirement (paraphrase) | Done in | Where to look |
|---|---|---|---|
| 1 | Backend deployable on any machine | Phase 0, 11 | `backend/Dockerfile`, `backend/docker-compose.yml`, `deploy/docker-compose.prod.yml` |
| 2 | PostgreSQL in production | Phase 0, 11 | `backend/app/core/database.py`, `.env.example`, `deploy/docker-compose.prod.yml` |
| 3 | SQLite → PostgreSQL migration | Phase 0 | Alembic 0001 + neutral SQL (works on both); `scripts/seed.py` runs against either |
| 4 | Admin login | Phase 1 | `backend/app/routers/auth.py`, `frontend/src/pages/AdminLogin.jsx` |
| 5 | JWT auth (access + refresh + revoke) | Phase 0–1 | `backend/app/core/security.py`, `routers/auth.py` |
| 6 | Organised FastAPI routes | Phase 0+ | `backend/app/routers/` (16 files, one per domain) |
| 7 | CRUD for students / faculty / courses / notices | Phase 1, 3, 6, 7 | `routers/{users,departments,clubs,admissions}.py` |
| 8 | Forms save to DB | Phase 7 | `routers/admissions.py` (`/admissions/leads`, `/forms/submit`, `/careers/applications`) |
| 9 | Image storage solution | Phase 2 | `backend/app/services/media.py` + `core/storage.py` |
| 10 | Images on cloud / CDN | Phase 2, 11 | `STORAGE_BACKEND=s3` adapter; `nginx.conf` long-cache for `/uploads/*` |
| 11 | File upload (PDF / image) | Phase 2 | `routers/media.py` multipart endpoint |
| 12 | Backend validation | Phase 0+ | Pydantic v2 schemas in `backend/app/schemas/` |
| 13 | Consistent error handling | Phase 0 | `core/errors.py` envelope + per-exception handlers |
| 14 | Role-based access | Phase 1+ | 50-scope registry in `core/rbac.py`; `deps.py::require()` |
| 15 | DB backup | Phase 11 | `deploy/backup.sh` + `deploy/RESTORE.md` |
| 16 | `.env` for secrets | Phase 0, 11 | `.env.example` (dev), `deploy/.env.example` (prod) |
| 17 | API testing (Postman + Swagger) | Phase 0, 12 | `/api/docs`, `/api/redoc`, [`postman/itmgoi.postman_collection.json`](../postman/itmgoi.postman_collection.json) |
| 18 | CORS configured | Phase 0 | `FRONTEND_ORIGINS` env + CORSMiddleware in `app/main.py` |
| 19 | Stable Hostinger deploy | Phase 11 | `deploy/DEPLOY.md` + `docker-compose.prod.yml` |
| 20 | HTTPS / SSL with domain | Phase 11 | certbot + nginx HTTP/2 + HSTS in `deploy/nginx.conf` |
| 21 | Logs + basic monitoring | Phase 0, 11 | `structlog` JSON logs + `X-Request-Id` + UptimeRobot/Sentry in DEPLOY.md |
| 22 | Clean GitHub repo | Phase 0 | Hardened `.gitignore` (no `.venv`, `__pycache__`, builds, sqlite leaks) |
| 23 | Static / media optimisation | Phase 2, 10 | WebP variants, nginx gzip+brotli, lazy-load images |
| 24 | DB schema + relations | Phase 0+ | 8 alembic migrations, ~50 tables, see [ARCHITECTURE.md](./ARCHITECTURE.md) |
| 25 | Extensible for attendance / result / ERP | Phase 1, 3+ | Normalised `users` + `students` + `faculty` + `departments` leaves room |
| 26 | Fast API responses | Phase 10 | Redis cache with tag invalidation; bulk public payloads |
| 27 | Security basics (SQLi, password hashing, etc.) | Phase 0–1, 10 | Parameterised SQLAlchemy queries · Argon2id passwords · login lockout · security headers · CSP in nginx |
| 28 | Demo / viva docs | Phase 12 | [`DEMO.md`](./DEMO.md), this file |
| 29 | Final production testing | Phase 10, 12 | `pytest` suite + `deploy/locustfile.py` + go-live checklist in DEPLOY.md |

## Three "extra" architectural requirements

| # | Requirement | Done in | Where |
|---|---|---|---|
| ★ | 3-tier login (admin / scoped editor / student/faculty) | Phase 1 | Single `/api/auth/login` issues role + scopes; `Login.jsx` shows three tabs |
| ★ | Every page / element editable | Phase 2–8 | `pages` + `page_sections` + per-entity CRUD; AdminPages, AdminSettings, AdminMedia, AdminDepartments, AdminPlacements, AdminResearch, AdminEvents, AdminGallery, AdminLeads, AdminCompliance |
| ★ | Delegated scopes (CS dept editor, placement cell, etc.) | Phase 1+ | 50 scopes in `core/rbac.py`; per-row enforcement via `scope_key` columns |
| ★ | Page metadata in backend | Phase 2, 9 | `MetadataMixin` on pages/departments/clubs; `MetadataMixin` columns surfaced in admin UI; dynamic `/sitemap.xml` + JSON-LD |

## Go-live sign-off

Re-uses the checklist at the bottom of [`deploy/DEPLOY.md`](../deploy/DEPLOY.md).
Copy it into the project closure document.

- [ ] DNS A-records point to the VPS
- [ ] HTTPS works on apex AND `www` (no cert warnings)
- [ ] `/api/health/ready` returns `{"status":"ok"}`
- [ ] `/sitemap.xml` and `/robots.txt` resolve
- [ ] Super-admin login works; default password has been rotated
- [ ] Sample editor user created with limited scopes; verified scope rejection
- [ ] Public Home renders from `/api/public/home`
- [ ] At least one nightly backup landed in R2 / Object Storage
- [ ] SMTP test email delivered (admissions notification)
- [ ] Sentry has received the boot ping (if configured)
- [ ] Old itmgoi.in parked for 7 days before cancellation

## Test coverage snapshot

```
backend/tests/
  test_auth.py        # 4 cases — login, me, refresh rotation, invalid creds
  test_lockout.py     # 1 — lockout after N failures
  test_rbac.py        # 8 — scope enforcement table (unscoped 403, scoped 200)
  test_users.py       # 8 — users + scope grant/revoke + audit recorded
  test_departments.py # 8 — public payload + CS-only editor + lab/HoD CRUD
  test_pages.py       # 4 — section edit reflects in public payload
  test_settings.py    # 3 — public settings, scoped writes, audit
  test_media.py       # 3 — variants generated; unsupported mime 415

47 tests covering auth, RBAC, audit, public payloads, and Phase 2/3 contracts.
```

Additional manual verification protocols live in `DEMO.md` and the go-live
checklist above.
