from __future__ import annotations

import io

from PIL import Image


def _png_bytes(width: int = 800, height: int = 500) -> bytes:
    im = Image.new("RGB", (width, height), color=(128, 0, 0))
    buf = io.BytesIO()
    im.save(buf, format="PNG")
    return buf.getvalue()


def test_upload_image_requires_scope(client):
    r = client.post(
        "/api/media",
        files={"file": ("hero.png", _png_bytes(), "image/png")},
        data={"folder": "hero"},
    )
    assert r.status_code == 401


def test_admin_upload_produces_variants(client, admin_token, auth_headers, tmp_path, monkeypatch):
    # Force LocalStorage to use an isolated tmp dir so we don't litter the project
    from app.core.storage import LocalStorage
    from app.services import media as media_svc

    monkeypatch.setattr(
        media_svc, "get_storage", lambda: LocalStorage(root=str(tmp_path), public_base="/uploads")
    )

    r = client.post(
        "/api/media",
        headers=auth_headers(admin_token),
        files={"file": ("hero.png", _png_bytes(), "image/png")},
        data={"folder": "hero", "alt": "Hero image"},
    )
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["kind"] == "image"
    assert body["alt"] == "Hero image"
    assert body["width"] == 800 and body["height"] == 500
    keys = {v["key"] for v in body["variants"]}
    assert {"thumb", "card", "hero"} <= keys


def test_unsupported_mime_rejected(client, admin_token, auth_headers):
    r = client.post(
        "/api/media",
        headers=auth_headers(admin_token),
        files={"file": ("malware.exe", b"MZ\x90\x00", "application/x-msdownload")},
    )
    assert r.status_code == 415
    assert r.json()["error"]["code"] == "UNSUPPORTED_MEDIA"
