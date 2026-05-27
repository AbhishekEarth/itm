from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class SettingIn(BaseModel):
    value: Any
    group: str | None = None
    description: str | None = None


class SettingOut(BaseModel):
    key: str
    value: Any
    group: str | None = None
    description: str | None = None
    updated_at: datetime

    model_config = {"from_attributes": True}


class PageSectionOut(BaseModel):
    id: int
    section_key: str
    label: str | None = None
    kind: str
    position: int
    is_active: bool
    payload: Any = None

    model_config = {"from_attributes": True}


class PageSectionCreate(BaseModel):
    section_key: str = Field(..., min_length=1, max_length=64)
    label: str | None = Field(None, max_length=128)
    kind: str = Field(..., max_length=32)
    position: int = 0
    is_active: bool = True
    payload: Any = None


class PageSectionUpdate(BaseModel):
    label: str | None = None
    kind: str | None = None
    position: int | None = None
    is_active: bool | None = None
    payload: Any = None


class PageOut(BaseModel):
    id: int
    key: str
    path: str
    title: str
    intro_md: str | None = None
    hero_image_id: int | None = None
    hero_image_url: str | None = None
    status: str
    scope_key: str | None = None
    slug: str | None = None
    meta_title: str | None = None
    meta_description: str | None = None
    meta_keywords: list[str] | None = None
    og_image_id: int | None = None
    og_image_url: str | None = None
    canonical_url: str | None = None
    robots: str
    is_published: bool
    sections: list[PageSectionOut] = []

    model_config = {"from_attributes": True}


class PageCreate(BaseModel):
    key: str = Field(..., min_length=1, max_length=64)
    path: str = Field(..., min_length=1, max_length=255)
    title: str = Field(..., min_length=1, max_length=255)
    intro_md: str | None = None
    status: str = "published"
    scope_key: str | None = None
    slug: str | None = None
    meta_title: str | None = Field(None, max_length=70)
    meta_description: str | None = Field(None, max_length=255)
    meta_keywords: list[str] | None = None
    canonical_url: str | None = None
    robots: str = "index,follow"
    is_published: bool = True


class PageUpdate(BaseModel):
    title: str | None = None
    intro_md: str | None = None
    hero_image_id: int | None = None
    status: str | None = None
    scope_key: str | None = None
    slug: str | None = None
    meta_title: str | None = Field(None, max_length=70)
    meta_description: str | None = Field(None, max_length=255)
    meta_keywords: list[str] | None = None
    og_image_id: int | None = None
    canonical_url: str | None = None
    robots: str | None = None
    is_published: bool | None = None
