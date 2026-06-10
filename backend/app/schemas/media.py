from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class MediaVariant(BaseModel):
    key: str
    url: str
    width: int


class MediaOut(BaseModel):
    id: int
    kind: str
    public_url: str
    mime: str
    size_bytes: int
    width: int | None = None
    height: int | None = None
    alt: str | None = None
    caption: str | None = None
    folder: str | None = None
    original_name: str | None = None
    variants: list[MediaVariant] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class MediaUpdate(BaseModel):
    alt: str | None = None
    caption: str | None = None
    folder: str | None = None
