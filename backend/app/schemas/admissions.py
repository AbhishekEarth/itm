from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field


# ── Content schemas ─────────────────────────────────────────────────
class AdmissionStepIn(BaseModel):
    position: int = 0
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    icon: str | None = None
    estimated_duration: str | None = None
    is_active: bool = True


class AdmissionStepOut(AdmissionStepIn):
    id: int
    model_config = {"from_attributes": True}


class RequiredDocumentIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    mandatory: bool = True
    applies_to: list[str] | None = None
    formats: list[str] | None = None
    max_size_mb: int | None = None
    sort_order: int = 0


class RequiredDocumentOut(RequiredDocumentIn):
    id: int
    model_config = {"from_attributes": True}


class CounsellorIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str | None = None
    phone: str | None = None
    photo_id: int | None = None
    expertise: list[str] | None = None
    programme: str | None = None
    icon: str | None = None
    is_available: bool = True
    sort_order: int = 0


class CounsellorOut(CounsellorIn):
    id: int
    photo_url: str | None = None
    model_config = {"from_attributes": True}


class FeeComponentIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    type: str = "other"
    amount: Decimal | None = None
    currency: str = "INR"
    frequency: str = "annual"
    duration_semesters: int | None = None
    applies_to_programmes: list[str] | None = None
    sort_order: int = 0


class FeeComponentOut(FeeComponentIn):
    id: int
    model_config = {"from_attributes": True}


class QuotaIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=128)
    percentage: Decimal | None = None
    description: str | None = None
    eligibility_md: str | None = None
    sort_order: int = 0


class QuotaOut(QuotaIn):
    id: int
    model_config = {"from_attributes": True}


class FAQIn(BaseModel):
    programme_code: str | None = None
    category: str | None = None
    question: str = Field(..., min_length=1, max_length=512)
    answer_md: str = Field(..., min_length=1)
    sort_order: int = 0
    is_active: bool = True


class FAQOut(FAQIn):
    id: int
    model_config = {"from_attributes": True}


class TimelineIn(BaseModel):
    year: int
    event: str = Field(..., min_length=1, max_length=255)
    event_date: date | None = None
    kind: str | None = None
    is_published: bool = True
    sort_order: int = 0


class TimelineOut(TimelineIn):
    id: int
    model_config = {"from_attributes": True}


# ── Lead / inbox schemas ────────────────────────────────────────────
class AdmissionLeadCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str | None = None
    programme_interest: str | None = None
    city: str | None = None
    state: str | None = None
    source: str | None = None
    message: str | None = None


class AdmissionLeadOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None
    programme_interest: str | None
    city: str | None
    state: str | None
    source: str | None
    message: str | None
    status: str
    assigned_to_user_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class LeadStatusUpdate(BaseModel):
    status: str
    assigned_to_user_id: int | None = None


class ContactSubmissionCreate(BaseModel):
    kind: str = "general"
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str | None = None
    subject: str | None = None
    message: str = Field(..., min_length=1)
    attachments: list[str] | None = None


class ContactSubmissionOut(BaseModel):
    id: int
    kind: str
    name: str
    email: EmailStr
    phone: str | None
    subject: str | None
    message: str
    status: str
    assigned_to_user_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Careers ─────────────────────────────────────────────────────────
class OpenPositionIn(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    department_code: str | None = None
    category: str | None = None
    type: str = "full_time"
    location: str | None = None
    experience: str | None = None
    description_md: str | None = None
    tags: list[str] | None = None
    deadline: date | None = None
    jd_pdf_id: int | None = None
    jd_pdf_url: str | None = None
    status: str = "open"
    sort_order: int = 0


class OpenPositionOut(OpenPositionIn):
    id: int
    resolved_jd_pdf_url: str | None = None
    model_config = {"from_attributes": True}


class JobApplicationCreate(BaseModel):
    position_id: int
    applicant_name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    phone: str | None = None
    resume_id: int | None = None
    resume_url: str | None = None
    cover_letter_md: str | None = None


class JobApplicationOut(BaseModel):
    id: int
    position_id: int
    applicant_name: str
    email: EmailStr
    phone: str | None
    resume_url: str | None
    cover_letter_md: str | None
    status: str
    notes: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class JobApplicationStatus(BaseModel):
    status: str
    notes: str | None = None


class JrfPostingIn(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    stipend: str | None = None
    duration: str | None = None
    research_area: str | None = None
    eligibility_md: str | None = None
    deadline: date | None = None
    jd_pdf_id: int | None = None
    jd_pdf_url: str | None = None
    status: str = "open"
    sort_order: int = 0


class JrfPostingOut(JrfPostingIn):
    id: int
    resolved_jd_pdf_url: str | None = None
    model_config = {"from_attributes": True}
