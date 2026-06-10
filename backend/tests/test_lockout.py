from __future__ import annotations


def test_lockout_after_repeated_failures(client):
    # conftest sets LOGIN_LOCKOUT_THRESHOLD=3
    for _ in range(3):
        r = client.post("/api/auth/login", data={"username": "admin", "password": "WRONG"})
        assert r.status_code == 401

    # Even the correct password should now be blocked
    r = client.post("/api/auth/login", data={"username": "admin", "password": "admin123"})
    assert r.status_code == 403
    assert r.json()["error"]["code"] == "FORBIDDEN"
