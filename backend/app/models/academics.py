from __future__ import annotations

from sqlalchemy import JSON, Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models._base import Base, MetadataMixin, TimestampMixin


class Department(Base, TimestampMixin, MetadataMixin):
    """Top-level academic unit (CSE, ECE, IT, ME, CE, MBA, ESH)."""

    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(16), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    short_name: Mapped[str | None] = mapped_column(String(32), nullable=True)
    page_path: Mapped[str | None] = mapped_column(String(64), nullable=True)

    established_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    intake: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duration: Mapped[str | None] = mapped_column(String(64), nullable=True)
    mtech_since: Mapped[int | None] = mapped_column(Integer, nullable=True)
    mtech_intake: Mapped[int | None] = mapped_column(Integer, nullable=True)
    affiliation: Mapped[str | None] = mapped_column(String(255), nullable=True)
    faculty_count: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Visual / hero
    accent_from: Mapped[str | None] = mapped_column(String(64), nullable=True)
    accent_to: Mapped[str | None] = mapped_column(String(64), nullable=True)
    accent_solid: Mapped[str | None] = mapped_column(String(32), nullable=True)
    icon: Mapped[str | None] = mapped_column(String(8), nullable=True)
    image_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    image_url: Mapped[str | None] = mapped_column(String(512), nullable=True)  # external URL fallback
    badge: Mapped[str | None] = mapped_column(String(128), nullable=True)
    subtitle: Mapped[str | None] = mapped_column(String(512), nullable=True)
    intro_md: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Lists that the admin edits as JSON blobs (rarely-changed cargo)
    chips: Mapped[list | None] = mapped_column(JSON, nullable=True)              # [[icon,label], ...]
    accreditations: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    specializations: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    features: Mapped[list | None] = mapped_column(JSON, nullable=True)            # [{icon,title,sub}]
    hod_highlights: Mapped[list | None] = mapped_column(JSON, nullable=True)
    software: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    vision: Mapped[str | None] = mapped_column(Text, nullable=True)
    mission: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    peos: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    psos: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    achievements: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    sub_units: Mapped[list | None] = mapped_column(JSON, nullable=True)            # [{name,icon,desc,research}]
    infra: Mapped[list | None] = mapped_column(JSON, nullable=True)
    consultancy: Mapped[list | None] = mapped_column(JSON, nullable=True)
    events_list: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    guest_lectures: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    industrial_visits: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    placement_payload: Mapped[dict | None] = mapped_column(JSON, nullable=True)    # full placement block
    placement_batches: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    contact: Mapped[dict | None] = mapped_column(JSON, nullable=True)               # {phone,email}

    # Scope key used by RBAC ("dept.cse", "dept.mba" …)
    scope_key: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)

    hod: Mapped["HodProfile | None"] = relationship(
        "HodProfile",
        back_populates="department",
        cascade="all, delete-orphan",
        uselist=False,
        lazy="selectin",
    )
    faculty: Mapped[list["Faculty"]] = relationship(
        "Faculty",
        back_populates="department",
        cascade="all, delete-orphan",
        order_by="Faculty.sort_order",
        lazy="selectin",
    )
    laboratories: Mapped[list["Laboratory"]] = relationship(
        "Laboratory",
        back_populates="department",
        cascade="all, delete-orphan",
        order_by="Laboratory.sort_order",
        lazy="selectin",
    )
    industry_partners: Mapped[list["IndustryPartner"]] = relationship(
        "IndustryPartner",
        back_populates="department",
        cascade="all, delete-orphan",
        order_by="IndustryPartner.sort_order",
        lazy="selectin",
    )
    student_projects: Mapped[list["StudentProject"]] = relationship(
        "StudentProject",
        back_populates="department",
        cascade="all, delete-orphan",
        order_by="StudentProject.sort_order",
        lazy="selectin",
    )
    student_awards: Mapped[list["StudentAward"]] = relationship(
        "StudentAward",
        back_populates="department",
        cascade="all, delete-orphan",
        order_by="StudentAward.sort_order",
        lazy="selectin",
    )


class HodProfile(Base, TimestampMixin):
    __tablename__ = "hod_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="CASCADE"), unique=True, nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str | None] = mapped_column(String(128), nullable=True)
    qualification: Mapped[str | None] = mapped_column(String(255), nullable=True)
    message_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    joined_on: Mapped[str | None] = mapped_column(String(64), nullable=True)
    research_area: Mapped[str | None] = mapped_column(String(255), nullable=True)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )

    department: Mapped["Department"] = relationship("Department", back_populates="hod")


class Faculty(Base, TimestampMixin):
    __tablename__ = "faculty"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    employee_no: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str | None] = mapped_column(String(128), nullable=True)
    qualification: Mapped[str | None] = mapped_column(String(255), nullable=True)
    specialization: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    bio_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    google_scholar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    orcid: Mapped[str | None] = mapped_column(String(64), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_highlight: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    department: Mapped["Department"] = relationship("Department", back_populates="faculty")


class Laboratory(Base, TimestampMixin):
    __tablename__ = "laboratories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(8), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    tools: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    photo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    department: Mapped["Department"] = relationship("Department", back_populates="laboratories")


class IndustryPartner(Base, TimestampMixin):
    __tablename__ = "industry_partners"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    # industry | govt | psu | academia
    category: Mapped[str] = mapped_column(String(32), default="industry", nullable=False, index=True)
    url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    logo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    department: Mapped["Department"] = relationship("Department", back_populates="industry_partners")


class StudentProject(Base, TimestampMixin):
    __tablename__ = "student_projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    department: Mapped["Department"] = relationship("Department", back_populates="student_projects")


class StudentAward(Base, TimestampMixin):
    __tablename__ = "student_awards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    department_id: Mapped[int] = mapped_column(
        ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True
    )
    student_name: Mapped[str] = mapped_column(String(255), nullable=False)
    award: Mapped[str] = mapped_column(String(255), nullable=False)
    batch: Mapped[str | None] = mapped_column(String(64), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    department: Mapped["Department"] = relationship("Department", back_populates="student_awards")
