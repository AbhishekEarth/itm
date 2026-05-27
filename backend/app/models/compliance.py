from __future__ import annotations

from datetime import date
from decimal import Decimal

from sqlalchemy import JSON, Boolean, Date, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models._base import Base, TimestampMixin


class NaacDocument(Base, TimestampMixin):
    __tablename__ = "naac_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    cycle: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True)  # e.g. Cycle 2
    criterion: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)  # 1.1 .. 7.3
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    pdf_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class NaacGrade(Base, TimestampMixin):
    """One-row-per-cycle institutional NAAC grade."""
    __tablename__ = "naac_grades"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    cycle: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
    grade: Mapped[str | None] = mapped_column(String(8), nullable=True)
    cgpa: Mapped[Decimal | None] = mapped_column(Numeric(4, 2), nullable=True)
    valid_from: Mapped[date | None] = mapped_column(Date, nullable=True)
    valid_to: Mapped[date | None] = mapped_column(Date, nullable=True)
    certificate_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    certificate_url: Mapped[str | None] = mapped_column(String(512), nullable=True)


class NirfRecord(Base, TimestampMixin):
    __tablename__ = "nirf_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(64), nullable=False, index=True)  # Engineering, Management, …
    rank: Mapped[int | None] = mapped_column(Integer, nullable=True)
    rank_band: Mapped[str | None] = mapped_column(String(64), nullable=True)  # e.g. "151-200"
    total_score: Mapped[Decimal | None] = mapped_column(Numeric(6, 2), nullable=True)
    sub_scores: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    document_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    document_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class CommitteeMember(Base, TimestampMixin):
    __tablename__ = "committee_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    committee: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    member_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str | None] = mapped_column(String(128), nullable=True)
    contact: Mapped[str | None] = mapped_column(String(255), nullable=True)
    term_start: Mapped[date | None] = mapped_column(Date, nullable=True)
    term_end: Mapped[date | None] = mapped_column(Date, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class BoardMember(Base, TimestampMixin):
    __tablename__ = "board_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(128), nullable=False)
    organization: Mapped[str | None] = mapped_column(String(255), nullable=True)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    photo_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    bio_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class Official(Base, TimestampMixin):
    __tablename__ = "officials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(128), nullable=False)
    department_code: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    photo_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    bio_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class AlumniProfile(Base, TimestampMixin):
    __tablename__ = "alumni_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    batch_year: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    programme_code: Mapped[str | None] = mapped_column(String(64), nullable=True)
    current_role: Mapped[str | None] = mapped_column(String(255), nullable=True)
    company: Mapped[str | None] = mapped_column(String(255), nullable=True)
    location: Mapped[str | None] = mapped_column(String(128), nullable=True)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    photo_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    bio_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    quote: Mapped[str | None] = mapped_column(Text, nullable=True)
    linkedin: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class AlumniChapter(Base, TimestampMixin):
    __tablename__ = "alumni_chapters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    city: Mapped[str] = mapped_column(String(128), nullable=False)
    country: Mapped[str | None] = mapped_column(String(64), default="India", nullable=True)
    coordinator: Mapped[str | None] = mapped_column(String(255), nullable=True)
    members_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    contact_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contact_phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class AlumniMentorship(Base, TimestampMixin):
    __tablename__ = "alumni_mentorships"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    mentor_alumni_id: Mapped[int | None] = mapped_column(
        ForeignKey("alumni_profiles.id", ondelete="SET NULL"), nullable=True
    )
    focus_area: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    slots: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_open: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
