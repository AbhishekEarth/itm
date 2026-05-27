# API Reference

The authoritative reference is the auto-generated OpenAPI at
**`/api/docs`** (Swagger) and **`/api/redoc`** when the API is running.

This file is the quickstart.

## Base URL

- Dev: `http://localhost:8000/api`
- Prod: `https://itmgoi.in/api`

All write endpoints want a bearer token. Get one from `POST /api/auth/login`.

## Login

```bash
curl -X POST -d "username=admin&password=admin123" \
  http://localhost:8000/api/auth/login
# {
#   "access_token": "eyJ…",
#   "refresh_token": "eyJ…",
#   "role": "super_admin",
#   "scopes": [],
#   "user": { ... },
#   "expires_in": 900
# }
```

The same `/login` works for super-admins, editors, faculty and students —
the server decides the role and returns it.

```bash
TOK="eyJ…"
curl -H "Authorization: Bearer $TOK" http://localhost:8000/api/auth/me
```

When access expires:

```bash
curl -X POST http://localhost:8000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"eyJ…"}'
```

## Public reads (no auth)

| URL | What it returns |
|---|---|
| `GET /api/public/settings` | brand + contact + social + SEO defaults |
| `GET /api/public/home` | full Home page (hero + sections + meta) |
| `GET /api/public/page/{path}` | any CMS page by path (`/about`, `/contact`, …) |
| `GET /api/public/departments` | thin list for navs |
| `GET /api/public/department/{code}` | full dept payload (HoD + faculty + labs + projects + placements) |
| `GET /api/public/recruiters` | marquee data grouped by category |
| `GET /api/public/tap` | full /tap page payload |
| `GET /api/public/research/rdcell` | R&D cell page bundle |
| `GET /api/public/research/journal` | journal issues |
| `GET /api/public/research/conferences` | conferences + papers |
| `GET /api/public/research/fdps` | FDPs + sessions |
| `GET /api/public/research/patents` | granted/filed patents |
| `GET /api/public/clubs?type=club|cell` | clubs/cells list |
| `GET /api/public/events?status=upcoming&club_code=pac` | events filter |
| `GET /api/public/notices` | active notices |
| `GET /api/public/announcements` | ticker messages |
| `GET /api/public/gallery` | category list |
| `GET /api/public/gallery/{slug}` | category + items |
| `GET /api/public/videos?category_slug=…` | videos |
| `GET /api/public/admissions` | steps + docs + counsellors + fees + quotas + FAQs + timeline |
| `GET /api/public/careers/positions?department_code=…` | open positions |
| `GET /api/public/careers/jrf` | JRF postings |
| `GET /api/public/compliance/naac` | NAAC docs + grades + policies |
| `GET /api/public/compliance/nirf` | NIRF records |
| `GET /api/public/compliance/committees` | committees grouped |
| `GET /api/public/about/officials` | institute officials |
| `GET /api/public/about/board` | board of governors |
| `GET /api/public/alumni/speaks` | featured alumni profiles |
| `GET /api/public/alumni/chapters` | city chapters |
| `GET /api/public/alumni/mentorships` | open mentorship programmes |
| `GET /api/public/sitemap.xml` | dynamic sitemap |
| `GET /api/public/robots.txt` | robots |
| `GET /api/public/seo/organization-jsonld` | Organization JSON-LD |

All cached 30 s – 5 min in Redis with tag-based invalidation.

## Public form submissions (no auth, rate-limited)

```bash
# admission inquiry
curl -X POST http://localhost:8000/api/admissions/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Anjali Sharma","email":"anjali@example.com","programme_interest":"B.Tech CSE"}'

# contact / grievance
curl -X POST http://localhost:8000/api/forms/submit \
  -H "Content-Type: application/json" \
  -d '{"kind":"general","name":"X","email":"x@y.com","message":"Hello"}'

# job application
curl -X POST http://localhost:8000/api/careers/applications \
  -H "Content-Type: application/json" \
  -d '{"position_id":1,"applicant_name":"X","email":"x@y.com"}'
```

## Admin writes

Pattern: `POST/PATCH/DELETE /api/<resource>` with a bearer token whose
`scopes` claim includes the right key. See [RBAC.md](./RBAC.md) for the
full table.

```bash
# CS editor adds a lab
curl -X POST http://localhost:8000/api/departments/CSE/labs \
  -H "Authorization: Bearer $CS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Quantum Lab","icon":"⚛️","description":"…"}'
```

## Media upload

```bash
curl -X POST http://localhost:8000/api/media \
  -H "Authorization: Bearer $TOK" \
  -F "file=@hero.png" \
  -F "folder=hero" \
  -F "alt=ITM campus aerial view"
# Returns { id, public_url, mime, width, height, variants: [thumb, card, hero], … }
```

Variants are auto-generated WebP at 320 / 640 / 1600 px.

## Errors

Every error returns:

```json
{ "error": { "code": "FORBIDDEN", "message": "Requires dept.cse scope", "fields": {} } }
```

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_ERROR` | 422 | Pydantic field errors in `fields` |
| `UNAUTHORIZED` | 401 | missing or expired token |
| `FORBIDDEN` | 403 | token valid but lacks required scope |
| `NOT_FOUND` | 404 | row doesn't exist |
| `CONFLICT` | 409 | unique constraint hit |
| `UNSUPPORTED_MEDIA` | 415 | upload mime not in allowlist |
| `FILE_TOO_LARGE` | 413 | upload over `MAX_UPLOAD_MB_*` cap |
| `RATE_LIMITED` | 429 | slowapi throttle |
| `INTERNAL_ERROR` | 500 | unhandled (also goes to Sentry in prod) |

## Postman

Import [`postman/itmgoi.postman_collection.json`](../postman/itmgoi.postman_collection.json).
Set the `baseUrl` and `token` environment variables and you can hit every
endpoint described here.
