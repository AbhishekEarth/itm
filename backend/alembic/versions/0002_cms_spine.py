"""cms spine: pages, page_sections, nav_menus, nav_items

Revision ID: 0002
Revises: 0001
Create Date: 2026-05-28
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "pages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("key", sa.String(64), nullable=False, unique=True),
        sa.Column("path", sa.String(255), nullable=False, unique=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column(
            "hero_image_id",
            sa.Integer(),
            sa.ForeignKey("media_assets.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("intro_md", sa.Text(), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="published"),
        sa.Column("scope_key", sa.String(64), nullable=True),
        # MetadataMixin
        sa.Column("slug", sa.String(255), nullable=True, unique=True),
        sa.Column("meta_title", sa.String(70), nullable=True),
        sa.Column("meta_description", sa.String(255), nullable=True),
        sa.Column("meta_keywords", sa.JSON(), nullable=True),
        sa.Column(
            "og_image_id",
            sa.Integer(),
            sa.ForeignKey("media_assets.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("canonical_url", sa.String(512), nullable=True),
        sa.Column("robots", sa.String(64), nullable=False, server_default="index,follow"),
        sa.Column("schema_jsonld", sa.JSON(), nullable=True),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("published_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        # TimestampMixin
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_pages_key", "pages", ["key"])
    op.create_index("ix_pages_path", "pages", ["path"])
    op.create_index("ix_pages_scope_key", "pages", ["scope_key"])
    op.create_index("ix_pages_slug", "pages", ["slug"])

    op.create_table(
        "page_sections",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "page_id",
            sa.Integer(),
            sa.ForeignKey("pages.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("section_key", sa.String(64), nullable=False),
        sa.Column("label", sa.String(128), nullable=True),
        sa.Column("kind", sa.String(32), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("payload", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.UniqueConstraint("page_id", "section_key", name="uq_page_section_key"),
    )
    op.create_index("ix_page_sections_page_id", "page_sections", ["page_id"])

    op.create_table(
        "nav_menus",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("key", sa.String(64), nullable=False, unique=True),
        sa.Column("label", sa.String(128), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_nav_menus_key", "nav_menus", ["key"])

    op.create_table(
        "nav_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("menu_id", sa.Integer(), sa.ForeignKey("nav_menus.id", ondelete="CASCADE"), nullable=False),
        sa.Column("parent_id", sa.Integer(), sa.ForeignKey("nav_items.id", ondelete="CASCADE"), nullable=True),
        sa.Column("label", sa.String(128), nullable=False),
        sa.Column("path", sa.String(255), nullable=True),
        sa.Column("external_url", sa.String(512), nullable=True),
        sa.Column("icon", sa.String(64), nullable=True),
        sa.Column("target", sa.String(16), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_nav_items_menu_id", "nav_items", ["menu_id"])
    op.create_index("ix_nav_items_parent_id", "nav_items", ["parent_id"])


def downgrade() -> None:
    op.drop_table("nav_items")
    op.drop_table("nav_menus")
    op.drop_table("page_sections")
    op.drop_table("pages")
