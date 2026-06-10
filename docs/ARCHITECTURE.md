# Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                        Browser                                 │
│  React 19 SPA · Tailwind · Framer Motion · React Query · axios │
└──────────────────────────┬─────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────┴─────────────────────────────────────┐
│                       nginx (TLS, gzip+brotli)                 │
│   / → /var/www/itmgoi/dist        /uploads → /var/itm/uploads  │
│   /api/* → http://itm-api:8000    /sitemap.xml → /api/public/. │
└──────────────────────────┬─────────────────────────────────────┘
                           │
┌──────────────────────────┴─────────────────────────────────────┐
│                FastAPI (gunicorn + uvicorn workers)            │
│  ── middleware ─────────────────────────────────────────────── │
│   GZip · SecurityHeaders · SlowAPI rate limit · RequestId log  │
│   CORS allowlist                                               │
│  ── routers ────────────────────────────────────────────────── │
│   auth · users · audit · media · settings · pages              │
│   departments · placements · research · clubs · admissions     │
│   compliance · public · seo                                    │
│  ── services ───────────────────────────────────────────────── │
│   audit (with cache invalidation) · mailer · seo · images      │
│   media · storage (local | S3/R2)                              │
│  ── core ──────────────────────────────────────────────────── │
│   config (pydantic) · database · rbac · cache · ratelimit      │
│   security (Argon2 + JWT) · logging (structlog) · errors       │
└──────────────────────────┬───────────────────────────┬─────────┘
                           │                           │
                           │                           │
                ┌──────────┴─────────┐    ┌────────────┴─────────┐
                │   Postgres 16      │    │   Redis 7            │
                │   (named volume)   │    │  cache + ratelimit   │
                └────────────────────┘    └──────────────────────┘

         External: Cloudflare R2 / Hostinger Object Storage (media + backups)
         SMTP: Hostinger mail
```

## Source layout

```
backend/
  app/
    core/       config, database, security, rbac, cache, storage, logging, errors, seo
    models/     SQLAlchemy ORM (one file per domain group)
    schemas/    Pydantic v2 (one file per domain group)
    routers/    FastAPI APIRouters (auth, users, audit, media, settings, pages,
                departments, placements, research, clubs, admissions, compliance,
                public, seo, health)
    services/   audit, mailer, images, media, seo
    deps.py     get_current_user / require(scope) FastAPI dependencies
    main.py     app factory + middleware wiring
  alembic/
    versions/   0001 … 0008 (initial → compliance)
  scripts/      seed.py + per-domain seeders + import_departments + RESTORE.md
  tests/        pytest suite
  Dockerfile + docker-compose.yml (dev)
frontend/
  src/
    api/        typed axios resource clients (one per domain)
    hooks/      React Query wrappers
    components/ Header, Hero, RecruiterMarquee, Seo, AdmissionInquiryForm, …
    pages/      public pages
    pages/admin/ scoped admin pages (lazy-loaded)
    context/    AuthContext + ThemeContext
  vite.config.js  proxy + manualChunks (admin chunk split)
deploy/         nginx.conf · docker-compose.prod.yml · backup.sh · DEPLOY.md · RESTORE.md
docs/           DEMO.md · ARCHITECTURE.md · RBAC.md · API.md · REQUIREMENT_COVERAGE.md
postman/        itmgoi.postman_collection.json
.github/workflows/  ci.yml · deploy.yml
BACKEND_IMPLEMENTATION_PLAN.md   the original master plan
```

## Data model groups

| Group | Tables |
|---|---|
| Identity | users, scopes, user_scopes, refresh_tokens, login_attempts, audit_log |
| CMS spine | pages, page_sections, nav_menus, nav_items, media_assets, settings |
| Academics | departments, hod_profiles, faculty, laboratories, industry_partners, student_projects, student_awards |
| Placements / TAP | recruiters, recruiter_categories, placement_records, placement_statistics, tap_team_members, tap_services, mous, recruiter_testimonials, tap_events |
| Research | research_focus_areas, publications, books_and_chapters, patents, journal_issues, conferences, conference_papers, fdps, fdp_sessions, policy_documents |
| Events / Gallery | clubs_cells, events, notices, announcements, gallery_categories, gallery_items, videos |
| Admissions / Forms | admission_steps, required_documents, admission_counsellors, fee_components, quotas, admission_faqs, admission_timeline, admission_leads, contact_submissions, open_positions, job_applications, jrf_postings |
| Compliance / Alumni / People | naac_documents, naac_grades, nirf_records, committee_members, board_members, officials, alumni_profiles, alumni_chapters, alumni_mentorships |

## Cross-cutting

- **MetadataMixin** (slug + meta_title + meta_description + og_image_id +
  canonical_url + robots + is_published) is on every page-like table:
  `pages`, `departments`, `clubs_cells`.
- **TimestampMixin** (created_at, updated_at, created_by_user_id,
  updated_by_user_id) is on virtually every table — gives audit columns for free.
- **`scope_key`** column on `pages`, `departments`, `clubs_cells`, `gallery_categories`
  lets RBAC auto-route: a `dept.cse` editor automatically owns the CSE row,
  not via a hard-coded if-else.
- Public reads go through `/api/public/*` only — cached in Redis with a tag,
  invalidated on the matching write through `services.audit.record()`.
