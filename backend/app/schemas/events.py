from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, Field


# ── ClubCell ─────────────────────────────────────────────────────────
class ClubCellIn(BaseModel):
    code: str = Field(..., min_length=1, max_length=32)
    name: str = Field(..., min_length=1, max_length=255)
    type: str = "club"
    description: str | None = None
    icon: str | None = None
    accent: str | None = None
    logo_id: int | None = None
    logo_url: str | None = None
    page_path: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    scope_key: str | None = None
    tags: list[str] | None = None


class ClubCellOut(ClubCellIn):
    id: int
    resolved_logo_url: str | None = None

    model_config = {"from_attributes": True}


class ClubCellUpdate(BaseModel):
    name: str | None = None
    type: str | None = None
    description: str | None = None
    icon: str | None = None
    accent: str | None = None
    logo_id: int | None = None
    logo_url: str | None = None
    page_path: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    scope_key: str | None = None
    tags: list[str] | None = None


# ── Event ────────────────────────────────────────────────────────────
class EventIn(BaseModel):
    club_id: int | None = None
    title: str = Field(..., min_length=1, max_length=255)
    description_md: str | None = None
    event_date: date | None = None
    event_end_date: date | None = None
    location: str | None = None
    banner_id: int | None = None
    banner_url: str | None = None
    registration_url: str | None = None
    type: str | None = None
    status: str = "upcoming"
    is_featured: bool = False
    sort_order: int = 0


class EventOut(EventIn):
    id: int
    resolved_banner_url: str | None = None
    club_code: str | None = None
    club_name: str | None = None

    model_config = {"from_attributes": True}


# ── Notice ───────────────────────────────────────────────────────────
class NoticeIn(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    body_md: str | None = None
    pdf_id: int | None = None
    pdf_url: str | None = None
    audience: list[str] | None = None
    priority: str = "normal"
    published_at: datetime | None = None
    expires_on: date | None = None
    is_active: bool = True
    sort_order: int = 0


class NoticeOut(NoticeIn):
    id: int
    resolved_pdf_url: str | None = None

    model_config = {"from_attributes": True}


# ── Announcement ─────────────────────────────────────────────────────
class AnnouncementIn(BaseModel):
    message: str = Field(..., min_length=1, max_length=512)
    link: str | None = None
    starts_on: datetime | None = None
    ends_on: datetime | None = None
    level: str = "info"
    is_active: bool = True
    sort_order: int = 0


class AnnouncementOut(AnnouncementIn):
    id: int

    model_config = {"from_attributes": True}


# ── Gallery category ─────────────────────────────────────────────────
class GalleryCategoryIn(BaseModel):
    slug: str = Field(..., min_length=1, max_length=64)
    label: str = Field(..., min_length=1, max_length=128)
    icon: str | None = None
    accent: str | None = None
    description: str | None = None
    cover_media_id: int | None = None
    cover_url: str | None = None
    scope_key: str | None = None
    sort_order: int = 0


class GalleryCategoryOut(GalleryCategoryIn):
    id: int
    resolved_cover_url: str | None = None
    item_count: int = 0

    model_config = {"from_attributes": True}


# ── Gallery item ─────────────────────────────────────────────────────
class GalleryItemIn(BaseModel):
    media_id: int | None = None
    media_url: str | None = None
    caption: str | None = None
    photographer: str | None = None
    captured_on: date | None = None
    is_active: bool = True
    sort_order: int = 0


class GalleryItemOut(GalleryItemIn):
    id: int
    category_id: int
    resolved_media_url: str | None = None

    model_config = {"from_attributes": True}


class GalleryBulkAdd(BaseModel):
    media_ids: list[int] = Field(default_factory=list)
    media_urls: list[str] = Field(default_factory=list)
    caption: str | None = None


# ── Video ────────────────────────────────────────────────────────────
class VideoIn(BaseModel):
    category_id: int | None = None
    title: str = Field(..., min_length=1, max_length=255)
    youtube_id: str | None = None
    mp4_media_id: int | None = None
    mp4_url: str | None = None
    cover_id: int | None = None
    cover_url: str | None = None
    duration_seconds: int | None = None
    sort_order: int = 0
    is_active: bool = True


class VideoOut(VideoIn):
    id: int
    resolved_mp4_url: str | None = None
    resolved_cover_url: str | None = None

    model_config = {"from_attributes": True}
