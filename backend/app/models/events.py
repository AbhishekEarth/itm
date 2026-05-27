from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import JSON, Boolean, Date, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models._base import Base, MetadataMixin, TimestampMixin


class ClubCell(Base, TimestampMixin, MetadataMixin):
    """Student clubs / cells: PAC, NSS, UBA, WEC, Sports, IQAC, Anti-Ragging, etc."""
    __tablename__ = "clubs_cells"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(16), default="club", nullable=False, index=True)  # club|cell
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(8), nullable=True)
    accent: Mapped[str | None] = mapped_column(String(64), nullable=True)
    logo_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    logo_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    page_path: Mapped[str | None] = mapped_column(String(64), nullable=True)
    contact_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    contact_phone: Mapped[str | None] = mapped_column(String(32), nullable=True)
    scope_key: Mapped[str | None] = mapped_column(String(64), nullable=True, index=True)
    tags: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)

    events: Mapped[list["Event"]] = relationship(
        "Event", back_populates="club",
        cascade="all, delete-orphan",
        order_by="Event.event_date.desc()",
        lazy="selectin",
    )


class Event(Base, TimestampMixin):
    """Campus / club event. Auto-scoped via club_id.scope_key."""
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    club_id: Mapped[int | None] = mapped_column(
        ForeignKey("clubs_cells.id", ondelete="SET NULL"), nullable=True, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    event_date: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    event_end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    banner_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    banner_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    registration_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    # workshop | seminar | fest | sports | cultural | drive | other
    type: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True)
    # upcoming | past | cancelled
    status: Mapped[str] = mapped_column(String(16), default="upcoming", nullable=False, index=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    club: Mapped["ClubCell | None"] = relationship("ClubCell", back_populates="events")


class Notice(Base, TimestampMixin):
    __tablename__ = "notices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body_md: Mapped[str | None] = mapped_column(Text, nullable=True)
    pdf_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    pdf_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    audience: Mapped[list[str] | None] = mapped_column(JSON, nullable=True)  # ["all"] | ["student"] | ["faculty"]
    priority: Mapped[str] = mapped_column(String(16), default="normal", nullable=False, index=True)  # low|normal|high|urgent
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True, index=True)
    expires_on: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Announcement(Base, TimestampMixin):
    """Short ticker / banner messages."""
    __tablename__ = "announcements"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    message: Mapped[str] = mapped_column(String(512), nullable=False)
    link: Mapped[str | None] = mapped_column(String(512), nullable=True)
    starts_on: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ends_on: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    level: Mapped[str] = mapped_column(String(16), default="info", nullable=False)  # info|success|warning|critical
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class GalleryCategory(Base, TimestampMixin):
    __tablename__ = "gallery_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)
    label: Mapped[str] = mapped_column(String(128), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(64), nullable=True)
    accent: Mapped[str | None] = mapped_column(String(64), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    cover_media_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    cover_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    scope_key: Mapped[str | None] = mapped_column(String(64), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    items: Mapped[list["GalleryItem"]] = relationship(
        "GalleryItem", back_populates="category",
        cascade="all, delete-orphan",
        order_by="GalleryItem.sort_order",
        lazy="selectin",
    )


class GalleryItem(Base, TimestampMixin):
    __tablename__ = "gallery_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("gallery_categories.id", ondelete="CASCADE"), nullable=False, index=True
    )
    media_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    media_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    caption: Mapped[str | None] = mapped_column(String(512), nullable=True)
    photographer: Mapped[str | None] = mapped_column(String(255), nullable=True)
    captured_on: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    category: Mapped["GalleryCategory"] = relationship("GalleryCategory", back_populates="items")


class Video(Base, TimestampMixin):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("gallery_categories.id", ondelete="SET NULL"), nullable=True, index=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    youtube_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    mp4_media_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    mp4_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    cover_id: Mapped[int | None] = mapped_column(
        ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True
    )
    cover_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
