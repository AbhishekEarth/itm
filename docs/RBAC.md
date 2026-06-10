# RBAC — Roles, Scopes, and Permission Routing

## Roles

| Role | Description | Login form |
|---|---|---|
| `super_admin` | Edits anything. Bypasses every scope check. Manages other users. | Admin tab |
| `editor` | Can edit only the resources covered by its assigned scopes. | Admin tab |
| `faculty` | Read-only public access + own `/faculty/dashboard`. | Faculty tab |
| `student` | Read-only public access + own `/student/dashboard`. | Student tab |

The role lives on `users.role`; scopes are a join table `user_scopes (user_id, scope_id)`.

## Scope registry

The canonical list is in [`backend/app/core/rbac.py`](../backend/app/core/rbac.py).
50 scopes total. Examples by family:

| Family | Scope key | Owns |
|---|---|---|
| Site-wide | `site.settings` | brand, logo, contact, social links, default SEO, board, officials |
| | `site.pages` | Pages + page sections + global override for dept content |
| | `site.navigation` | header/footer menus |
| Departments | `dept.cse` | CSE faculty, labs, projects, partners, HoD msg |
| | `dept.ece` `dept.it` `dept.ce` `dept.me` `dept.mba` `dept.esh` | their own dept only |
| Emerging | `emerging.aiml` `emerging.cyber` `emerging.cloud` | those pages |
| Admissions | `admissions.content` | steps, docs, counsellors, fees, FAQs, timeline |
| | `admissions.leads` | inquiry inbox (public POST is open) |
| Placements | `placements.tap` | recruiters, TAP team, services, MoUs, events, records, stats |
| Research | `research.rdcell` | R&D Cell page + policy docs |
| | `research.publications` | publications archive, books, patents |
| | `research.journal` | journal issues |
| | `research.conference` | conferences + papers |
| | `research.fdp` | FDPs + sessions |
| | `research.innovation` | innovation page (settings-backed) |
| Events / Clubs | `events.pac` `events.cultural` | event creation |
| | `clubs.nss` `clubs.uba` `clubs.wec` `clubs.sports` `clubs.iqac` `clubs.anti_ragging` `clubs.other` | club page + their events |
| Notices | `notices` | notice board + announcement ticker |
| Gallery | `gallery` | all gallery categories + items + videos |
| Compliance | `compliance.naac` | NAAC docs + grades |
| | `compliance.nirf` | NIRF records |
| | `compliance.committees` | committee membership |
| | `compliance.policies` | policy PDFs |
| Careers | `careers.positions` | job listings |
| | `careers.applications` | application inbox |
| | `careers.jrf` | JRF postings |
| Alumni | `alumni.speaks` | featured profiles |
| | `alumni.chapters` | chapter list |
| | `alumni.mentorship` | mentorship programmes |
| | `alumni.membership` | membership page (settings-backed) |
| Forms | `forms.contact` | contact inbox |
| | `forms.grievance` | grievance inbox |
| System | `users.manage` | create/edit/disable editors |
| | `audit.read` | audit log |
| | `backups.run` | trigger DB backup |

## How endpoint protection is wired

Inside any router:

```python
from app.deps import require, super_admin, get_current_user, has_any_scope

@router.post("/labs", dependencies=[Depends(require("dept.cse", "site.pages"))])
def create_lab(...): ...
```

`require(*scopes)` returns 403 unless the user is `super_admin` **or** has at
least one of the listed scopes. For per-row authorisation (a `dept.cse` editor
can edit the CSE row but not ECE), the router calls:

```python
def _require_dept_edit(dept, actor):
    if has_any_scope(actor, ("site.pages",)):
        return
    if dept.scope_key and has_any_scope(actor, [dept.scope_key]):
        return
    raise ForbiddenError(...)
```

The same pattern auto-resolves events from `club.scope_key`, gallery items
from `category.scope_key`, etc.

## Audit + cache invalidation

Every mutation route ends with:

```python
audit.record(db, user_id=actor.id, action="lab.create", entity_type="lab",
             entity_id=obj.id, after={"name": obj.name}, ip=request.client.host)
```

`services.audit.record` does two things:

1. Inserts an immutable row into `audit_log`.
2. Looks `entity_type` up in `_INVALIDATION_MAP` and bumps the matching
   Redis cache tags so the next public read rebuilds.

So scope enforcement, audit trail and cache invalidation all flow from the
same one-line helper.

## Adding a new scope

1. Append a `ScopeDef(...)` to `SCOPES` in [`backend/app/core/rbac.py`](../backend/app/core/rbac.py).
2. Run `python -m scripts.seed_scopes` (or just `python -m scripts.seed` —
   it's idempotent).
3. Use `Depends(require("your.new.scope"))` in the router.
4. Add the entity_type → tags mapping in `services/audit.py` if it should bust
   any public-payload caches.
5. Give the scope to a user via `POST /api/users/{id}/scopes` or the
   `/admin/users` UI.

## Key rotation

- **JWT_SECRET**: rotate quarterly. Editing `.env` and restarting the API forces
  every refresh token to fail signature check on next use; users re-login.
- **GPG backup recipient**: rotate annually. Generate new key, re-encrypt the
  latest dump under the new recipient, distribute new pubkey, remove old
  fingerprint from VPS keyring.
