"""events & gallery: clubs_cells, events, notices, announcements, gallery_categories, gallery_items, videos

Revision ID: 0006
Revises: 0005
Create Date: 2026-05-28
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0006"
down_revision: Union[str, None] = "0005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _ts():
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    ]


def _meta():
    return [
        sa.Column("slug", sa.String(255), nullable=True, unique=True),
        sa.Column("meta_title", sa.String(70), nullable=True),
        sa.Column("meta_description", sa.String(255), nullable=True),
        sa.Column("meta_keywords", sa.JSON(), nullable=True),
        sa.Column("og_image_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("canonical_url", sa.String(512), nullable=True),
        sa.Column("robots", sa.String(64), nullable=False, server_default="index,follow"),
        sa.Column("schema_jsonld", sa.JSON(), nullable=True),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
    ]


def upgrade() -> None:
    op.create_table(
        "clubs_cells",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("code", sa.String(32), nullable=False, unique=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("type", sa.String(16), nullable=False, server_default="club"),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("icon", sa.String(8), nullable=True),
        sa.Column("accent", sa.String(64), nullable=True),
        sa.Column("logo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("logo_url", sa.String(512), nullable=True),
        sa.Column("page_path", sa.String(64), nullable=True),
        sa.Column("contact_email", sa.String(255), nullable=True),
        sa.Column("contact_phone", sa.String(32), nullable=True),
        sa.Column("scope_key", sa.String(64), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=True),
        *_meta(),
        *_ts(),
    )
    op.create_index("ix_clubs_cells_code", "clubs_cells", ["code"])
    op.create_index("ix_clubs_cells_type", "clubs_cells", ["type"])
    op.create_index("ix_clubs_cells_scope_key", "clubs_cells", ["scope_key"])
    op.create_index("ix_clubs_cells_slug", "clubs_cells", ["slug"])

    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("club_id", sa.Integer(), sa.ForeignKey("clubs_cells.id", ondelete="SET NULL"), nullable=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description_md", sa.Text(), nullable=True),
        sa.Column("event_date", sa.Date(), nullable=True),
        sa.Column("event_end_date", sa.Date(), nullable=True),
        sa.Column("location", sa.String(255), nullable=True),
        sa.Column("banner_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("banner_url", sa.String(512), nullable=True),
        sa.Column("registration_url", sa.String(512), nullable=True),
        sa.Column("type", sa.String(32), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="upcoming"),
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_events_club_id", "events", ["club_id"])
    op.create_index("ix_events_event_date", "events", ["event_date"])
    op.create_index("ix_events_status", "events", ["status"])
    op.create_index("ix_events_type", "events", ["type"])

    op.create_table(
        "notices",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("body_md", sa.Text(), nullable=True),
        sa.Column("pdf_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("pdf_url", sa.String(512), nullable=True),
        sa.Column("audience", sa.JSON(), nullable=True),
        sa.Column("priority", sa.String(16), nullable=False, server_default="normal"),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("expires_on", sa.Date(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_notices_priority", "notices", ["priority"])
    op.create_index("ix_notices_published_at", "notices", ["published_at"])
    op.create_index("ix_notices_expires_on", "notices", ["expires_on"])
    op.create_index("ix_notices_is_active", "notices", ["is_active"])

    op.create_table(
        "announcements",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("message", sa.String(512), nullable=False),
        sa.Column("link", sa.String(512), nullable=True),
        sa.Column("starts_on", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ends_on", sa.DateTime(timezone=True), nullable=True),
        sa.Column("level", sa.String(16), nullable=False, server_default="info"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_announcements_is_active", "announcements", ["is_active"])

    op.create_table(
        "gallery_categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(64), nullable=False, unique=True),
        sa.Column("label", sa.String(128), nullable=False),
        sa.Column("icon", sa.String(64), nullable=True),
        sa.Column("accent", sa.String(64), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("cover_media_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("cover_url", sa.String(512), nullable=True),
        sa.Column("scope_key", sa.String(64), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_gallery_categories_slug", "gallery_categories", ["slug"])

    op.create_table(
        "gallery_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("gallery_categories.id", ondelete="CASCADE"), nullable=False),
        sa.Column("media_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("media_url", sa.String(512), nullable=True),
        sa.Column("caption", sa.String(512), nullable=True),
        sa.Column("photographer", sa.String(255), nullable=True),
        sa.Column("captured_on", sa.Date(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_gallery_items_category_id", "gallery_items", ["category_id"])

    op.create_table(
        "videos",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("gallery_categories.id", ondelete="SET NULL"), nullable=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("youtube_id", sa.String(64), nullable=True),
        sa.Column("mp4_media_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("mp4_url", sa.String(512), nullable=True),
        sa.Column("cover_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("cover_url", sa.String(512), nullable=True),
        sa.Column("duration_seconds", sa.Integer(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *_ts(),
    )
    op.create_index("ix_videos_category_id", "videos", ["category_id"])


def downgrade() -> None:
    op.drop_table("videos")
    op.drop_table("gallery_items")
    op.drop_table("gallery_categories")
    op.drop_table("announcements")
    op.drop_table("notices")
    op.drop_table("events")
    op.drop_table("clubs_cells")
