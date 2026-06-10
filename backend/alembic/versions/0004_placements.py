"""tap + placements: recruiters, placement records/stats, tap team/services/mous/testimonials/events

Revision ID: 0004
Revises: 0003
Create Date: 2026-05-28
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _ts(*extras):
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        *extras,
    ]


def upgrade() -> None:
    op.create_table(
        "recruiter_categories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("key", sa.String(64), nullable=False, unique=True),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_recruiter_categories_key", "recruiter_categories", ["key"])

    op.create_table(
        "recruiters",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("recruiter_categories.id", ondelete="SET NULL"), nullable=True),
        sa.Column("sector", sa.String(64), nullable=True),
        sa.Column("tier", sa.String(16), nullable=False, server_default="standard"),
        sa.Column("logo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("logo_url", sa.String(512), nullable=True),
        sa.Column("website", sa.String(512), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *_ts(),
    )
    op.create_index("ix_recruiters_name", "recruiters", ["name"])
    op.create_index("ix_recruiters_category_id", "recruiters", ["category_id"])

    op.create_table(
        "placement_records",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("student_name", sa.String(255), nullable=False),
        sa.Column("photo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("department_code", sa.String(16), nullable=True),
        sa.Column("programme", sa.String(128), nullable=True),
        sa.Column("batch_year", sa.Integer(), nullable=True),
        sa.Column("company", sa.String(255), nullable=True),
        sa.Column("role", sa.String(255), nullable=True),
        sa.Column("location", sa.String(255), nullable=True),
        sa.Column("package_lpa", sa.Numeric(8, 2), nullable=True),
        sa.Column("linkedin_url", sa.String(512), nullable=True),
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_placement_records_department_code", "placement_records", ["department_code"])
    op.create_index("ix_placement_records_batch_year", "placement_records", ["batch_year"])
    op.create_index("ix_placement_records_is_featured", "placement_records", ["is_featured"])

    op.create_table(
        "placement_statistics",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("department_code", sa.String(16), nullable=True),
        sa.Column("batch_year", sa.Integer(), nullable=False),
        sa.Column("highest_lpa", sa.Numeric(8, 2), nullable=True),
        sa.Column("average_lpa", sa.Numeric(8, 2), nullable=True),
        sa.Column("placement_rate_pct", sa.Numeric(5, 2), nullable=True),
        sa.Column("offers_count", sa.Integer(), nullable=True),
        sa.Column("recruiters_count", sa.Integer(), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        *_ts(),
    )
    op.create_index("ix_placement_statistics_department_code", "placement_statistics", ["department_code"])
    op.create_index("ix_placement_statistics_batch_year", "placement_statistics", ["batch_year"])

    op.create_table(
        "tap_team_members",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(128), nullable=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("initials", sa.String(8), nullable=True),
        sa.Column("accent", sa.String(64), nullable=True),
        sa.Column("photo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("photo_url", sa.String(512), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )

    op.create_table(
        "tap_services",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("icon", sa.String(64), nullable=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("bg_class", sa.String(128), nullable=True),
        sa.Column("text_class", sa.String(128), nullable=True),
        sa.Column("accent", sa.String(64), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )

    op.create_table(
        "mous",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("owner", sa.String(32), nullable=False, server_default="tap"),
        sa.Column("department_code", sa.String(16), nullable=True),
        sa.Column("partner_name", sa.String(255), nullable=False),
        sa.Column("logo", sa.String(8), nullable=True),
        sa.Column("logo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("logo_url", sa.String(512), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=True),
        sa.Column("document_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("document_url", sa.String(512), nullable=True),
        sa.Column("document_label", sa.String(128), nullable=True),
        sa.Column("signed_on", sa.Date(), nullable=True),
        sa.Column("expires_on", sa.Date(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_mous_owner", "mous", ["owner"])
    op.create_index("ix_mous_department_code", "mous", ["department_code"])

    op.create_table(
        "recruiter_testimonials",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(255), nullable=True),
        sa.Column("quote", sa.Text(), nullable=False),
        sa.Column("initials", sa.String(8), nullable=True),
        sa.Column("accent", sa.String(64), nullable=True),
        sa.Column("photo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("rating", sa.Integer(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )

    op.create_table(
        "tap_events",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("event_date", sa.Date(), nullable=True),
        sa.Column("image_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("image_url", sa.String(512), nullable=True),
        sa.Column("icon", sa.String(64), nullable=True),
        sa.Column("type", sa.String(64), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="upcoming"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_tap_events_event_date", "tap_events", ["event_date"])
    op.create_index("ix_tap_events_status", "tap_events", ["status"])


def downgrade() -> None:
    op.drop_table("tap_events")
    op.drop_table("recruiter_testimonials")
    op.drop_table("mous")
    op.drop_table("tap_services")
    op.drop_table("tap_team_members")
    op.drop_table("placement_statistics")
    op.drop_table("placement_records")
    op.drop_table("recruiters")
    op.drop_table("recruiter_categories")
