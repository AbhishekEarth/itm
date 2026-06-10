"""Glue between the storage adapter and the MediaAsset row.

Stores the original asset; for images, also pushes ``thumb`` / ``card`` / ``hero``
WebP variants next to it so the frontend can use ``srcset``.
"""
from __future__ import annotations

import io
import os
from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.errors import AppError
from app.core.storage import get_storage
from app.models import MediaAsset
from app.services import images as imgsvc

ALLOWED_IMAGE_MIMES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
ALLOWED_PDF_MIMES = {"application/pdf"}
ALLOWED_VIDEO_MIMES = {"video/mp4", "video/quicktime", "video/webm"}
ALLOWED_DOC_MIMES = {
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}


@dataclass
class SaveResult:
    asset: MediaAsset
    variants: list[dict]


def _classify(mime: str) -> str:
    if mime in ALLOWED_IMAGE_MIMES:
        return "image"
    if mime in ALLOWED_PDF_MIMES:
        return "pdf"
    if mime in ALLOWED_VIDEO_MIMES:
        return "video"
    if mime in ALLOWED_DOC_MIMES:
        return "doc"
    raise AppError("UNSUPPORTED_MEDIA", f"Unsupported mime type: {mime}", status_code=415)


def _enforce_size(kind: str, size_bytes: int) -> None:
    limits = {
        "image": settings.MAX_UPLOAD_MB_IMAGE,
        "pdf": settings.MAX_UPLOAD_MB_PDF,
        "video": settings.MAX_UPLOAD_MB_VIDEO,
        "doc": settings.MAX_UPLOAD_MB_PDF,
    }
    cap_mb = limits.get(kind, 10)
    if size_bytes > cap_mb * 1024 * 1024:
        raise AppError("FILE_TOO_LARGE", f"File exceeds {cap_mb} MB limit.", status_code=413)


def _variant_key(original_storage_key: str, label: str) -> str:
    root, _ext = os.path.splitext(original_storage_key)
    return f"{root}.{label}.webp"


def save_upload(
    db: Session,
    *,
    raw: bytes,
    mime: str,
    original_name: str,
    folder: str | None = None,
    alt: str | None = None,
    caption: str | None = None,
    uploaded_by_user_id: int | None = None,
) -> SaveResult:
    kind = _classify(mime)
    _enforce_size(kind, len(raw))

    storage = get_storage()
    stored = storage.save(io.BytesIO(raw), original_name=original_name, folder=folder or kind)

    width = height = None
    variant_records: list[dict] = []

    if kind == "image" and mime != "image/svg+xml":
        meta = imgsvc.probe(raw)
        if meta:
            width, height = meta.width, meta.height
        for label, max_w in imgsvc.VARIANTS.items():
            if width and width <= max_w:
                # Don't upscale; reference the original
                variant_records.append({"key": label, "url": stored.public_url, "width": width or max_w})
                continue
            try:
                vbytes = imgsvc.make_variant(raw, max_width=max_w)
            except Exception:
                continue
            vstored = storage.save(
                io.BytesIO(vbytes),
                original_name=_variant_key(os.path.basename(stored.storage_key), label),
                folder=folder or kind,
            )
            variant_records.append({"key": label, "url": vstored.public_url, "width": max_w})

    asset = MediaAsset(
        kind=kind,
        storage_key=stored.storage_key,
        public_url=stored.public_url,
        mime=mime,
        size_bytes=stored.size,
        width=width,
        height=height,
        sha256=stored.sha256,
        alt=alt,
        caption=caption,
        folder=folder,
        original_name=original_name,
        created_by_user_id=uploaded_by_user_id,
        updated_by_user_id=uploaded_by_user_id,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return SaveResult(asset=asset, variants=variant_records)
