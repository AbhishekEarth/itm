# ITM Gwalior Backend — Production Implementation Plan

> Owner: Engineering team
> Frontend: `frontend/` (React 18 + Vite + Tailwind + React-Router-v6 + Axios)
> Target backend: `backend/` (FastAPI + SQLAlchemy 2 + Alembic + PostgreSQL 16)
> Storage: S3-compatible (Hostinger Object Storage / Cloudflare R2) for media
> Deploy: Docker → Hostinger VPS (Ubuntu 22.04) behind Nginx + Let's Encrypt
> Auth: JWT (access + refresh) + 3-tier RBAC (super-admin · scoped editor · student)

---

## 0. Why this exists

The website currently hardcodes hundreds of content blocks (hero slides, programmes, faculty, labs, recruiters, testimonials, placements, gallery, events, MoUs, research outputs). To replace the legacy CMS at `itmgoi.in` we need a backend that:

1. Stores **every editable element** of every page in a database.
2. Lets a **super-admin** edit anything.
3. Lets **delegated editors** edit only their scope (e.g., the CS HoD can edit CS faculty/labs/news; the Placement Cell can edit recruiters/events/placements — but nothing else).
4. Lets **students** read only (auth-gated dashboards, no public-content edits).
5. Handles file uploads (PDFs, brochures, photos, JD files, MoU PDFs) on cloud storage instead of GitHub.
6. Carries SEO metadata for every page (title, description, OG image, canonical).
7. Is reproducible on any machine (Docker), deployable on Hostinger with HTTPS, monitored, backed up, and viva-demo ready.

Existing backend skeleton from git commit `a7e133f7` (FastAPI + admin/student/faculty/events/pac/placements routers) is the starting point. We rebuild it cleanly under `backend/` and expand it dramatically.

---

## 1. Final Architecture (one-page view)

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Hostinger VPS                              │
│                                                                      │
│   ┌─────────────┐   80/443   ┌─────────────────┐                    │
│   │   Nginx     │◀──────────▶│ Let's Encrypt   │                    │
│   └─────────────┘             └─────────────────┘                    │
│         │                                                            │
│         ├─── / ────────────▶ React static (dist/)                   │
│         ├─── /api/*  ──────▶ FastAPI :8000  (gunicorn + uvicorn)    │
│         ├─── /uploads/* ───▶ Nginx serves local /var/itm/uploads    │
│         └─── /media/*  ────▶ Reverse-proxy to S3/R2 (signed URLs)   │
│                                                                      │
│   ┌──────────────┐    ┌────────────────┐    ┌────────────────┐       │
│   │ PostgreSQL16 │    │ Redis (cache + │    │ pgBackRest /   │       │
│   │              │    │ rate-limit)    │    │ pg_dump cron   │       │
│   └──────────────┘    └────────────────┘    └────────────────┘       │
└──────────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Cloudflare R2 / Hostinger Object Storage
                              │ (PDFs, photos, brochures)
```

---

## 2. Folder layout (final)

```
ITMGOI-Frontend/
├── backend/
│   ├── alembic/                       # migrations
│   │   └── versions/
│   ├── alembic.ini
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI() instance
│   │   ├── core/
│   │   │   ├── config.py              # Pydantic Settings (reads .env)
│   │   │   ├── database.py            # SessionLocal, engine, Base, get_db
│   │   │   ├── security.py            # JWT, password hash, OAuth2 scheme
│   │   │   ├── rbac.py                # scopes & dependencies
│   │   │   ├── storage.py             # S3 / local file adapter
│   │   │   ├── logging.py             # structlog + request middleware
│   │   │   └── seo.py                 # default metadata + sitemap.xml
│   │   ├── models/                    # SQLAlchemy ORM
│   │   │   ├── _base.py               # TimestampMixin, MetadataMixin
│   │   │   ├── user.py                # User, Role, Scope, AuditLog, RefreshToken
│   │   │   ├── content.py             # Page, Section, MediaAsset, Setting
│   │   │   ├── academics.py           # Department, Programme, Specialization, Lab, HOD
│   │   │   ├── people.py              # Faculty, Student, Counsellor, BoardMember
│   │   │   ├── placement.py           # Recruiter, PlacementRecord, MoU, TAPService, TAPEvent
│   │   │   ├── research.py            # Publication, Patent, FocusArea, Conference, FDP, Journal
│   │   │   ├── events.py              # Event, ClubCell, Notice, Announcement
│   │   │   ├── admissions.py          # Step, Document, Counsellor, Fee, Quota, FAQ, Timeline, Lead
│   │   │   ├── compliance.py          # Accreditation, NIRFRecord, CommitteeMember, Policy
│   │   │   ├── gallery.py             # GalleryCategory, GalleryItem, Video
│   │   │   ├── careers.py             # OpenPosition, JobApplication, JRFPosting
│   │   │   ├── forms.py               # ContactSubmission, AdmissionInquiry, GrievanceForm
│   │   │   └── alumni.py              # AlumniProfile, Chapter, Mentorship, AlumniSpeak
│   │   ├── schemas/                   # Pydantic (one file per model group)
│   │   ├── routers/                   # APIRouter (one file per group)
│   │   │   ├── auth.py                # /api/auth/*
│   │   │   ├── users.py               # /api/users/* (admin manage editors)
│   │   │   ├── settings.py            # /api/settings/*  (site-wide)
│   │   │   ├── pages.py               # /api/pages/* (page metadata + sections)
│   │   │   ├── media.py               # /api/media/* (upload, list, delete)
│   │   │   ├── departments.py
│   │   │   ├── programmes.py
│   │   │   ├── faculty.py
│   │   │   ├── students.py
│   │   │   ├── placements.py          # recruiters + records + stats
│   │   │   ├── tap.py                 # TAP team, services, MoUs, events
│   │   │   ├── research.py            # rd-cell, journal, conference, fdp, innovation
│   │   │   ├── events.py
│   │   │   ├── notices.py
│   │   │   ├── admissions.py          # programmes, fee, faq, leads, timeline
│   │   │   ├── compliance.py          # NAAC, NIRF, committees, MoUs, policies
│   │   │   ├── gallery.py
│   │   │   ├── careers.py
│   │   │   ├── alumni.py
│   │   │   ├── forms.py               # contact / inquiry submissions
│   │   │   └── public.py              # unauthenticated bulk GETs for the website
│   │   ├── services/                  # business logic (slug gen, image resize, mailer)
│   │   ├── tasks/                     # celery / arq jobs (emails, backups, sitemap)
│   │   ├── deps.py                    # FastAPI Depends helpers
│   │   └── utils/                     # validators, pagination, slugify
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_auth.py
│   │   ├── test_rbac.py
│   │   ├── test_departments.py
│   │   └── ...
│   ├── scripts/
│   │   ├── seed.py                    # bootstrap roles + super-admin + sample data
│   │   ├── migrate_from_sqlite.py
│   │   ├── import_legacy_content.py   # one-shot loader from old itmgoi.in scraped data
│   │   └── backup.sh                  # pg_dump → S3
│   ├── Dockerfile
│   ├── docker-compose.yml             # api + db + redis + adminer + nginx
│   ├── .env.example
│   ├── pyproject.toml                 # ruff + black + mypy + pytest
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   └── src/
│       ├── api/                       # NEW — typed axios client per resource
│       │   ├── client.js              # axios instance, interceptors, refresh
│       │   ├── auth.js
│       │   ├── departments.js
│       │   ├── placements.js
│       │   ├── …
│       ├── hooks/                     # NEW — React Query hooks (one per resource)
│       ├── components/admin/          # NEW — generic editor widgets
│       │   ├── InlineEditor.jsx       # text/rich-text inline edit
│       │   ├── MediaPicker.jsx        # image/PDF picker with upload
│       │   ├── CrudTable.jsx          # reusable table
│       │   └── ScopeGuard.jsx         # hides controls if no scope
│       └── pages/admin/               # NEW — admin shell + per-resource editors
│           ├── AdminShell.jsx
│           ├── DepartmentsAdmin.jsx
│           ├── PlacementsAdmin.jsx
│           ├── ResearchAdmin.jsx
│           ├── EventsAdmin.jsx
│           ├── GalleryAdmin.jsx
│           ├── PagesAdmin.jsx
│           ├── UsersAdmin.jsx
│           ├── SettingsAdmin.jsx
│           └── …
└── BACKEND_IMPLEMENTATION_PLAN.md     # this file
```

---

## 3. Three-tier auth model

| Tier | Description | How they log in |
|------|-------------|-----------------|
| **Super-Admin** | Edits *anything* on the site, manages other users, sees audit log, runs backups | `POST /api/auth/login` with username+password |
| **Scoped Editor** | Same user table, but has one or more **scopes** that limit what they can write. A read-only listing of everything else is allowed (so they can see context) | Same endpoint |
| **Student / Faculty** | Read-only for public content, can see their own dashboard data; cannot edit CMS | `POST /api/auth/login` — role decided by server |

### Scopes (initial registry)

These map 1:1 to delegated editor roles you mentioned ("someone manage placement cell, someone manage CS dept, etc."):

```
scope                    │ owns
─────────────────────────┼────────────────────────────────────────────────────
site.settings            │ logo, theme, footer, social links, contact, metadata
site.pages               │ page-level meta (title, og:image, sections), Home tiles
site.navigation          │ header / footer menu items
dept.cse                 │ CS Department page: HoD msg, faculty, labs, projects,
                         │ achievements, research, news, downloads, gallery
dept.ece                 │ same shape as above, ECE only
dept.it                  │ IT only
dept.ce                  │ CE only
dept.me                  │ ME only
dept.mba                 │ MBA + specialisations + consultancy + events
dept.esh                 │ ESH + sub-units (Physics / Chemistry / Math / Humanities)
emerging.aiml            │ AI-ML page content
emerging.cyber           │ Cyber Security page
emerging.cloud           │ Cloud Computing page
library                  │ Central Library page
admissions.content       │ programmes, fee, FAQ, counsellors, timeline, steps
admissions.leads         │ admission enquiry submissions (inbox)
placements.tap           │ TAP team, services, MoUs, events, top recruiters,
                         │ recruiter testimonials, placement records & stats
research.rdcell          │ R&D Cell vision/mission/offerings/policies
research.publications    │ year-wise publications, books & chapters
research.journal         │ journal page content
research.conference      │ conference page + papers
research.fdp             │ FDP page + sessions
research.innovation      │ innovation ecosystem page
events.pac               │ PAC events
events.cultural          │ KRONOS / cultural events
clubs.nss                │ NSS page + activities + photos
clubs.uba                │ UBA page
clubs.wec                │ WEC page (Women Empowerment Cell)
clubs.sports             │ Sports page
clubs.anti_ragging       │ Anti-ragging cell
clubs.iqac               │ IQAC page
clubs.other              │ Other clubs page
alumni.speaks            │ alumni testimonials
alumni.chapters          │ chapters list
alumni.mentorship        │ mentorship page
alumni.membership        │ membership page
gallery                  │ all gallery categories + items + videos
compliance.naac          │ NAAC docs + grade
compliance.nirf          │ NIRF rankings + data
compliance.committees    │ committees / MoUs list
compliance.policies      │ policy PDFs
careers.positions        │ open positions + JD uploads
careers.applications     │ applications inbox (read-only review)
careers.jrf              │ JRF postings
notices                  │ notices/announcements ticker
forms.contact            │ contact form inbox
forms.grievance          │ grievance inbox
users.manage             │ create/edit/disable editors (super-admin only)
audit.read               │ read audit log (super-admin only)
backups.run              │ trigger DB backup (super-admin only)
```

> All scopes are normal rows in the `scopes` table — adding a new one is a single insert, no code change.

### Permission rules (one helper, used everywhere)

```python
# app/core/rbac.py
def require(*scopes: str):
    """FastAPI dependency: 200 if user has ANY of the listed scopes, else 403."""
def require_all(*scopes: str): ...
def super_admin(): ...
```

Every mutating endpoint declares its scope:

```python
@router.put("/departments/cs/faculty/{id}",
            dependencies=[Depends(require("dept.cse", "site.settings"))])
def update_cs_faculty(...):
```

---

## 4. Database schema (high level)

> Every table inherits `TimestampMixin` (`created_at`, `updated_at`, `created_by_user_id`, `updated_by_user_id`) and most public-facing tables inherit `MetadataMixin` (`slug`, `meta_title`, `meta_description`, `meta_keywords`, `og_image_id`, `canonical_url`, `is_published`, `published_at`).

### 4.1 Auth & RBAC
- `users`(id, username, email, password_hash, role[`super_admin`|`editor`|`faculty`|`student`], full_name, photo_id, phone, is_active, last_login_at, mfa_secret)
- `scopes`(id, key UNIQUE, label, description)
- `user_scopes`(user_id, scope_id) — many-to-many
- `refresh_tokens`(id, user_id, token_hash, expires_at, revoked_at, user_agent, ip)
- `audit_log`(id, user_id, action, entity_type, entity_id, before JSONB, after JSONB, ip, ts)
- `login_attempts`(id, username, ip, ok, ts) — for rate limiting / lockout

### 4.2 Generic CMS spine
- `pages`(id, path UNIQUE, title, hero_image_id, intro_md, status, **meta_***, published_at)
- `page_sections`(id, page_id, section_key, kind[`rich_text`|`gallery`|`list`|`form`|`html`], position, payload JSONB)
- `media_assets`(id, kind[`image`|`pdf`|`video`|`doc`], storage_key, public_url, mime, size, width, height, alt, caption, folder, uploaded_by, sha256)
- `settings`(key PK, value JSONB, group) — site-wide knobs (logo, accent color, hero defaults, theme toggle defaults, social links, contact, default SEO)
- `nav_menus`(id, key) / `nav_items`(id, menu_id, parent_id, label, path, icon, sort_order, target)

### 4.3 Academics
- `departments`(id, code UNIQUE, name, slug, short_desc, hero_image_id, accent_color, sanctioned_seats, established_year, total_faculty, ordering, scope_key) — `scope_key` lets the RBAC layer auto-match the editor scope
- `hod_profiles`(id, department_id UNIQUE, name, qualification, message_md, photo_id, email, phone)
- `programmes`(id, department_id, code, name, level[`UG`|`PG`|`PhD`], duration_yrs, intake, eligibility_md, fee_structure_id, brochure_id, tags JSONB)
- `programme_specializations`(id, programme_id, name, description, careers JSONB, curriculum JSONB)
- `peos` / `psos` / `pos`(id, department_id, position, text)
- `laboratories`(id, department_id, name, icon, description, tools JSONB, photo_id)
- `infrastructure_items`(id, department_id, name, icon, capacity, description)
- `consultancy_projects`(id, department_id, client, project, value_inr, completed_on)
- `industry_partners`(id, department_id, name, logo_id, url, category[`industry`|`govt`|`psu`|`academia`])
- `industrial_visits`(id, department_id, location, description, visited_on, attendees)
- `student_projects`(id, department_id, title, description, competition, year)
- `student_awards`(id, department_id, student_name, award, batch_year, photo_id)
- `accreditations`(id, scope[`institute`|`department`], department_id, body[`NAAC`|`NBA`|`AICTE`|`NIRF`], grade, valid_from, valid_to, certificate_id)
- `emerging_branches`(id, code, name, parent_department_id, launch_year, description, …)

### 4.4 People
- `faculty`(id, department_id, employee_no, name, designation, qualification, specialization, photo_id, email, phone, joined_on, profile_md, vidwan_url, orcid, scopus_id, google_scholar_url, is_active, is_highlight, sort_order)
- `students`(id, enrollment_no UNIQUE, name, email, phone, programme_id, batch_year, semester, photo_id, is_active, address, parent_phone, …)
- `board_members`(id, name, role, organization, photo_id, bio_md, sort_order)
- `officials`(id, name, role, department_id?, photo_id, email, phone, sort_order)

### 4.5 Placement / TAP
- `recruiters`(id, name, logo_id, sector, tier[`top`|`tier2`|`partner`], url, sort_order)
- `placement_records`(id, student_id?, name, photo_id, programme_id, batch_year, company_id, package_lpa, role, location, linkedin_url, is_featured)
- `placement_statistics`(id, department_id, batch_year, highest_lpa, average_lpa, placement_rate, count_offers)
- `tap_team_members`(id, name, role, photo_id, email, phone, sort_order)
- `tap_services`(id, icon, title, description, sort_order)
- `mous`(id, owner[`tap`|`research`|`institute`|`dept`], department_id?, partner_name, logo_id, description, tags JSONB, document_id, signed_on, expires_on)
- `recruiter_testimonials`(id, recruiter_id?, name, role, quote, photo_id, rating, sort_order)
- `tap_events`(id, title, description_md, event_date, image_id, type, status[`upcoming`|`past`])

### 4.6 Research
- `research_focus_areas`(id, name, icon, description, departments_jsonb)
- `publications`(id, year, count, archive_pdf_id, department_id?, summary)
- `books_and_chapters`(id, year, pdf_id, contributors_jsonb)
- `patents`(id, title, inventors_jsonb, filed_on, status, department_id, patent_no)
- `journal_issues`(id, volume, issue, year, cover_id, pdf_id, theme)
- `conferences`(id, name, year, location, theme, brochure_id, proceedings_id, banner_id, status)
- `conference_papers`(id, conference_id, title, authors_jsonb, abstract_md, pdf_id)
- `fdps`(id, title, start_date, end_date, mode[`online`|`offline`|`hybrid`], banner_id, brochure_id, status)
- `fdp_sessions`(id, fdp_id, day, time, speaker, topic)
- `policy_documents`(id, owner[`research`|`compliance`|`institute`], title, description, pdf_id, version)

### 4.7 Admissions
- `admission_steps`(id, position, title, description, icon)
- `required_documents`(id, name, description, mandatory, applies_to JSONB, max_size_mb, formats JSONB, sort_order)
- `counsellors`(id, name, email, phone, photo_id, expertise JSONB)
- `fee_components`(id, programme_id?, programme_type, type[`tuition`|`hostel`|`caution`|`exam`|`other`], amount, frequency, duration_semesters)
- `quotas`(id, name, percentage, description, eligibility_md)
- `admission_faqs`(id, programme_id?, category, question, answer_md, sort_order)
- `admission_timeline`(id, year, event, event_date, kind)
- `admission_leads`(id, name, email, phone, programme_interest, city, source, message, **status**, assigned_to_user_id, created_at) — form inbox

### 4.8 Compliance
- `nirf_records`(id, year, rank, category, total_score, sub_scores_jsonb, document_id)
- `committee_members`(id, committee_name, member_name, role, term_start, term_end, contact)
- `naac_documents`(id, cycle, criterion, title, pdf_id)
- `policies`(id, slug, title, body_md, pdf_id, last_revised_on)

### 4.9 Gallery / Media
- `gallery_categories`(id, slug, label, icon, accent, cover_media_id, sort_order, scope_key)
- `gallery_items`(id, category_id, media_id, caption, captured_on, photographer, sort_order)
- `videos`(id, category_id, title, duration_seconds, youtube_id?, mp4_media_id?, cover_id)

### 4.10 Events / Clubs / Notices
- `clubs_cells`(id, code, name, type[`club`|`cell`], scope_key, logo_id, accent, page_slug, contact_email)
- `events`(id, club_id?, title, description_md, event_date, location, banner_id, registration_url, type, status)
- `notices`(id, title, body_md, pdf_id?, audience JSONB, priority, published_at, expires_on)
- `announcements`(id, message, link, starts_on, ends_on, level[`info`|`success`|`warning`])

### 4.11 Careers / Forms / Alumni
- `open_positions`(id, title, department_id?, category, type[`full_time`|`contract`|`project`], location, experience, description_md, tags JSONB, deadline, jd_pdf_id, status[`open`|`closed`])
- `job_applications`(id, position_id, applicant_name, email, phone, resume_id, cover_letter_md, status[`new`|`shortlisted`|`rejected`])
- `jrf_postings`(id, title, stipend, duration, research_area, eligibility_md, deadline, status)
- `contact_submissions`(id, kind[`general`|`grievance`|`info`|`gallery_submission`], name, email, phone, subject, message, attachments_jsonb, status, assigned_to_user_id)
- `alumni_profiles`(id, name, batch_year, programme_id, current_role, company, location, photo_id, bio_md, linkedin, is_featured)
- `alumni_chapters`(id, city, coordinator, members_count, contact_email)
- `alumni_mentorships`(id, mentor_alumni_id, focus_area, slots, is_open)

### 4.12 SEO / Metadata (cross-cutting)

Every "page-like" entity (`pages`, `departments`, `programmes`, `events`, `notices`, `alumni_profiles`, `policies`, `gallery_items`, `journal_issues`, etc.) carries the **MetadataMixin** columns:

```
slug                 VARCHAR UNIQUE
meta_title           VARCHAR(70)
meta_description     VARCHAR(160)
meta_keywords        JSONB
og_image_id          FK media_assets
canonical_url        VARCHAR
robots               VARCHAR (default 'index,follow')
schema_jsonld        JSONB (optional structured data)
is_published         BOOLEAN
published_at         TIMESTAMP
```

A nightly task regenerates `sitemap.xml` and `robots.txt` from these.

---

## 5. API surface (canonical)

> All write endpoints require auth + correct scope; all read endpoints for public content are open with caching headers.

### Auth
```
POST  /api/auth/login                  username/password → access + refresh + role + scopes + user
POST  /api/auth/refresh                refresh_token → new access
POST  /api/auth/logout                 revoke refresh token
GET   /api/auth/me                     current user (with scopes)
POST  /api/auth/password               change own password
POST  /api/auth/student-login          backwards-compat (delegates to /login)
POST  /api/auth/faculty-login          backwards-compat
```

### Users / RBAC (super-admin only)
```
GET    /api/users
POST   /api/users
PATCH  /api/users/{id}
DELETE /api/users/{id}                 soft delete
GET    /api/scopes
POST   /api/users/{id}/scopes          {add: [...], remove: [...]}
GET    /api/audit?entity=&user=&from=&to=
```

### Media
```
POST  /api/media                        multipart; returns {id, url, mime, ...}
GET   /api/media?folder=&kind=
PATCH /api/media/{id}                   alt, caption, folder
DELETE /api/media/{id}
```

### Pages & sections
```
GET    /api/pages
GET    /api/pages/{path}                resolves to {meta, sections[]}
PATCH  /api/pages/{id}                  metadata
GET    /api/pages/{id}/sections
PATCH  /api/pages/{id}/sections/{key}   body JSON
```

### Per-resource (one router each — full CRUD)
```
/api/departments          + /{code}/faculty, /labs, /achievements, /projects, /partners
/api/programmes           + /{id}/specializations, /fees, /faqs
/api/faculty              filterable by department
/api/students             admin only
/api/recruiters
/api/placements           records + stats
/api/tap/team             /services, /mous, /events
/api/research/publications  /books, /focus-areas, /patents
/api/research/journals       /conferences  /fdps  /policies
/api/admissions/leads       /steps /documents /counsellors /fees /quotas /faqs /timeline
/api/compliance/naac        /nirf  /committees  /mous  /policies
/api/gallery/categories     /items  /videos
/api/clubs                  /events  /notices  /announcements
/api/careers/positions      /applications  /jrf
/api/alumni/profiles        /chapters  /mentorships  /speaks
/api/forms/contact          /grievance     (read-only inbox; write is open & rate-limited)
/api/settings               key/value (public reads cached 5 min)
```

### Public bulk (cached, GET-only — what the public website calls)
```
GET /api/public/home                   one payload with everything the home page needs
GET /api/public/department/{code}      one payload for a department page
GET /api/public/programme/{slug}
GET /api/public/page/{path}
GET /api/public/notices?limit=5
GET /api/public/events?status=upcoming
GET /api/public/sitemap.xml
GET /api/public/robots.txt
```

> Public payloads are assembled server-side and cached in Redis with key-based invalidation on mutation. This keeps the SPA fast and bypasses N+1 issues.

---

## 6. File uploads / image storage

| Concern | Decision |
|---------|----------|
| **Storage** | Cloudflare R2 (S3-API, zero egress) as default; local `/var/itm/uploads` only for dev. Adapter pattern in `app/core/storage.py` so we can swap to Hostinger Object Storage / AWS S3. |
| **Upload flow** | Direct multipart to FastAPI → server validates mime + size + scans (clamd optional) → writes to R2 with `folder/yyyy/mm/uuid.ext` → stores row in `media_assets` with `public_url` (CDN-fronted). |
| **Image variants** | On upload, generate `thumb (320w)`, `card (640w)`, `hero (1600w)` WebP via Pillow; store siblings; respond with `srcset`-ready URLs. |
| **PDFs** | Stored as-is; first page rendered to PNG thumbnail. |
| **Validation** | mime sniff (`python-magic`), max 10 MB image / 25 MB PDF / 200 MB video (videos preferably YouTube embed). |
| **Replace flow** | UI shows existing image → "Replace" → new `media_assets` row → old row marked `replaced_by`; cascading delete only when unreferenced. |
| **Garbage collection** | Nightly job lists unreferenced `media_assets` older than 30 days and deletes from storage. |

---

## 7. Validation & error contract

- Pydantic v2 schemas in `app/schemas/` — every payload typed.
- `Field(..., max_length=…, pattern=…)` on every string; phone/email validators centralized.
- Custom exception handlers translate to consistent JSON:
  ```json
  { "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": {"email": "Invalid format"} } }
  ```
- 4xx for client, 5xx for server. No `detail: "Internal Server Error"` leaks.
- Frontend shows `error.message` in a toast, field errors inline.

---

## 8. Security baseline

- Argon2id password hashes (passlib), 12+ char min, lockout after 5 bad attempts / 15 min (Redis counter).
- JWT access 15 min, refresh 14 days, refresh rotation + reuse detection.
- HTTPS only via Let's Encrypt; HSTS on Nginx.
- CORS allowlist from env: `FRONTEND_ORIGINS=https://itmgoi.in,https://www.itmgoi.in`. No `*`.
- All ORM queries parameterized (SQLAlchemy); raw SQL only in migrations.
- File upload: extension whitelist + magic-bytes check.
- Rate limit (`slowapi`): 100 req/min/IP global, 10/min on `/auth/*`, 5/min on `/forms/*`.
- Security headers via `secure` middleware: CSP, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy.
- Secrets via `.env` (never committed); rotated quarterly.
- Backups encrypted at rest (R2 server-side encryption + GPG on dumps).
- Audit log immutable (append-only; no UPDATE/DELETE).

---

## 9. Logging / Monitoring

- `structlog` JSON output; correlation IDs per request (`X-Request-Id`).
- Access log middleware logs `method path status duration_ms user_id ip ua`.
- `/api/health/live` and `/api/health/ready` (DB ping + Redis ping).
- Sentry SDK (free tier) for unhandled exceptions.
- UptimeRobot pings every 5 min.
- Grafana Cloud free tier optional later; for now `journalctl -u itm-api` + `docker logs` is enough.

---

## 10. Deployment (Hostinger VPS)

### One-time
1. Provision VPS (Ubuntu 22.04, 4 GB RAM minimum).
2. `ufw allow 22,80,443`; disable password SSH after key install.
3. Install Docker + docker-compose plugin.
4. Point DNS A-records `itmgoi.in` and `www.itmgoi.in` to VPS IP.
5. Install certbot + nginx, run `certbot --nginx` once.

### CI/CD (GitHub Actions, free)
- On push to `main` → build images → push to GHCR → SSH to VPS → `docker compose pull && docker compose up -d`.
- Migrations run via `docker compose run --rm api alembic upgrade head` as a pre-step.

### docker-compose.yml services
- `api` (FastAPI / gunicorn-uvicorn, 4 workers)
- `web` (nginx serving `frontend/dist`)
- `db` (postgres:16-alpine, named volume `pgdata`)
- `redis` (cache + rate-limit)
- `nginx` (TLS terminator, reverse proxy)
- `adminer` (DB UI, port-restricted to localhost + SSH tunnel)
- `backup` (cron container running `pg_dump` → R2 nightly)

### Zero-downtime deploys
- Gunicorn graceful reload on SIGHUP.
- Nginx already buffers; clients see brief retry only on container restart.

---

## 11. PostgreSQL config + SQLite migration

- Primary DB: PostgreSQL 16. Connection string in `DATABASE_URL`.
- Pool: `pool_size=20, max_overflow=10, pool_pre_ping=True`.
- Migrations: **Alembic**, autogenerate from models, reviewed by humans.
- Existing SQLite data (from `backend/server_backup/`) → one-shot `scripts/migrate_from_sqlite.py`: open old SQLite, read each table, write into PostgreSQL via SQLAlchemy. Idempotent (`ON CONFLICT DO NOTHING` by natural key).

### Daily backups
- `pg_dump -Fc` → encrypted upload to R2 bucket `itm-backups/yyyy/mm/dd.dump.gpg`.
- Retention: 30 daily + 12 monthly + 7 yearly.
- Restore drill documented in `backend/scripts/RESTORE.md`.

---

## 12. Frontend integration

### 12.1 Axios client (`frontend/src/api/client.js`)
- Base URL via `VITE_API_URL` (defaults to `/api`).
- Request interceptor adds `Authorization: Bearer <accessToken>`.
- Response interceptor catches 401 → refresh once → retry; if still 401, logout + redirect.
- Surfaces error JSON to React Query.

### 12.2 React Query
- Add `@tanstack/react-query` + Devtools.
- One hook per resource, e.g.:
  ```js
  export const useDepartments = () => useQuery({ queryKey: ['departments'], queryFn: api.departments.list });
  export const useUpdateFaculty = () => useMutation({ mutationFn: api.faculty.update, onSuccess: () => qc.invalidateQueries(['faculty']) });
  ```
- Caching = optimistic UI for editors.

### 12.3 Auth context (rebuild)
- Replace `AuthContext` to also expose `scopes: string[]`, `hasScope(key)`, `canEdit(scopeKey)`.
- Persist access token in memory + refresh in `httpOnly` cookie (preferred) or fallback to localStorage with rotating refresh.

### 12.4 Three login experiences (already wired in `Login.jsx`)
- **Admin tab** posts to `/api/auth/login` (super-admin OR scoped editor — server decides).
- **Faculty tab** posts to `/api/auth/login` with email; gets `role=faculty` + faculty-specific scopes.
- **Student tab** posts to `/api/auth/login` with enrollment; role=student. Default password = enrollment number, must reset on first login.

### 12.5 Inline editing on every public page
Strategy: a single `<EditableArea scope="dept.cse" section="hero">` wrapper component.
- For authenticated editors with matching scope, renders an "Edit ✎" pencil overlay.
- Clicking opens a slide-over panel (`<SectionEditor>`) with the right form (rich-text / image / list / KV).
- On save, PATCH to `/api/pages/.../sections/...` or to the resource endpoint; cache invalidates.
- For viewers and students, just renders the content.

### 12.6 Admin shell (`/admin`)
- Left nav lists only the scopes the current user has → never shows "Edit CS Dept" to an MBA editor.
- Cards: counts (faculty, students, leads, notices) — already present in `AdminDashboard.jsx`.
- Per resource: `CrudTable` with create / edit / delete / publish / unpublish.

---

## 13. Metadata workflow (the part that's easy to forget)

- New page goes live → `pages` row auto-created with placeholder meta.
- Admin opens `/admin/pages` → table of every page with `title / desc / og` columns inline-editable.
- Saving regenerates `sitemap.xml` (async task) and busts public payload cache for that path.
- Each `departments`, `programmes`, `events`, `notices`, `alumni_profiles`, `journal_issues`, `policies`, `gallery_items` row has its own SEO fields editable inline in its CRUD table.
- A default-metadata setting (under `settings` group `seo`) provides fallbacks (og image, twitter handle, organization JSON-LD).
- Public payloads embed full meta so the React app sets `<title>` and `<meta>` via `react-helmet-async` (add this dep).

---

## 14. Testing strategy

- `pytest` + `httpx` async client.
- `pytest-postgresql` for test DB (or testcontainers for full parity).
- Coverage target: ≥80% on routers and services.
- Test buckets:
  - Auth flows (login, refresh, lockout, password change)
  - RBAC (each scope grants/denies exactly the right endpoints — table-driven)
  - CRUD smoke tests for every resource
  - File upload (mock R2)
  - Form submissions + rate limits
  - Audit log entries written on mutations
- Frontend: Playwright e2e for the three login flows + at least one inline-edit roundtrip per scope.
- Postman collection + OpenAPI JSON published at `/api/docs` and `/api/redoc`.

---

## 15. Documentation deliverables

- `backend/README.md` — quickstart (docker compose up), env vars, common tasks.
- `backend/scripts/RESTORE.md` — disaster recovery drill.
- `docs/RBAC.md` — every scope with description and example endpoints.
- `docs/API.md` — generated from OpenAPI; deep-linked from `/api/docs`.
- `docs/DEMO.md` — viva script (login as admin, login as CS editor, edit a faculty card, watch public page update, log in as student to see dashboard).
- `docs/ARCHITECTURE.md` — this plan plus diagrams.

---

# Phases (production-grade rollout)

Each phase ends in a runnable state. Don't skip phase exits.

## Phase 0 — Foundations (Week 1)

**Goal:** clean repo, dev env reproducible, base FastAPI app boots with Postgres on any machine.

- [ ] Restore `backend/` skeleton from commit `a7e133f7` into `backend/app/` with the new layout.
- [ ] Add `pyproject.toml` (ruff, black, mypy, pytest), `requirements.txt`.
- [ ] Add `Dockerfile` (multi-stage; slim base) + `docker-compose.yml` (api + db + redis + adminer).
- [ ] `.env.example` filled with every required key; `.env` git-ignored.
- [ ] `app/core/config.py` (Pydantic Settings), `app/core/database.py`, `app/core/logging.py`.
- [ ] `app/main.py` with CORS allow-list, request-id middleware, exception handlers, `/api/health/*`.
- [ ] Alembic initialised, first migration creates `users`, `scopes`, `user_scopes`, `refresh_tokens`, `audit_log`, `media_assets`, `settings`.
- [ ] `scripts/seed.py` creates default super-admin + standard scope rows.
- [ ] GitHub Actions: lint + tests on PR; root `.gitignore` extended for `backend/.venv`, `backend/__pycache__/`, `.env`, `uploads/`.
- [ ] `frontend/src/api/client.js` + React Query installed; `AuthContext` rebuilt to know about scopes.

**Exit criteria:** `docker compose up` → `GET /api/health/ready` returns 200; super-admin can log in via existing `/login` page; refresh token works; audit log records the login.

## Phase 1 — Auth & RBAC complete (Week 2)

- [ ] All scopes from §3 seeded.
- [ ] `/api/users` + `/api/users/{id}/scopes` endpoints.
- [ ] `AdminUsers` page in admin shell to create scoped editors.
- [ ] Frontend `ScopeGuard` + `hasScope()` helper.
- [ ] Three login tabs in `Login.jsx` validated end-to-end against the new backend.
- [ ] Student / faculty seed data + dashboards continue to work.
- [ ] Rate limit + lockout + audit log proven by tests.

**Exit:** super-admin can create a "CS Dept Editor" account with `dept.cse` scope, that user logs in, sees only the CS edit screen, cannot access ECE.

## Phase 2 — Generic CMS spine (Week 3)

- [ ] `pages`, `page_sections`, `media_assets`, `settings`, `nav_menus` models + migrations + routers.
- [ ] Media upload to R2 (or local fallback) with image variants.
- [ ] `/admin/media` library UI.
- [ ] `/admin/pages` list + per-page editor with SEO fields.
- [ ] `/admin/settings` UI for site-wide config (logo, colors, social, contact).
- [ ] Replace ~10 hardcoded Home tiles (hero slides, stats, recruiter logos source path) with `settings`/`page_sections` reads; verify Home renders from API.

**Exit:** super-admin edits the Hero headline in the admin panel; reload public Home — the new headline shows.

## Phase 3 — Academics block (Weeks 4–5)

- [ ] Migrations + models for `departments`, `hod_profiles`, `programmes`, `programme_specializations`, `peos/psos/pos`, `laboratories`, `infrastructure_items`, `consultancy_projects`, `industry_partners`, `industrial_visits`, `student_projects`, `student_awards`, `accreditations`, `emerging_branches`.
- [ ] Routers + scoped CRUD: `dept.cse`, `dept.ece`, `dept.it`, `dept.ce`, `dept.me`, `dept.mba`, `dept.esh`, `emerging.aiml`, `emerging.cyber`, `emerging.cloud`, `library`.
- [ ] One-shot import of `data/departments_v2.js` into Postgres.
- [ ] Department pages (`CSDepartment.jsx` etc.) rewritten to read from `/api/public/department/{code}`.
- [ ] `AdminDepartmentsPage` with sub-tabs (Faculty, Labs, Achievements, Projects, Partners, …) — every sub-tab restricted by the scope.
- [ ] Faculty CRUD includes photo upload.

**Exit:** CS HoD logs in, updates the HoD message and adds a lab; change appears on `/cs` within seconds.

## Phase 4 — Placements / TAP (Week 6)

- [ ] Models + routers for `recruiters`, `placement_records`, `placement_statistics`, `tap_team_members`, `tap_services`, `mous`, `recruiter_testimonials`, `tap_events`.
- [ ] Import existing TAP/placements arrays from `TapPage.jsx`, `PlacementData.jsx`.
- [ ] `RecruiterMarquee.jsx` reads from `/api/public/recruiters` (no more `/images/company_logos/folder/idx.png` hardcoding).
- [ ] Admin: Placement Cell Editor (`placements.tap`) — single-page back-office with all sub-tabs.
- [ ] PDF MoU uploads to R2.

**Exit:** Placement editor uploads new MoU PDF + adds a recruiter; `/tap` and home `RecruiterMarquee` reflect both.

## Phase 5 — Research suite (Week 7)

- [ ] Models + routers for `publications`, `books_and_chapters`, `patents`, `research_focus_areas`, `journal_issues`, `conferences`, `conference_papers`, `fdps`, `fdp_sessions`, `policy_documents`.
- [ ] Five Research pages read from API.
- [ ] Sub-scopes (`research.publications`, `research.journal`, `research.conference`, `research.fdp`, `research.innovation`, `research.rdcell`) each get a focused editor view.
- [ ] PDF management with year filter.

**Exit:** Research editor publishes a new conference paper → it appears under `/research/conference`.

## Phase 6 — Events / Clubs / Notices / Gallery (Week 8)

- [ ] Models + routers for `clubs_cells`, `events`, `notices`, `announcements`, `gallery_categories`, `gallery_items`, `videos`.
- [ ] Sub-scope editors: `events.pac`, `events.cultural`, `clubs.nss`, `clubs.uba`, `clubs.wec`, `clubs.sports`, `clubs.iqac`, `clubs.anti_ragging`, `clubs.other`, `gallery`, `notices`.
- [ ] Bulk image uploader for gallery (drag-drop, multi-file, alt-text inline).
- [ ] Public Home `UpcomingEvents`, `GalleryPreview` fed from API.

**Exit:** Gallery editor drops 30 images into Cultural category → `/gallery/cultural` shows them with captions; PAC editor schedules a new event → home page surfaces it.

## Phase 7 — Admissions & Forms (Week 9)

- [ ] Models + routers for `admission_steps`, `required_documents`, `counsellors`, `fee_components`, `quotas`, `admission_faqs`, `admission_timeline`, `admission_leads`, `contact_submissions`, `open_positions`, `job_applications`, `jrf_postings`.
- [ ] Inquiry forms (`SeekAdmission`, `ContactSection`, `OpenPositionsPage` apply) wired to POST endpoints with reCAPTCHA + rate limit.
- [ ] Email notification on form submission (SMTP via Hostinger).
- [ ] Inbox UI for `admissions.leads`, `forms.contact`, `forms.grievance`, `careers.applications` with status workflow.

**Exit:** A user submits the admission inquiry form → arrives in `/admin/leads` and triggers an email to the admissions counsellor.

## Phase 8 — Compliance, Alumni, About sub-pages (Week 10)

- [ ] Models + routers for `nirf_records`, `naac_documents`, `committee_members`, `mous` (compliance owner), `policies`, `board_members`, `officials`, `alumni_profiles`, `alumni_chapters`, `alumni_mentorships`.
- [ ] Editors: `compliance.naac`, `compliance.nirf`, `compliance.committees`, `compliance.policies`, `alumni.speaks`, `alumni.chapters`, `alumni.mentorship`, `alumni.membership`.
- [ ] About-Institute, Officials, Board, Director-Message, Policies pages read from API.

**Exit:** Compliance editor uploads a new NAAC SSR PDF → `/naac` lists it; alumni editor adds a chapter → `/alumni/chapters` updates.

## Phase 9 — SEO, sitemap, robots, structured data (Week 11)

- [ ] MetadataMixin filled across all entities (migrations + backfill).
- [ ] `react-helmet-async` in the SPA reads meta from public payloads.
- [ ] `/api/public/sitemap.xml` and `/robots.txt` dynamic.
- [ ] JSON-LD: Organization, BreadcrumbList, Event, Article (for notices), Course (for programmes).
- [ ] OpenGraph + Twitter cards verified with FB Debugger / Twitter card validator.

**Exit:** sitemap lists every published page; Lighthouse SEO score ≥95 on Home, Departments, Programmes.

## Phase 10 — Hardening, perf, accessibility (Week 12)

- [ ] Redis cache for public payloads (5 min default TTL, invalidated on writes).
- [ ] Gzip + Brotli on Nginx; HTTP/2; long-cache headers on `/uploads/*` + `/static/*`.
- [ ] WebP variants enforced; lazy-loading images; `loading="lazy"`.
- [ ] Lighthouse pass: SEO + Perf + A11y + Best-Practices all ≥90.
- [ ] OWASP ZAP baseline scan; fix high/medium findings.
- [ ] Load test (`locust`) — 200 concurrent reads to public payloads.

**Exit:** website passes Lighthouse thresholds; ZAP scan green on `Authentication`, `Configuration`, `Information Disclosure`.

## Phase 11 — Deployment to Hostinger (Week 13)

- [ ] VPS provisioned; domains pointed; TLS issued.
- [ ] Object storage bucket created; access keys in `.env`.
- [ ] SMTP credentials in `.env`.
- [ ] First production migration + seed run.
- [ ] GitHub Actions deploys on `main` push.
- [ ] DNS cut-over from old itmgoi.in to new VPS (low TTL set 24 h before).
- [ ] Old data scraped + imported via `scripts/import_legacy_content.py`.

**Exit:** `https://itmgoi.in` loads the new site over HTTPS; backups uploaded to R2 nightly; monitoring dashboards green.

## Phase 12 — Documentation + viva-readiness (Week 14)

- [ ] `docs/DEMO.md` script tested live.
- [ ] Postman collection committed; screencast recorded.
- [ ] Final regression test (every form, every scope, every admin screen).
- [ ] Sign-off checklist for the 29 user requirements (see §16).

---

## 16. Requirement coverage matrix

| # | Requirement | Phase | Where it lives |
|---|-------------|-------|----------------|
| 1 | Backend deployable everywhere | 0, 11 | Dockerfile, docker-compose.yml |
| 2 | PostgreSQL prod | 0, 11 | `core/database.py`, env, Alembic |
| 3 | SQLite → PostgreSQL migration | 0 | `scripts/migrate_from_sqlite.py` |
| 4 | Admin login | 1 | `routers/auth.py`, `Login.jsx` |
| 5 | JWT auth | 0–1 | `core/security.py`, refresh tokens table |
| 6 | Organized routes | 0+ | `app/routers/*` (one per resource) |
| 7 | CRUD for students/faculty/courses/notices | 1, 3, 6, 8 | per-router CRUD |
| 8 | Forms save to DB | 7 | `admission_leads`, `contact_submissions` |
| 9 | Image storage solution | 2 | `media_assets` + R2 |
| 10 | Images on CDN | 2 | Cloudflare R2 + cache headers |
| 11 | File upload (PDF/notice/image) | 2, 6 | `/api/media` |
| 12 | Backend validation | 0+ | Pydantic schemas |
| 13 | Consistent error handling | 0 | Exception handlers |
| 14 | Role-based access | 1 | `scopes`, `rbac.py`, `ScopeGuard` |
| 15 | DB backups | 11 | nightly pg_dump to R2 |
| 16 | .env for secrets | 0 | `.env.example`, `core/config.py` |
| 17 | API testing (Postman/Swagger) | 0+ | `/api/docs`, committed Postman |
| 18 | CORS | 0 | env-driven allowlist |
| 19 | Stable Hostinger deploy | 11 | VPS + nginx + compose |
| 20 | HTTPS / SSL | 11 | Let's Encrypt via certbot |
| 21 | Logs + basic monitoring | 0, 11 | structlog, Sentry, UptimeRobot |
| 22 | Clean GitHub repo | 0 | `.gitignore`, no `.venv` tracked, no big binaries |
| 23 | Static/media optimization | 2, 10 | WebP, srcset, cache |
| 24 | Schema + relations | 0+ | §4 |
| 25 | Future-extensible (attendance/result/ERP) | 1+ | normalized people/department schemas leave room |
| 26 | Fast API responses | 10 | Redis cache + bulk payloads + indexes |
| 27 | SQLi / password hashing / etc. | 0–1 | parameterized queries + Argon2 + rate limit |
| 28 | Demo/viva docs | 12 | `docs/DEMO.md` |
| 29 | Final production testing | 12 | regression checklist |
| ★ | 3-tier login (admin / scoped editor / student) | 1, 3+ | §3 scopes + `Login.jsx` |
| ★ | Every page/element editable | 2–8 | `pages` + `page_sections` + per-entity CRUD + InlineEditor |
| ★ | Delegated scopes (CS dept editor, placement editor, etc.) | 1+ | scope registry in §3 |
| ★ | Page metadata in backend | 9 | MetadataMixin everywhere |

---

## 17. What to do first (concrete next steps)

1. **Restore the existing backend skeleton** from commit `a7e133f7` into a fresh `backend/` folder using the new layout (§2). Do *not* recreate the `.venv` in git.
2. Add `pyproject.toml` + `requirements.txt` + `Dockerfile` + `docker-compose.yml` + `.env.example`.
3. Drop in `app/core/{config,database,security,rbac,storage,logging}.py`.
4. Write the **users / scopes / audit / media / settings** migration first — it unblocks everything.
5. Seed default super-admin (`admin / admin123`, **forced rotation on first login**).
6. Verify the existing `Login.jsx` three-tab UI still works against the new `/api/auth/*` endpoints.
7. Open the first scoped editor (`dept.cse`) and migrate `CSDepartment.jsx` to read from the API — this is the template for every other page.

Once that loop is closed on one department, the rest is repetition, not invention.

---

_Last updated: 2026-05-27._
