from __future__ import annotations


def test_public_home_returns_seeded_sections(client):
    r = client.get("/api/public/page//")
    assert r.status_code == 200
    body = r.json()
    assert body["key"] == "home"
    assert "hero" in body["sections"]
    assert body["sections"]["hero"]["kind"] == "hero"
    assert body["sections"]["hero"]["payload"]["headline"] == "Think Big. Think Beyond."


def test_admin_can_edit_hero_section(client, admin_token, auth_headers):
    page = client.get("/api/pages", headers=auth_headers(admin_token)).json()[0]
    r = client.patch(
        f"/api/pages/{page['id']}/sections/hero",
        headers=auth_headers(admin_token),
        json={
            "payload": {
                "headline": "Shape Tomorrow at ITM",
                "subhead": "Updated through the CMS.",
                "primary_cta": {"label": "Apply Now", "href": "/admissions"},
                "slides": [],
                "mini_stats": [],
            }
        },
    )
    assert r.status_code == 200, r.text
    assert r.json()["payload"]["headline"] == "Shape Tomorrow at ITM"

    # Public payload reflects the change
    public = client.get("/api/public/home").json()
    assert public["sections"]["hero"]["payload"]["headline"] == "Shape Tomorrow at ITM"


def test_cs_editor_cannot_edit_home_sections(client, cs_editor_token, auth_headers):
    page = client.get("/api/pages", headers=auth_headers(cs_editor_token)).json()[0]
    r = client.patch(
        f"/api/pages/{page['id']}/sections/hero",
        headers=auth_headers(cs_editor_token),
        json={"payload": {"headline": "Should be blocked"}},
    )
    assert r.status_code == 403


def test_page_create_and_meta_roundtrip(client, admin_token, auth_headers):
    r = client.post(
        "/api/pages",
        headers=auth_headers(admin_token),
        json={
            "key": "about",
            "path": "/about",
            "title": "About",
            "meta_title": "About ITM Gwalior",
            "meta_description": "Learn about ITM Gwalior — history, vision, leadership.",
            "meta_keywords": ["about", "history"],
            "scope_key": "site.pages",
        },
    )
    assert r.status_code == 201, r.text
    page_id = r.json()["id"]

    upd = client.patch(
        f"/api/pages/{page_id}",
        headers=auth_headers(admin_token),
        json={"meta_title": "About ITM"},
    )
    assert upd.status_code == 200
    assert upd.json()["meta_title"] == "About ITM"

    public = client.get("/api/public/page/about").json()
    assert public["meta"]["title"] == "About ITM"
