from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, Field


class WhatsNewIn(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    caption: str | None = None
    event_date: date | None = None
    image_id: int | None = None
    image_url: str | None = None
    link_url: str | None = None
    is_active: bool = True
    is_featured: bool = False
    sort_order: int = 0


class WhatsNewOut(WhatsNewIn):
    id: int
    resolved_image_url: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}
