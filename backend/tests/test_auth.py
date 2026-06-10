from __future__ import annotations


def test_health_ready(client):
    r = client.get("/api/health/ready")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_login_and_me(client):
    r = client.post(
        "/api/auth/login",
        data={"username": "admin", "password": "admin123"},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["role"] == "super_admin"
    assert body["access_token"]
    assert body["refresh_token"]

    me = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {body['access_token']}"},
    )
    assert me.status_code == 200
    assert me.json()["username"] == "admin"
    assert me.json()["role"] == "super_admin"


def test_login_invalid(client):
    r = client.post("/api/auth/login", data={"username": "admin", "password": "wrong"})
    assert r.status_code == 401


def test_refresh_flow(client):
    r1 = client.post("/api/auth/login", data={"username": "admin", "password": "admin123"})
    refresh = r1.json()["refresh_token"]
    r2 = client.post("/api/auth/refresh", json={"refresh_token": refresh})
    assert r2.status_code == 200
    assert r2.json()["access_token"]
    # old refresh now revoked
    r3 = client.post("/api/auth/refresh", json={"refresh_token": refresh})
    assert r3.status_code == 401
