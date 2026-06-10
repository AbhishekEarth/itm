# Viva / Demo Script

A 15-minute live walkthrough you can run from a single laptop. Optimised
for a panel reviewer or examiner who wants to see the system actually work
end-to-end (not just slides).

> **Before you start**: `docker compose up -d` from `backend/`, then
> `cd frontend && npm run dev`. Open three browser windows side-by-side:
> A = public website (`http://localhost:5173`), B = admin panel,
> C = the FastAPI docs at `http://localhost:8000/api/docs`.

---

## 1 · Hero introduction (2 min)

> "ITM Gwalior's old site is a static HTML build with no CMS. We've replaced it
> with a FastAPI + PostgreSQL backend and a React 19 SPA. Every text block,
> image and PDF on the public site is now editable by the right people."

- Open Window **A** → home page loads.
- Open DevTools → Network → reload. Point out the calls:
  - `/api/public/home` (hero + sections)
  - `/api/public/settings` (brand, contact, social)
  - `/api/public/recruiters` (marquee logos)
  - `/api/public/events` (upcoming events)
- Open Window **C** → `/api/docs` — show the auto-generated OpenAPI. Scroll
  through tags: auth, users, departments, placements, research, gallery, etc.

## 2 · The three login tiers (2 min)

> "Three classes of accounts: super-admin, scoped editor, and student/faculty
> (read-only)."

- Window **B** → `/login`. Three tabs visible.
- Login as **`admin / admin123`** (super-admin tab).
  - Land on `/admin`. 14 tiles. Point out scopes mentioned under each tile.
- Logout. Login as **`cs_editor / cs-editor@123`** in the Admin tab.
  - Land on `/admin`. Same UI, but only the CS-relevant tiles light up.
  - Click **Departments** → only CSE is visible.
  - Click **Inbox** → 403 (no `admissions.leads` scope). Show the toast.
- Logout. Login as **`ITM2022CS001 / ITM2022CS001`** in the Student tab → lands
  on `/student/dashboard` (read-only).

## 3 · Edit something & watch the public site refresh (3 min)

Stay logged in as **`cs_editor`** for this segment.

- `/admin/departments` → CSE tab → **Labs** sub-tab.
- Click **Add new** → name `Quantum Computing Lab`, icon `⚛️`, description
  `Hands-on Qiskit + IBM Q Experience access.` → Save.
- Switch to Window **A** → reload `/cs` → new lab appears in the Laboratories
  section. (React Query also auto-invalidates so a tab open before the edit
  refreshes within a few seconds.)
- Show that `cs_editor` cannot edit ECE:
  - In Window **C**, hit `POST /api/departments/ECE/labs` (use "Authorize" with
    the cs_editor's bearer token from `/api/auth/login`). Returns `403`.

## 4 · Forms → inbox (2 min)

- Window **A** → `/admissions/how-to-apply` → scroll to bottom → **Quick
  admissions enquiry** form.
- Fill in `Anjali Sharma` / `anjali@example.com` / `+91-9876543210` /
  `B.Tech CSE` / `Pune` / "Want to know early-bird dates." → Submit.
- See the success card.
- Window **B** → still as cs_editor? logout and login as **`admin`**.
  - Click **Leads & Inbox** → **Admission Leads** tab → the new lead is row #1.
  - Click the row → side drawer → change status to `contacted` → Save.
- (If SMTP is configured: a notification email lands at
  `admin@itmgoi.in` in the same minute. Otherwise the email is silently
  skipped — the API never blocks on email.)

## 5 · Gallery — bulk upload (2 min)

- Window **B** as admin → **Gallery** tile.
- Pick the **Cultural Events** category.
- Drag-drop 5–6 images from the desktop into the **Bulk upload** button.
- Watch the thumbnails appear within a couple of seconds.
- Window **A** → `/gallery/cultural` → the new photos are live (after
  React Query refetch, ~5 seconds).
- Mention: each upload goes through `app/services/media.py` which
  Pillow-resizes to `thumb` / `card` / `hero` WebP variants and stores
  on disk or R2 depending on `STORAGE_BACKEND`.

## 6 · SEO / sitemap (1 min)

- Window **A** → `/sitemap.xml` → dynamic XML lists pages, departments,
  clubs, gallery categories, conferences, events, alumni, positions.
- `/robots.txt` → shows the Sitemap URL.
- Inspect the home page → `view-source:` shows the proper `<title>`,
  `<meta name=description>`, OpenGraph + Twitter cards + JSON-LD
  `CollegeOrUniversity`.
- Department page `/cs` → JSON-LD switches to `EducationalOrganization`.

## 7 · Audit log + cache (1 min)

- Window **C** → expand `audit` tag → `GET /api/audit?entity_type=lab` with
  the admin token → see the lab create from §3.
- Mention that every mutation calls `services.audit.record()` which **also**
  fires `cache.invalidate_tags()` on the relevant tags
  (`public`, `departments`, etc.) — that's why §3 felt instant.

## 8 · Operations highlights (1 min)

Quick walk through `deploy/`:

- `nginx.conf` — HTTP/2, gzip + brotli, long-cache `/assets/*`, CSP, HSTS.
- `docker-compose.prod.yml` — api + postgres + redis + nightly `backup`
  sidecar, all internal-only.
- `.github/workflows/deploy.yml` — every push to `main` builds the API
  image, pushes to GHCR, rsyncs the SPA, runs migrations, restarts API.
- `backup.sh` — `pg_dump | gpg --encrypt | aws s3 cp` daily.
- `RESTORE.md` — quarterly DR drill protocol.

## 9 · Wrap (1 min)

> "Stack: FastAPI + SQLAlchemy + Alembic + Postgres 16 + Redis 7, with a React
> 19 / Vite / TailwindCSS / React Query / Lucide frontend. 287 API routes,
> 8 alembic migrations, 50 RBAC scopes, ~30 SQLAlchemy models. The public
> website is read-only and cached; every editable block on every page has a
> scoped admin owner; uploads go to S3-compatible object storage; backups
> are encrypted nightly."

---

## Troubleshooting on the day

| Symptom | Fix |
|---|---|
| `/api/auth/login` returns 401 with `admin/admin123` | Re-run `python -m scripts.seed` once |
| `/api/public/recruiters` returns 500 | Likely `seed_placements.py` skipped — re-run |
| Gallery upload says "FILE_TOO_LARGE" | Increase `MAX_UPLOAD_MB_IMAGE` in `.env`, restart api |
| Frontend stuck on "Loading admin…" | Bundle hash mismatch — hard-reload the browser |
| Lead doesn't appear in inbox | Pull the row from `psql`: `select * from admission_leads order by created_at desc limit 5;` |
