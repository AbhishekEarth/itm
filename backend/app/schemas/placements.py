from __future__ import annotations

from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field


# ── Recruiters ──────────────────────────────────────────────────────
class RecruiterCategoryIn(BaseModel):
    key: str = Field(..., min_length=1, max_length=64)
    name: str = Field(..., min_length=1, max_length=128)
    sort_order: int = 0


class RecruiterCategoryOut(RecruiterCategoryIn):
    id: int
    model_config = {"from_attributes": True}


class RecruiterIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category_id: int | None = None
    sector: str | None = None
    tier: str = "standard"
    logo_id: int | None = None
    logo_url: str | None = None
    website: str | None = None
    sort_order: int = 0
    is_active: bool = True


class RecruiterOut(RecruiterIn):
    id: int
    resolved_logo_url: str | None = None
    category_key: str | None = None
    category_name: str | None = None
    model_config = {"from_attributes": True}


# ── Placement records / stats ───────────────────────────────────────
class PlacementRecordIn(BaseModel):
    student_name: str = Field(..., min_length=1, max_length=255)
    photo_id: int | None = None
    department_code: str | None = None
    programme: str | None = None
    batch_year: int | None = None
    company: str | None = None
    role: str | None = None
    location: str | None = None
    package_lpa: Decimal | None = None
    linkedin_url: str | None = None
    is_featured: bool = False
    sort_order: int = 0


class PlacementRecordOut(PlacementRecordIn):
    id: int
    photo_url: str | None = None
    model_config = {"from_attributes": True}


class PlacementStatisticIn(BaseModel):
    department_code: str | None = None
    batch_year: int
    highest_lpa: Decimal | None = None
    average_lpa: Decimal | None = None
    placement_rate_pct: Decimal | None = None
    offers_count: int | None = None
    recruiters_count: int | None = None
    notes: str | None = None


class PlacementStatisticOut(PlacementStatisticIn):
    id: int
    model_config = {"from_attributes": True}


# ── TAP team / services ─────────────────────────────────────────────
class TapTeamMemberIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role: str | None = None
    email: str | None = None
    phone: str | None = None
    initials: str | None = None
    accent: str | None = None
    photo_id: int | None = None
    photo_url: str | None = None
    sort_order: int = 0


class TapTeamMemberOut(TapTeamMemberIn):
    id: int
    resolved_photo_url: str | None = None
    model_config = {"from_attributes": True}


class TapServiceIn(BaseModel):
    icon: str | None = None
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    bg_class: str | None = None
    text_class: str | None = None
    accent: str | None = None
    sort_order: int = 0


class TapServiceOut(TapServiceIn):
    id: int
    model_config = {"from_attributes": True}


# ── MoU ─────────────────────────────────────────────────────────────
class MoUIn(BaseModel):
    owner: str = "tap"
    department_code: str | None = None
    partner_name: str = Field(..., min_length=1, max_length=255)
    logo: str | None = None
    logo_id: int | None = None
    logo_url: str | None = None
    description: str | None = None
    tags: list[str] | None = None
    document_id: int | None = None
    document_url: str | None = None
    document_label: str | None = None
    signed_on: date | None = None
    expires_on: date | None = None
    sort_order: int = 0


class MoUOut(MoUIn):
    id: int
    resolved_logo_url: str | None = None
    resolved_document_url: str | None = None
    model_config = {"from_attributes": True}


# ── Recruiter testimonials ──────────────────────────────────────────
class RecruiterTestimonialIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role: str | None = None
    quote: str = Field(..., min_length=1)
    initials: str | None = None
    accent: str | None = None
    photo_id: int | None = None
    rating: int | None = None
    sort_order: int = 0


class RecruiterTestimonialOut(RecruiterTestimonialIn):
    id: int
    photo_url: str | None = None
    model_config = {"from_attributes": True}


# ── TAP events ──────────────────────────────────────────────────────
class TapEventIn(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    event_date: date | None = None
    image_id: int | None = None
    image_url: str | None = None
    icon: str | None = None
    type: str | None = None
    status: str = "upcoming"
    sort_order: int = 0


class TapEventOut(TapEventIn):
    id: int
    resolved_image_url: str | None = None
    model_config = {"from_attributes": True}
