from __future__ import annotations

from datetime import date

from sqlalchemy import JSON, Boolean, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models._base import Base, TimestampMixin


class ResearchFocusArea(Base, TimestampMixin):
    __tablename__ = "research_focus_areas"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(8), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    departments: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Publication(Base, TimestampMixin):
    """A year-bucket publication archive entry (count + PDF URL)."""
    __tablename__ = "publications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    year: Mapped[str] = mapped_column(String(16), nullable=False, index=True)  # e.g. "2024-25"
    count_label: Mapped[str | None] = mapped_column(String(32), nullable=True)  # "60+"
    pdf_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    department_code: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class BookOrChapter(Base, TimestampMixin):
    __tablename__ = "books_and_chapters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    year: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    title: Mapped[str | None] = mapped_column(String(512), nullable=True)
    pdf_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    contributors: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Patent(Base, TimestampMixin):
    __tablename__ = "patents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    inventors: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    filed_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    granted_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    patent_no: Mapped[str | None] = mapped_column(String(128), nullable=True, index=True)
    status: Mapped[str] = mapped_column(String(32), default="filed", nullable=False, index=True)
    department_code: Mapped[str | None] = mapped_column(String(16), nullable=True, index=True)
    pdf_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class JournalIssue(Base, TimestampMixin):
    __tablename__ = "journal_issues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    volume: Mapped[str | None] = mapped_column(String(32), nullable=True)
    issue: Mapped[str | None] = mapped_column(String(32), nullable=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    theme: Mapped[str | None] = mapped_column(String(512), nullable=True)
    cover_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    cover_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    pdf_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Conference(Base, TimestampMixin):
    __tablename__ = "conferences"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(512), nullable=False)
    short_name: Mapped[str | None] = mapped_column(String(64), nullable=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    theme: Mapped[str | None] = mapped_column(Text, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    banner_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    banner_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    brochure_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    brochure_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    proceedings_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    proceedings_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="upcoming", nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    papers: Mapped[list["ConferencePaper"]] = relationship(
        "ConferencePaper",
        back_populates="conference",
        cascade="all, delete-orphan",
        order_by="ConferencePaper.sort_order",
        lazy="selectin",
    )


class ConferencePaper(Base, TimestampMixin):
    __tablename__ = "conference_papers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    conference_id: Mapped[int] = mapped_column(
        ForeignKey("conferences.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    authors: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)
    abstract_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    pdf_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    conference: Mapped["Conference"] = relationship("Conference", back_populates="papers")


class Fdp(Base, TimestampMixin):
    """Faculty Development Programme."""
    __tablename__ = "fdps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    mode: Mapped[str | None] = mapped_column(String(16), nullable=True)  # online|offline|hybrid
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    banner_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    banner_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    brochure_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    brochure_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    status: Mapped[str] = mapped_column(String(16), default="upcoming", nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    sessions: Mapped[list["FdpSession"]] = relationship(
        "FdpSession",
        back_populates="fdp",
        cascade="all, delete-orphan",
        order_by="FdpSession.day, FdpSession.sort_order",
        lazy="selectin",
    )


class FdpSession(Base, TimestampMixin):
    __tablename__ = "fdp_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    fdp_id: Mapped[int] = mapped_column(
        ForeignKey("fdps.id", ondelete="CASCADE"), nullable=False, index=True
    )
    day: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    time_slot: Mapped[str | None] = mapped_column(String(64), nullable=True)
    speaker: Mapped[str | None] = mapped_column(String(255), nullable=True)
    topic: Mapped[str] = mapped_column(String(512), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    fdp: Mapped["Fdp"] = relationship("Fdp", back_populates="sessions")


class PolicyDocument(Base, TimestampMixin):
    __tablename__ = "policy_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    # research | compliance | institute
    owner: Mapped[str] = mapped_column(String(32), default="research", nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(64), nullable=True)
    pdf_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    version: Mapped[str | None] = mapped_column(String(32), nullable=True)
    last_revised_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
