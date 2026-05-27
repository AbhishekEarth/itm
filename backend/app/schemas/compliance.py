from __future__ import annotations

from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field


# ── NAAC ─────────────────────────────────────────────────────────────
class NaacDocIn(BaseModel):
    cycle: str | None = None
    criterion: str | None = None
    title: str = Field(..., min_length=1, max_length=512)
    description: str | None = None
    pdf_id: int | None = None
    pdf_url: str | None = None
    year: int | None = None
    sort_order: int = 0


class NaacDocOut(NaacDocIn):
    id: int
    resolved_pdf_url: str | None = None
    model_config = {"from_attributes": True}


class NaacGradeIn(BaseModel):
    cycle: str = Field(..., min_length=1, max_length=32)
    grade: str | None = None
    cgpa: Decimal | None = None
    valid_from: date | None = None
    valid_to: date | None = None
    certificate_id: int | None = None
    certificate_url: str | None = None


class NaacGradeOut(NaacGradeIn):
    id: int
    resolved_certificate_url: str | None = None
    model_config = {"from_attributes": True}


# ── NIRF ─────────────────────────────────────────────────────────────
class NirfIn(BaseModel):
    year: int
    category: str = Field(..., min_length=1, max_length=64)
    rank: int | None = None
    rank_band: str | None = None
    total_score: Decimal | None = None
    sub_scores: dict | None = None
    document_id: int | None = None
    document_url: str | None = None
    sort_order: int = 0


class NirfOut(NirfIn):
    id: int
    resolved_document_url: str | None = None
    model_config = {"from_attributes": True}


# ── Committees ───────────────────────────────────────────────────────
class CommitteeMemberIn(BaseModel):
    committee: str = Field(..., min_length=1, max_length=128)
    member_name: str = Field(..., min_length=1, max_length=255)
    role: str | None = None
    contact: str | None = None
    term_start: date | None = None
    term_end: date | None = None
    sort_order: int = 0


class CommitteeMemberOut(CommitteeMemberIn):
    id: int
    model_config = {"from_attributes": True}


# ── Board / Officials ────────────────────────────────────────────────
class BoardMemberIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., min_length=1, max_length=128)
    organization: str | None = None
    photo_id: int | None = None
    photo_url: str | None = None
    bio_md: str | None = None
    sort_order: int = 0
    is_active: bool = True


class BoardMemberOut(BoardMemberIn):
    id: int
    resolved_photo_url: str | None = None
    model_config = {"from_attributes": True}


class OfficialIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., min_length=1, max_length=128)
    department_code: str | None = None
    photo_id: int | None = None
    photo_url: str | None = None
    email: str | None = None
    phone: str | None = None
    bio_md: str | None = None
    sort_order: int = 0
    is_active: bool = True


class OfficialOut(OfficialIn):
    id: int
    resolved_photo_url: str | None = None
    model_config = {"from_attributes": True}


# ── Alumni ───────────────────────────────────────────────────────────
class AlumniProfileIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    batch_year: int | None = None
    programme_code: str | None = None
    current_role: str | None = None
    company: str | None = None
    location: str | None = None
    photo_id: int | None = None
    photo_url: str | None = None
    bio_md: str | None = None
    quote: str | None = None
    linkedin: str | None = None
    is_featured: bool = False
    sort_order: int = 0


class AlumniProfileOut(AlumniProfileIn):
    id: int
    resolved_photo_url: str | None = None
    model_config = {"from_attributes": True}


class AlumniChapterIn(BaseModel):
    city: str = Field(..., min_length=1, max_length=128)
    country: str | None = "India"
    coordinator: str | None = None
    members_count: int | None = None
    contact_email: str | None = None
    contact_phone: str | None = None
    notes: str | None = None
    sort_order: int = 0


class AlumniChapterOut(AlumniChapterIn):
    id: int
    model_config = {"from_attributes": True}


class AlumniMentorshipIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    mentor_alumni_id: int | None = None
    focus_area: str | None = None
    description_md: str | None = None
    slots: int | None = None
    is_open: bool = True
    sort_order: int = 0


class AlumniMentorshipOut(AlumniMentorshipIn):
    id: int
    model_config = {"from_attributes": True}
