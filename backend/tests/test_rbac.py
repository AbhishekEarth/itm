"""Verify scope enforcement on the users + audit endpoints.

Phase 1 only exposes a handful of scoped endpoints (users.manage, audit.read).
This file makes the test pattern table-driven so later phases can extend it.
"""
from __future__ import annotations

import pytest

# (method, path, scope_required) — covers Phase 1 surface
SCOPED_ENDPOINTS = [
    ("GET", "/api/users", "users.manage"),
    ("GET", "/api/audit", "audit.read"),
]


@pytest.mark.parametrize("method,path,scope", SCOPED_ENDPOINTS)
def test_scoped_endpoint_blocks_no_auth(client, method, path, scope):
    r = client.request(method, path)
    assert r.status_code == 401


@pytest.mark.parametrize("method,path,scope", SCOPED_ENDPOINTS)
def test_super_admin_can_call_everything(client, admin_token, auth_headers, method, path, scope):
    r = client.request(method, path, headers=auth_headers(admin_token))
    assert r.status_code == 200


@pytest.mark.parametrize("method,path,scope", SCOPED_ENDPOINTS)
def test_unscoped_editor_blocked(client, cs_editor_token, auth_headers, method, path, scope):
    """cs_editor only has dept.cse, so users.manage and audit.read should 403."""
    r = client.request(method, path, headers=auth_headers(cs_editor_token))
    assert r.status_code == 403, r.text


def test_cs_editor_carries_only_cs_scope(client, cs_editor_token, auth_headers):
    r = client.get("/api/auth/me", headers=auth_headers(cs_editor_token))
    body = r.json()
    assert body["role"] == "editor"
    assert body["scopes"] == ["dept.cse"]


def test_placement_editor_carries_only_placement_scope(client, placement_editor_token, auth_headers):
    r = client.get("/api/auth/me", headers=auth_headers(placement_editor_token))
    assert r.json()["scopes"] == ["placements.tap"]
