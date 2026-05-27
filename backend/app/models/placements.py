from __future__ import annotations

from datetime import date

from sqlalchemy import JSON, Boolean, Date, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models._base import Base, TimestampMixin


class RecruiterCategory(Base, TimestampMixin):
    """Marquee group, e.g. 'Engineering & IT', 'Management'."""
    __tablename__ = "recruiter_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    key: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Recruiter(Base, TimestampMixin):
    __tablename__ = "recruiters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("recruiter_categories.id", ondelete="SET NULL"), nullable=True, index=True
    )
    sector: Mapped[str | None] = mapped_column(String(64), nullable=True)
    tier: Mapped[str] = mapped_column(String(16), default="standard", nullable=False)  # top|standard|partner
    logo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    logo_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    website: Mapped[str | None] = mapped_column(String(512), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class PlacementRecord(Base, TimestampMixin):
    __tablename__ = "placement_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    student_name: Mapped[str] = mapped_column(String(255), nullable=False)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    department_code: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    programme: Mapped[str | None] = mapped_column(String(128), nullable=True)
    batch_year: Mapped[int | None] = mapped_column(Integer, nullable=True, index=True)
    company: Mapped[str | None] = mapped_column(String(255), nullable=True)
    role: Mapped[str | None] = mapped_column(String(255), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    package_lpa: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class PlacementStatistic(Base, TimestampMixin):
    __tablename__ = "placement_statistics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_code: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    batch_year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    highest_lpa: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    average_lpa: Mapped[float | None] = mapped_column(Numeric(8, 2), nullable=True)
    placement_rate_pct: Mapped[float | None] = mapped_column(Numeric(5, 2), nullable=True)
    offers_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    recruiters_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class TapTeamMember(Base, TimestampMixin):
    __tablename__ = "tap_team_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str | None] = mapped_column(String(128), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    initials: Mapped[str | None] = mapped_column(String(8), nullable=True)
    accent: Mapped[str | None] = mapped_column(String(64), nullable=True)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    photo_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class TapService(Base, TimestampMixin):
    __tablename__ = "tap_services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    icon: Mapped[str | None] = mapped_column(String(64), nullable=True)  # lucide-react icon name
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    bg_class: Mapped[str | None] = mapped_column(String(128), nullable=True)
    text_class: Mapped[str | None] = mapped_column(String(128), nullable=True)
    accent: Mapped[str | None] = mapped_column(String(64), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class MoU(Base, TimestampMixin):
    __tablename__ = "mous"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    # tap | research | institute | dept
    owner: Mapped[str] = mapped_column(String(32), default="tap", nullable=False, index=True)
    department_code: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    partner_name: Mapped[str] = mapped_column(String(255), nullable=False)
    logo: Mapped[str | None] = mapped_column(String(8), nullable=True)        # emoji icon
    logo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    logo_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    tags: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    document_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    document_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    document_label: Mapped[str | None] = mapped_column(String(128), nullable=True)
    signed_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    expires_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class RecruiterTestimonial(Base, TimestampMixin):
    __tablename__ = "recruiter_testimonials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str | None] = mapped_column(String(255), nullable=True)
    quote: Mapped[str] = mapped_column(Text, nullable=False)
    initials: Mapped[str | None] = mapped_column(String(8), nullable=True)
    accent: Mapped[str | None] = mapped_column(String(64), nullable=True)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class TapEvent(Base, TimestampMixin):
    __tablename__ = "tap_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    event_date: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    image_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    icon: Mapped[str | None] = mapped_column(String(64), nullable=True)
    type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="upcoming", nullable=False, index=True)  # upcoming|past
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
