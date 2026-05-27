from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


# ── HoD ──────────────────────────────────────────────────────────────
class HodProfileIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role: str | None = None
    qualification: str | None = None
    message_md: str | None = None
    phone: str | None = None
    email: str | None = None
    joined_on: str | None = None
    research_area: str | None = None
    photo_id: int | None = None


class HodProfileOut(HodProfileIn):
    id: int
    department_id: int
    photo_url: str | None = None

    model_config = {"from_attributes": True}


# ── Faculty ──────────────────────────────────────────────────────────
class FacultyIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    role: str | None = None
    qualification: str | None = None
    specialization: str | None = None
    email: str | None = None
    phone: str | None = None
    bio_md: str | None = None
    photo_id: int | None = None
    google_scholar_url: str | None = None
    orcid: str | None = None
    employee_no: str | None = None
    is_active: bool = True
    is_highlight: bool = True
    sort_order: int = 0


class FacultyOut(FacultyIn):
    id: int
    department_id: int
    photo_url: str | None = None

    model_config = {"from_attributes": True}


# ── Laboratory ───────────────────────────────────────────────────────
class LaboratoryIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    icon: str | None = None
    description: str | None = None
    tools: list[str] | None = None
    photo_id: int | None = None
    sort_order: int = 0
    is_active: bool = True


class LaboratoryOut(LaboratoryIn):
    id: int
    department_id: int
    photo_url: str | None = None

    model_config = {"from_attributes": True}


# ── Industry Partner ─────────────────────────────────────────────────
class IndustryPartnerIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category: str = Field(default="industry")
    url: str | None = None
    logo_id: int | None = None
    sort_order: int = 0


class IndustryPartnerOut(IndustryPartnerIn):
    id: int
    department_id: int
    logo_url: str | None = None

    model_config = {"from_attributes": True}


# ── Student items ────────────────────────────────────────────────────
class StudentProjectIn(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    note: str | None = None
    year: int | None = None
    sort_order: int = 0


class StudentProjectOut(StudentProjectIn):
    id: int
    department_id: int

    model_config = {"from_attributes": True}


class StudentAwardIn(BaseModel):
    student_name: str = Field(..., min_length=1, max_length=255)
    award: str = Field(..., min_length=1, max_length=255)
    batch: str | None = None
    sort_order: int = 0


class StudentAwardOut(StudentAwardIn):
    id: int
    department_id: int

    model_config = {"from_attributes": True}


# ── Department ───────────────────────────────────────────────────────
class DepartmentCore(BaseModel):
    code: str = Field(..., min_length=1, max_length=16)
    name: str = Field(..., min_length=1, max_length=255)
    short_name: str | None = None
    page_path: str | None = None
    established_year: int | None = None
    intake: int | None = None
    duration: str | None = None
    mtech_since: int | None = None
    mtech_intake: int | None = None
    affiliation: str | None = None
    faculty_count: int | None = None

    accent_from: str | None = None
    accent_to: str | None = None
    accent_solid: str | None = None
    icon: str | None = None
    image_url: str | None = None
    badge: str | None = None
    subtitle: str | None = None
    intro_md: str | None = None

    chips: list[Any] | None = None
    accreditations: list[str] | None = None
    specializations: list[str] | None = None
    features: list[Any] | None = None
    hod_highlights: list[Any] | None = None
    software: list[str] | None = None
    vision: str | None = None
    mission: list[str] | None = None
    peos: list[str] | None = None
    psos: list[str] | None = None
    achievements: list[str] | None = None
    sub_units: list[Any] | None = None
    infra: list[Any] | None = None
    consultancy: list[Any] | None = None
    events_list: list[str] | None = None
    guest_lectures: list[str] | None = None
    industrial_visits: list[str] | None = None
    placement_payload: dict | None = None
    placement_batches: list[str] | None = None
    contact: dict | None = None

    scope_key: str | None = None
    slug: str | None = None
    meta_title: str | None = None
    meta_description: str | None = None
    meta_keywords: list[str] | None = None
    is_published: bool = True


class DepartmentCreate(DepartmentCore):
    pass


class DepartmentUpdate(BaseModel):
    name: str | None = None
    short_name: str | None = None
    page_path: str | None = None
    established_year: int | None = None
    intake: int | None = None
    duration: str | None = None
    mtech_since: int | None = None
    mtech_intake: int | None = None
    affiliation: str | None = None
    faculty_count: int | None = None
    accent_from: str | None = None
    accent_to: str | None = None
    accent_solid: str | None = None
    icon: str | None = None
    image_id: int | None = None
    image_url: str | None = None
    badge: str | None = None
    subtitle: str | None = None
    intro_md: str | None = None
    chips: list[Any] | None = None
    accreditations: list[str] | None = None
    specializations: list[str] | None = None
    features: list[Any] | None = None
    hod_highlights: list[Any] | None = None
    software: list[str] | None = None
    vision: str | None = None
    mission: list[str] | None = None
    peos: list[str] | None = None
    psos: list[str] | None = None
    achievements: list[str] | None = None
    sub_units: list[Any] | None = None
    infra: list[Any] | None = None
    consultancy: list[Any] | None = None
    events_list: list[str] | None = None
    guest_lectures: list[str] | None = None
    industrial_visits: list[str] | None = None
    placement_payload: dict | None = None
    placement_batches: list[str] | None = None
    contact: dict | None = None
    meta_title: str | None = None
    meta_description: str | None = None
    meta_keywords: list[str] | None = None
    is_published: bool | None = None


class DepartmentOut(DepartmentCore):
    id: int
    image_id: int | None = None
    image_resolved_url: str | None = None
    hod: HodProfileOut | None = None
    faculty: list[FacultyOut] = []
    laboratories: list[LaboratoryOut] = []
    industry_partners: list[IndustryPartnerOut] = []
    student_projects: list[StudentProjectOut] = []
    student_awards: list[StudentAwardOut] = []

    model_config = {"from_attributes": True}


class DepartmentSummary(BaseModel):
    """Lightweight row for /api/departments listings."""

    id: int
    code: str
    name: str
    short_name: str | None = None
    page_path: str | None = None
    scope_key: str | None = None
    image_resolved_url: str | None = None
    is_published: bool

    model_config = {"from_attributes": True}
