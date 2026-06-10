from __future__ import annotations


def test_public_settings_open_and_includes_brand(client):
    r = client.get("/api/public/settings")
    assert r.status_code == 200
    body = r.json()
    assert body["brand.name"] == "ITM Gwalior"
    assert "contact.primary" in body


def test_setting_update_requires_scope(client, cs_editor_token, auth_headers):
    r = client.put(
        "/api/settings/brand.tagline",
        headers=auth_headers(cs_editor_token),
        json={"value": "Hijacked"},
    )
    assert r.status_code == 403


def test_super_admin_can_update_setting(client, admin_token, auth_headers):
    r = client.put(
        "/api/settings/brand.tagline",
        headers=auth_headers(admin_token),
        json={"value": "Think Bigger. Think Bolder.", "group": "brand"},
    )
    assert r.status_code == 200
    assert r.json()["value"] == "Think Bigger. Think Bolder."

    # Reflected in the public payload
    public = client.get("/api/public/settings").json()
    assert public["brand.tagline"] == "Think Bigger. Think Bolder."

    # Audit recorded
    log = client.get(
        "/api/audit?entity_type=setting&entity_id=brand.tagline",
        headers=auth_headers(admin_token),
    ).json()
    assert log["total"] >= 1
    assert log["items"][0]["action"] == "setting.update"
