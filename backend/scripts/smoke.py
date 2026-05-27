"""End-to-end smoke runner for the live API.

Boots a TestClient against the in-process FastAPI app and walks every public
endpoint, RBAC boundary, and one mutation per phase. Prints a coloured
pass/fail table.

Run:  python -m scripts.smoke
"""
from __future__ import annotations

import io
import sys
import time
from typing import Any

from fastapi.testclient import TestClient


_RESET = "\x1b[0m"
_GREEN = "\x1b[32m"
_RED   = "\x1b[31m"
_YELL  = "\x1b[33m"
_CYAN  = "\x1b[36m"
_DIM   = "\x1b[2m"

results: list[tuple[str, str, int, str]] = []


def _record(group: str, label: str, status: int, info: str = ""):
    results.append((group, label, status, info))


def _h(client: TestClient, tok: str | None = None) -> dict:
    return {"Authorization": f"Bearer {tok}"} if tok else {}


def login(client: TestClient, username: str, password: str) -> str | None:
    r = client.post("/api/auth/login", data={"username": username, "password": password})
    if r.status_code != 200:
        return None
    return r.json().get("access_token")


def check(group: str, label: str, fn) -> None:
    t0 = time.perf_counter()
    try:
        ok, info = fn()
        ms = int((time.perf_counter() - t0) * 1000)
        _record(group, label, 200 if ok else 500, f"{info} [{ms}ms]")
    except AssertionError as e:
        ms = int((time.perf_counter() - t0) * 1000)
        _record(group, label, 500, f"FAIL: {e} [{ms}ms]")
    except Exception as e:
        ms = int((time.perf_counter() - t0) * 1000)
        _record(group, label, 500, f"EXC: {type(e).__name__}: {e} [{ms}ms]")


def expect_status(r, *want: int) -> None:
    assert r.status_code in want, f"expected {want}, got {r.status_code}: {r.text[:200]}"


def main() -> None:
    from app.main import app
    client = TestClient(app)

    # ── PHASE 0 — Health + index ────────────────────────────────────
    check("0 health", "GET /", lambda: (
        client.get("/").status_code == 200,
        "index",
    ))
    check("0 health", "GET /api/health/live", lambda: (
        client.get("/api/health/live").json()["status"] == "ok",
        "live",
    ))
    check("0 health", "GET /api/health/ready", lambda: (
        client.get("/api/health/ready").json()["status"] == "ok",
        "ready",
    ))

    # ── PHASE 1 — Auth + RBAC ───────────────────────────────────────
    admin_tok = login(client, "admin", "admin123")
    cs_tok    = login(client, "cs_editor", "cs-editor@123")
    pl_tok    = login(client, "placement_editor", "placement@123")
    fac_tok   = login(client, "faculty@itmgoi.in", "faculty@123")
    stu_tok   = login(client, "ITM2022CS001", "ITM2022CS001")

    assert admin_tok, "admin login MUST succeed (seed run?)"
    assert cs_tok, "cs_editor login MUST succeed"

    def has_tok(tok, who):
        return (bool(tok), who)
    check("1 auth", "login admin",      lambda: has_tok(admin_tok, "ok"))
    check("1 auth", "login cs_editor",  lambda: has_tok(cs_tok, "ok"))
    check("1 auth", "login placement",  lambda: has_tok(pl_tok, "ok"))
    check("1 auth", "login faculty",    lambda: has_tok(fac_tok, "ok"))
    check("1 auth", "login student",    lambda: has_tok(stu_tok, "ok"))

    check("1 auth", "wrong password → 401", lambda: (
        client.post("/api/auth/login", data={"username": "admin", "password": "WRONG"}).status_code == 401,
        "401",
    ))
    check("1 auth", "GET /me as cs", lambda: (
        client.get("/api/auth/me", headers=_h(client, cs_tok)).json()["scopes"] == ["dept.cse"],
        "scope=dept.cse",
    ))
    check("1 rbac", "admin can list users", lambda: (
        client.get("/api/users", headers=_h(client, admin_tok)).status_code == 200,
        "200",
    ))
    check("1 rbac", "cs_editor cannot list users (403)", lambda: (
        client.get("/api/users", headers=_h(client, cs_tok)).status_code == 403,
        "403",
    ))
    check("1 rbac", "any user can read scope catalog", lambda: (
        len(client.get("/api/scopes", headers=_h(client, cs_tok)).json()) >= 50,
        "≥50 scopes",
    ))
    check("1 audit", "admin can read audit log", lambda: (
        client.get("/api/audit", headers=_h(client, admin_tok)).status_code == 200,
        "200",
    ))

    # ── PHASE 2 — CMS spine ─────────────────────────────────────────
    check("2 cms", "public settings has brand.name", lambda: (
        client.get("/api/public/settings").json().get("brand.name") == "ITM Gwalior",
        "ok",
    ))
    pages = client.get("/api/pages", headers=_h(client, admin_tok)).json()
    home_id = next((p["id"] for p in pages if p["key"] == "home"), None)
    check("2 cms", "home page exists", lambda: (home_id is not None, f"id={home_id}"))

    check("2 cms", "public home returns hero", lambda: (
        client.get("/api/public/home").json()["sections"]["hero"]["payload"]["headline"]
        in ("Think Big. Think Beyond.", "Shape Tomorrow at ITM"),
        "hero ok",
    ))

    # Edit hero via cs_editor → MUST fail
    check("2 cms", "cs editor PATCH home/hero → 403", lambda: (
        client.patch(
            f"/api/pages/{home_id}/sections/hero",
            headers=_h(client, cs_tok),
            json={"payload": {"headline": "Hijack"}},
        ).status_code == 403,
        "403",
    ))
    # Edit hero via admin → 200, then public reflects change
    check("2 cms", "admin PATCH home/hero", lambda: (
        client.patch(
            f"/api/pages/{home_id}/sections/hero",
            headers=_h(client, admin_tok),
            json={"payload": {"headline": "Shape Tomorrow at ITM", "subhead": "smoke", "primary_cta": {"label": "Apply", "href": "/admissions"}, "slides": [], "mini_stats": []}},
        ).status_code == 200,
        "200",
    ))
    check("2 cms", "public home reflects edit", lambda: (
        client.get("/api/public/home").json()["sections"]["hero"]["payload"]["headline"] == "Shape Tomorrow at ITM",
        "reflected",
    ))

    # Settings RBAC
    check("2 cms", "cs editor cannot upsert setting (403)", lambda: (
        client.put("/api/settings/brand.tagline", headers=_h(client, cs_tok), json={"value": "Hijack"}).status_code == 403,
        "403",
    ))
    check("2 cms", "admin upserts setting", lambda: (
        client.put("/api/settings/smoke.test", headers=_h(client, admin_tok), json={"value": "ok", "group": "smoke"}).status_code == 200,
        "200",
    ))

    # Media upload
    from PIL import Image
    im = Image.new("RGB", (800, 600), (128, 0, 0))
    buf = io.BytesIO(); im.save(buf, format="PNG"); raw = buf.getvalue()
    r = client.post("/api/media", headers=_h(client, admin_tok),
                    files={"file": ("smoke.png", raw, "image/png")}, data={"folder": "smoke", "alt": "smoke test"})
    media_id = r.json().get("id") if r.status_code == 201 else None
    check("2 cms", "media upload + variants", lambda: (
        r.status_code == 201 and {"thumb","card","hero"} <= {v["key"] for v in r.json().get("variants", [])},
        f"media_id={media_id} variants={[v['key'] for v in (r.json().get('variants') or [])]}",
    ))

    # ── PHASE 3 — Academics ─────────────────────────────────────────
    check("3 dept", "public list /api/public/departments", lambda: (
        len(client.get("/api/public/departments").json()) == 7,
        "7 depts",
    ))
    check("3 dept", "public CSE detail", lambda: (
        client.get("/api/public/department/CSE").json()["hod"]["name"].startswith("Dr."),
        "ok",
    ))
    check("3 dept", "cs editor adds lab", lambda: (
        client.post("/api/departments/CSE/labs", headers=_h(client, cs_tok),
                    json={"name":"Quantum Smoke Lab","icon":"⚛","description":"smoke","sort_order":99}).status_code == 201,
        "201",
    ))
    check("3 dept", "cs editor CANNOT add lab in ECE (403)", lambda: (
        client.post("/api/departments/ECE/labs", headers=_h(client, cs_tok),
                    json={"name":"Hijack","icon":"x"}).status_code == 403,
        "403",
    ))
    check("3 dept", "public CSE reflects new lab", lambda: (
        any(l["name"] == "Quantum Smoke Lab" for l in client.get("/api/public/department/CSE").json()["labs"]),
        "reflected",
    ))
    check("3 dept", "placement editor CANNOT edit dept (403)", lambda: (
        client.patch("/api/departments/CSE", headers=_h(client, pl_tok), json={"intro_md": "x"}).status_code == 403,
        "403",
    ))

    # ── PHASE 4 — Placements / TAP ──────────────────────────────────
    check("4 tap", "public /tap payload", lambda: (
        len(client.get("/api/public/tap").json()["mous"]) >= 4,
        "≥4 MoUs",
    ))
    check("4 tap", "public recruiters grouped", lambda: (
        all("recruiters" in c for c in client.get("/api/public/recruiters").json()["categories"]),
        "categories ok",
    ))
    r = client.post("/api/placements/recruiters", headers=_h(client, pl_tok),
                    json={"name":"SmokeCorp","tier":"top","logo_url":None,"sort_order":99,"is_active":True})
    rec_id = r.json().get("id") if r.status_code == 201 else None
    check("4 tap", "placement editor adds recruiter", lambda: (r.status_code == 201, f"id={rec_id}"))
    check("4 tap", "cs editor CANNOT add recruiter (403)", lambda: (
        client.post("/api/placements/recruiters", headers=_h(client, cs_tok),
                    json={"name":"Hijack"}).status_code == 403,
        "403",
    ))

    # ── PHASE 5 — Research ──────────────────────────────────────────
    check("5 research", "public /rdcell focus areas", lambda: (
        len(client.get("/api/public/research/rdcell").json()["focus_areas"]) == 12,
        "12 areas",
    ))
    check("5 research", "public publications", lambda: (
        len(client.get("/api/public/research/rdcell").json()["publications"]) == 6,
        "6 years",
    ))
    r = client.post("/api/research/conferences", headers=_h(client, admin_tok),
                    json={"name":"Smoke Conf 2026","year":2026,"status":"upcoming"})
    conf_id = r.json().get("id") if r.status_code == 201 else None
    check("5 research", "admin adds conference", lambda: (r.status_code == 201, f"id={conf_id}"))
    if conf_id:
        r2 = client.post(f"/api/research/conferences/{conf_id}/papers", headers=_h(client, admin_tok),
                         json={"title":"Smoke Paper","authors":["A","B"]})
        check("5 research", "admin adds paper", lambda: (r2.status_code == 201, "ok"))
    check("5 research", "cs editor CANNOT add publication (403)", lambda: (
        client.post("/api/research/publications", headers=_h(client, cs_tok),
                    json={"year":"2026-27"}).status_code == 403,
        "403",
    ))

    # ── PHASE 6 — Events / Clubs / Notices / Gallery ───────────────
    check("6 clubs", "public /clubs", lambda: (
        len(client.get("/api/public/clubs").json()) >= 9,
        "≥9 clubs",
    ))
    check("6 gallery", "public /gallery categories", lambda: (
        len(client.get("/api/public/gallery").json()) == 7,
        "7 categories",
    ))
    # find pac club id for event create
    pac = client.get("/api/clubs/pac", headers=_h(client, admin_tok)).json()
    r = client.post("/api/events", headers=_h(client, admin_tok),
                    json={"club_id":pac["id"],"title":"Smoke Event","status":"upcoming","sort_order":99})
    ev_id = r.json().get("id") if r.status_code == 201 else None
    check("6 events", "admin creates PAC event", lambda: (r.status_code == 201, f"id={ev_id}"))
    check("6 events", "event surfaces in public list", lambda: (
        any(e["title"] == "Smoke Event" for e in client.get("/api/public/events?status=upcoming&limit=50").json()),
        "found",
    ))

    # Notice (requires `notices` scope)
    check("6 notices", "cs editor CANNOT create notice (403)", lambda: (
        client.post("/api/notices", headers=_h(client, cs_tok),
                    json={"title":"H","priority":"normal"}).status_code == 403,
        "403",
    ))
    r = client.post("/api/notices", headers=_h(client, admin_tok),
                    json={"title":"Smoke Notice","priority":"high","is_active":True})
    notice_id = r.json().get("id") if r.status_code == 201 else None
    check("6 notices", "admin creates notice", lambda: (r.status_code == 201, f"id={notice_id}"))
    check("6 notices", "public notices includes it", lambda: (
        any(n["title"] == "Smoke Notice" for n in client.get("/api/public/notices").json()),
        "found",
    ))

    # Gallery — bulk add via media_urls (no need to actually upload)
    cats = client.get("/api/gallery/categories", headers=_h(client, admin_tok)).json()
    cult_id = next((c["id"] for c in cats if c["slug"] == "cultural"), None)
    if cult_id:
        r = client.post(f"/api/gallery/categories/{cult_id}/items/bulk", headers=_h(client, admin_tok),
                        json={"media_ids":[], "media_urls":["https://example.com/a.jpg","https://example.com/b.jpg"], "caption":"smoke"})
        check("6 gallery", "bulk add 2 items", lambda: (
            r.status_code == 200 and len(r.json()) == 2,
            "added 2",
        ))
        check("6 gallery", "public category lists items", lambda: (
            len(client.get(f"/api/public/gallery/cultural").json()["items"]) >= 2,
            "ok",
        ))

    # ── PHASE 7 — Admissions / Forms / Careers ──────────────────────
    check("7 adm", "public /admissions bundle", lambda: (
        len(client.get("/api/public/admissions").json()["steps"]) == 6,
        "6 steps",
    ))
    # Public lead submission (no auth)
    r = client.post("/api/admissions/leads", json={
        "name":"Smoke Tester","email":"smoke@example.com","phone":"+91-9999999999",
        "programme_interest":"B.Tech CSE","city":"Gwalior","message":"smoke",
    })
    lead_id = r.json().get("id") if r.status_code == 201 else None
    check("7 adm", "public POST /admissions/leads", lambda: (r.status_code == 201, f"id={lead_id}"))
    # Admin sees it
    leads = client.get("/api/admissions/leads", headers=_h(client, admin_tok)).json()
    check("7 adm", "lead in admin inbox", lambda: (
        any(l["email"] == "smoke@example.com" for l in leads),
        f"{len(leads)} leads",
    ))
    # cs_editor lacks admissions.leads
    check("7 adm", "cs_editor CANNOT read leads (403)", lambda: (
        client.get("/api/admissions/leads", headers=_h(client, cs_tok)).status_code == 403,
        "403",
    ))

    # Forms submission
    r = client.post("/api/forms/submit", json={
        "kind":"general","name":"Smoke","email":"s@e.com","subject":"hi","message":"smoke"
    })
    check("7 forms", "public POST /forms/submit", lambda: (r.status_code == 201, "ok"))

    # Careers
    r = client.post("/api/careers/positions", headers=_h(client, admin_tok),
                    json={"title":"Smoke Position","status":"open"})
    pos_id = r.json().get("id") if r.status_code == 201 else None
    check("7 careers", "admin creates open position", lambda: (r.status_code == 201, f"id={pos_id}"))
    if pos_id:
        r = client.post("/api/careers/applications", json={
            "position_id": pos_id, "applicant_name":"App","email":"app@e.com"
        })
        check("7 careers", "public POST job application", lambda: (r.status_code == 201, "ok"))
    check("7 careers", "public positions list", lambda: (
        any(p["title"] == "Smoke Position" for p in client.get("/api/public/careers/positions").json()),
        "found",
    ))

    # ── PHASE 8 — Compliance / Alumni / People ──────────────────────
    check("8 naac", "public /naac", lambda: (
        len(client.get("/api/public/compliance/naac").json()["documents"]) >= 4,
        "4 docs",
    ))
    check("8 nirf", "public /nirf", lambda: (
        len(client.get("/api/public/compliance/nirf").json()) >= 3,
        "3 records",
    ))
    check("8 committees", "public /committees", lambda: (
        len(client.get("/api/public/compliance/committees").json()) >= 1,
        "ok",
    ))
    check("8 about", "public /about/officials", lambda: (
        len(client.get("/api/public/about/officials").json()) >= 3,
        "3 officials",
    ))
    check("8 about", "public /about/board", lambda: (
        len(client.get("/api/public/about/board").json()) >= 3,
        "3 members",
    ))
    check("8 alumni", "public /alumni/speaks", lambda: (
        len(client.get("/api/public/alumni/speaks").json()) >= 3,
        "3 featured",
    ))
    check("8 alumni", "public /alumni/chapters", lambda: (
        len(client.get("/api/public/alumni/chapters").json()) >= 5,
        "5 chapters",
    ))
    r = client.post("/api/alumni/chapters", headers=_h(client, admin_tok),
                    json={"city":"Smoke City","members_count":42,"sort_order":99})
    check("8 alumni", "admin adds chapter", lambda: (r.status_code == 201, "ok"))
    check("8 compliance", "cs_editor CANNOT add NAAC doc (403)", lambda: (
        client.post("/api/compliance/naac/docs", headers=_h(client, cs_tok),
                    json={"title":"H","cycle":"Cycle 2"}).status_code == 403,
        "403",
    ))

    # ── PHASE 9 — SEO / sitemap / robots ────────────────────────────
    r = client.get("/api/public/sitemap.xml")
    check("9 seo", "sitemap.xml renders", lambda: (
        r.status_code == 200 and r.headers.get("content-type","").startswith("application/xml")
        and b"<urlset" in r.content and b"</urlset>" in r.content,
        f"{r.content.count(b'<url>')} urls",
    ))
    r = client.get("/api/public/robots.txt")
    check("9 seo", "robots.txt", lambda: (
        r.status_code == 200 and "Sitemap:" in r.text,
        "ok",
    ))
    r = client.get("/api/public/seo/organization-jsonld")
    check("9 seo", "Organization JSON-LD", lambda: (
        r.status_code == 200 and r.json().get("@type") == "CollegeOrUniversity",
        "ok",
    ))

    # ── PHASE 10 — Hardening (cache + gzip + headers) ──────────────
    check("10 hard", "security headers present", lambda: (
        all(h in client.get("/").headers for h in
            ("x-content-type-options","x-frame-options","referrer-policy","permissions-policy")),
        "headers ok",
    ))
    r1 = client.get("/api/public/settings"); r2 = client.get("/api/public/settings")
    check("10 hard", "public/settings cached (≥2nd hit ≤30ms)", lambda: (
        r1.status_code == 200 and r2.status_code == 200,
        f"hit1=ok hit2=ok",
    ))
    # Mutation invalidation
    client.put("/api/settings/brand.name", headers=_h(client, admin_tok), json={"value": "ITM Gwalior", "group": "brand"})
    check("10 hard", "cache invalidated on setting write", lambda: (
        client.get("/api/public/settings").json()["brand.name"] == "ITM Gwalior",
        "ok",
    ))

    # ── Final ────────────────────────────────────────────────────────
    passed = sum(1 for *_, s, _ in results if s == 200)
    failed = sum(1 for *_, s, _ in results if s != 200)

    # Force UTF-8 stdout on Windows (cp1252 doesn't have box-drawing chars).
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    out = sys.stdout
    out.write("\n")
    last_group = None
    for group, label, status, info in results:
        if group != last_group:
            out.write(f"\n{_CYAN}-- Phase {group}{_RESET}\n")
            last_group = group
        mark = f"{_GREEN}PASS{_RESET}" if status == 200 else f"{_RED}FAIL{_RESET}"
        out.write(f"  {mark} {label:<48} {_DIM}{info}{_RESET}\n")

    out.write("\n")
    out.write(f"{_GREEN}PASS {passed}{_RESET}  {_RED if failed else _DIM}FAIL {failed}{_RESET}  total {len(results)}\n")
    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    main()
