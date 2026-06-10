from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import JSON, Boolean, Date, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models._base import Base, TimestampMixin


class AdmissionStep(Base, TimestampMixin):
    __tablename__ = "admission_steps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(64), nullable=True)
    estimated_duration: Mapped[str | None] = mapped_column(String(64), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class RequiredDocument(Base, TimestampMixin):
    __tablename__ = "required_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    mandatory: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    applies_to: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    formats: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    max_size_mb: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class AdmissionCounsellor(Base, TimestampMixin):
    __tablename__ = "admission_counsellors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    expertise: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    programme: Mapped[str | None] = mapped_column(String(128), nullable=True)
    icon: Mapped[str | None] = mapped_column(String(64), nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class FeeComponent(Base, TimestampMixin):
    __tablename__ = "fee_components"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    # tuition | hostel | caution | exam | other
    type: Mapped[str] = mapped_column(String(32), default="other", nullable=False, index=True)
    amount: Mapped[Decimal | None] = mapped_column(Numeric(12, 2), nullable=True)
    currency: Mapped[str] = mapped_column(String(8), default="INR", nullable=False)
    frequency: Mapped[str] = mapped_column(String(32), default="annual", nullable=False)  # annual|per_semester|one_time
    duration_semesters: Mapped[int | None] = mapped_column(Integer, nullable=True)
    applies_to_programmes: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Quota(Base, TimestampMixin):
    __tablename__ = "quotas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    percentage: Mapped[Decimal | None] = mapped_column(Numeric(5, 2), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    eligibility_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class AdmissionFAQ(Base, TimestampMixin):
    __tablename__ = "admission_faqs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    programme_code: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    category: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    question: Mapped[str] = mapped_column(String(512), nullable=False)
    answer_md: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class AdmissionTimeline(Base, TimestampMixin):
    __tablename__ = "admission_timeline"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    event: Mapped[str] = mapped_column(String(255), nullable=False)
    event_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    kind: Mapped[str | None] = mapped_column(String(32), nullable=True)  # deadline|announcement|round
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class AdmissionLead(Base, TimestampMixin):
    """Inquiry form submission — the inbox the admissions team works."""
    __tablename__ = "admission_leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    programme_interest: Mapped[str | None] = mapped_column(String(128), nullable=True)
    city: Mapped[str | None] = mapped_column(String(128), nullable=True)
    state: Mapped[str | None] = mapped_column(String(128), nullable=True)
    source: Mapped[str | None] = mapped_column(String(64), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    # new | contacted | qualified | enrolled | rejected | spam
    status: Mapped[str] = mapped_column(String(16), default="new", nullable=False, index=True)
    assigned_to_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    ip: Mapped[str | None] = mapped_column(String(64), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(255), nullable=True)


class ContactSubmission(Base, TimestampMixin):
    __tablename__ = "contact_submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    # general | grievance | info | gallery_submission | jrf
    kind: Mapped[str] = mapped_column(String(32), default="general", nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    subject: Mapped[str | None] = mapped_column(String(255), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    attachments: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    # new | in_progress | resolved | spam
    status: Mapped[str] = mapped_column(String(16), default="new", nullable=False, index=True)
    assigned_to_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    ip: Mapped[str | None] = mapped_column(String(64), nullable=True)


class OpenPosition(Base, TimestampMixin):
    __tablename__ = "open_positions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    department_code: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    category: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    # full_time | contract | project | visiting
    type: Mapped[str] = mapped_column(String(32), default="full_time", nullable=False)
    location: Mapped[str | None] = mapped_column(String(128), nullable=True)
    experience: Mapped[str | None] = mapped_column(String(128), nullable=True)
    description_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    tags: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    deadline: Mapped[date | None] = mapped_column(Date, nullable=True)
    jd_pdf_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    jd_pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    # open | closed
    status: Mapped[str] = mapped_column(String(16), default="open", nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class JobApplication(Base, TimestampMixin):
    __tablename__ = "job_applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    position_id: Mapped[int] = mapped_column(
        ForeignKey("open_positions.id", ondelete="CASCADE"), nullable=False, index=True
    )
    applicant_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    resume_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    resume_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    cover_letter_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    # new | shortlisted | interviewing | rejected | hired
    status: Mapped[str] = mapped_column(String(16), default="new", nullable=False, index=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class JrfPosting(Base, TimestampMixin):
    __tablename__ = "jrf_postings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    stipend: Mapped[str | None] = mapped_column(String(64), nullable=True)
    duration: Mapped[str | None] = mapped_column(String(64), nullable=True)
    research_area: Mapped[str | None] = mapped_column(String(255), nullable=True)
    eligibility_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    deadline: Mapped[date | None] = mapped_column(Date, nullable=True)
    jd_pdf_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    jd_pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="open", nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
