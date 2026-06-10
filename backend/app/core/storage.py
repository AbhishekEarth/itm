"""File storage adapter — local filesystem or S3-compatible object storage."""
from __future__ import annotations

import hashlib
import mimetypes
import os
import uuid
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import BinaryIO

from app.core.config import settings


@dataclass
class StoredObject:
    storage_key: str       # path within bucket / upload dir
    public_url: str        # what the frontend should use to fetch
    size: int
    sha256: str
    mime: str


class LocalStorage:
    def __init__(self, root: str, public_base: str) -> None:
        self.root = Path(root).resolve()
        self.public_base = public_base.rstrip("/")
        self.root.mkdir(parents=True, exist_ok=True)

    def save(self, file_obj: BinaryIO, *, original_name: str, folder: str = "misc") -> StoredObject:
        suffix = Path(original_name).suffix.lower()
        now = datetime.now(UTC)
        rel_dir = Path(folder) / f"{now.year:04d}" / f"{now.month:02d}"
        (self.root / rel_dir).mkdir(parents=True, exist_ok=True)

        unique = uuid.uuid4().hex
        key = (rel_dir / f"{unique}{suffix}").as_posix()
        out_path = self.root / key

        sha = hashlib.sha256()
        size = 0
        with out_path.open("wb") as f:
            while chunk := file_obj.read(64 * 1024):
                size += len(chunk)
                sha.update(chunk)
                f.write(chunk)

        mime, _ = mimetypes.guess_type(out_path.name)
        return StoredObject(
            storage_key=key,
            public_url=f"{self.public_base}/{key}",
            size=size,
            sha256=sha.hexdigest(),
            mime=mime or "application/octet-stream",
        )

    def delete(self, storage_key: str) -> None:
        path = self.root / storage_key
        if path.exists():
            path.unlink()


class S3Storage:
    def __init__(self) -> None:
        import boto3

        self.bucket = settings.S3_BUCKET
        self.public_base = (settings.S3_PUBLIC_BASE_URL or "").rstrip("/")
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.S3_ENDPOINT_URL or None,
            region_name=settings.S3_REGION,
            aws_access_key_id=settings.S3_ACCESS_KEY,
            aws_secret_access_key=settings.S3_SECRET_KEY,
        )

    def save(self, file_obj: BinaryIO, *, original_name: str, folder: str = "misc") -> StoredObject:
        suffix = Path(original_name).suffix.lower()
        now = datetime.now(UTC)
        key = f"{folder}/{now.year:04d}/{now.month:02d}/{uuid.uuid4().hex}{suffix}"

        body = file_obj.read()
        size = len(body)
        sha = hashlib.sha256(body).hexdigest()
        mime, _ = mimetypes.guess_type(original_name)
        mime = mime or "application/octet-stream"

        self.client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=body,
            ContentType=mime,
            CacheControl="public, max-age=31536000, immutable",
        )

        url = f"{self.public_base}/{key}" if self.public_base else f"{settings.S3_ENDPOINT_URL}/{self.bucket}/{key}"
        return StoredObject(storage_key=key, public_url=url, size=size, sha256=sha, mime=mime)

    def delete(self, storage_key: str) -> None:
        self.client.delete_object(Bucket=self.bucket, Key=storage_key)


def get_storage():
    if settings.STORAGE_BACKEND == "s3":
        return S3Storage()
    return LocalStorage(root=settings.UPLOAD_DIR, public_base=settings.PUBLIC_MEDIA_BASE_URL)


def upload_dir_exists() -> bool:
    return os.path.isdir(settings.UPLOAD_DIR)
