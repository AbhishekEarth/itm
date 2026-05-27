from __future__ import annotations


def test_super_admin_can_list_users(client, admin_token, auth_headers):
    r = client.get("/api/users", headers=auth_headers(admin_token))
    assert r.status_code == 200
    usernames = {u["username"] for u in r.json()}
    assert {"admin", "cs_editor", "placement_editor"} <= usernames


def test_super_admin_can_create_scoped_editor(client, admin_token, auth_headers):
    r = client.post(
        "/api/users",
        headers=auth_headers(admin_token),
        json={
            "username": "ece_editor_new",
            "email": "ece-editor@itmgoi.in",
            "full_name": "ECE Editor",
            "role": "editor",
            "password": "ece-editor@123",
            "scopes": ["dept.ece"],
        },
    )
    assert r.status_code == 201, r.text
    user = r.json()
    assert user["role"] == "editor"
    assert user["scopes"] == ["dept.ece"]

    # newly created user can log in and sees only its scope
    login = client.post(
        "/api/auth/login", data={"username": "ece_editor_new", "password": "ece-editor@123"}
    ).json()
    assert login["scopes"] == ["dept.ece"]


def test_create_user_rejects_unknown_scope(client, admin_token, auth_headers):
    r = client.post(
        "/api/users",
        headers=auth_headers(admin_token),
        json={
            "username": "bad_user",
            "email": "bad@itmgoi.in",
            "role": "editor",
            "password": "whatever123",
            "scopes": ["does.not.exist"],
        },
    )
    assert r.status_code == 400
    assert r.json()["error"]["code"] == "UNKNOWN_SCOPE"


def test_scope_grant_and_revoke(client, admin_token, auth_headers):
    # Pick the existing CS editor and add the placements scope, then revoke
    listing = client.get("/api/users?q=cs_editor", headers=auth_headers(admin_token)).json()
    user_id = listing[0]["id"]

    r1 = client.post(
        f"/api/users/{user_id}/scopes",
        headers=auth_headers(admin_token),
        json={"add": ["placements.tap"], "remove": []},
    )
    assert r1.status_code == 200
    assert set(r1.json()["scopes"]) == {"dept.cse", "placements.tap"}

    r2 = client.post(
        f"/api/users/{user_id}/scopes",
        headers=auth_headers(admin_token),
        json={"add": [], "remove": ["placements.tap"]},
    )
    assert r2.status_code == 200
    assert r2.json()["scopes"] == ["dept.cse"]


def test_admin_password_reset(client, admin_token, auth_headers):
    listing = client.get("/api/users?q=placement_editor", headers=auth_headers(admin_token)).json()
    user_id = listing[0]["id"]
    r = client.post(
        f"/api/users/{user_id}/password",
        headers=auth_headers(admin_token),
        json={"new_password": "newpass1234", "must_change_password": True},
    )
    assert r.status_code == 204

    login = client.post(
        "/api/auth/login", data={"username": "placement_editor", "password": "newpass1234"}
    ).json()
    assert login["user"]["must_change_password"] is True


def test_non_super_admin_cannot_deactivate(client, cs_editor_token, auth_headers):
    r = client.delete("/api/users/1", headers=auth_headers(cs_editor_token))
    assert r.status_code == 403


def test_scope_catalog_lists_all_seeded_scopes(client, cs_editor_token, auth_headers):
    """Any authenticated user can read the catalog (so the admin UI can render the scope picker)."""
    r = client.get("/api/scopes", headers=auth_headers(cs_editor_token))
    assert r.status_code == 200
    keys = {s["key"] for s in r.json()}
    assert {"dept.cse", "placements.tap", "research.publications"} <= keys


def test_audit_log_records_user_creation(client, admin_token, auth_headers):
    # Trigger a known auditable action
    client.post(
        "/api/users",
        headers=auth_headers(admin_token),
        json={
            "username": "audited_user",
            "email": "aud@itmgoi.in",
            "role": "editor",
            "password": "auditing12345",
        },
    )
    r = client.get(
        "/api/audit?entity_type=user&action=user.create",
        headers=auth_headers(admin_token),
    )
    assert r.status_code == 200
    body = r.json()
    assert body["total"] >= 1
    assert body["items"][0]["entity_type"] == "user"
    assert body["items"][0]["action"] == "user.create"
