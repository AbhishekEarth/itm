"""compliance, alumni, people: 9 tables

Revision ID: 0008
Revises: 0007
Create Date: 2026-05-28
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0008"
down_revision: Union[str, None] = "0007"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def _ts():
    return [
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    ]


def upgrade() -> None:
    op.create_table(
        "naac_documents",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("cycle", sa.String(32), nullable=True),
        sa.Column("criterion", sa.String(64), nullable=True),
        sa.Column("title", sa.String(512), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("pdf_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("pdf_url", sa.String(512), nullable=True),
        sa.Column("year", sa.Integer(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_naac_documents_cycle", "naac_documents", ["cycle"])
    op.create_index("ix_naac_documents_criterion", "naac_documents", ["criterion"])

    op.create_table(
        "naac_grades",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("cycle", sa.String(32), nullable=False, unique=True),
        sa.Column("grade", sa.String(8), nullable=True),
        sa.Column("cgpa", sa.Numeric(4, 2), nullable=True),
        sa.Column("valid_from", sa.Date(), nullable=True),
        sa.Column("valid_to", sa.Date(), nullable=True),
        sa.Column("certificate_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("certificate_url", sa.String(512), nullable=True),
        *_ts(),
    )

    op.create_table(
        "nirf_records",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("category", sa.String(64), nullable=False),
        sa.Column("rank", sa.Integer(), nullable=True),
        sa.Column("rank_band", sa.String(64), nullable=True),
        sa.Column("total_score", sa.Numeric(6, 2), nullable=True),
        sa.Column("sub_scores", sa.JSON(), nullable=True),
        sa.Column("document_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("document_url", sa.String(512), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_nirf_records_year", "nirf_records", ["year"])
    op.create_index("ix_nirf_records_category", "nirf_records", ["category"])

    op.create_table(
        "committee_members",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("committee", sa.String(128), nullable=False),
        sa.Column("member_name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(128), nullable=True),
        sa.Column("contact", sa.String(255), nullable=True),
        sa.Column("term_start", sa.Date(), nullable=True),
        sa.Column("term_end", sa.Date(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_committee_members_committee", "committee_members", ["committee"])

    op.create_table(
        "board_members",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(128), nullable=False),
        sa.Column("organization", sa.String(255), nullable=True),
        sa.Column("photo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("photo_url", sa.String(512), nullable=True),
        sa.Column("bio_md", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *_ts(),
    )

    op.create_table(
        "officials",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(128), nullable=False),
        sa.Column("department_code", sa.String(16), nullable=True),
        sa.Column("photo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("photo_url", sa.String(512), nullable=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("bio_md", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *_ts(),
    )
    op.create_index("ix_officials_department_code", "officials", ["department_code"])

    op.create_table(
        "alumni_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("batch_year", sa.Integer(), nullable=True),
        sa.Column("programme_code", sa.String(64), nullable=True),
        sa.Column("current_role", sa.String(255), nullable=True),
        sa.Column("company", sa.String(255), nullable=True),
        sa.Column("location", sa.String(128), nullable=True),
        sa.Column("photo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("photo_url", sa.String(512), nullable=True),
        sa.Column("bio_md", sa.Text(), nullable=True),
        sa.Column("quote", sa.Text(), nullable=True),
        sa.Column("linkedin", sa.String(512), nullable=True),
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_alumni_profiles_batch_year", "alumni_profiles", ["batch_year"])
    op.create_index("ix_alumni_profiles_is_featured", "alumni_profiles", ["is_featured"])

    op.create_table(
        "alumni_chapters",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("city", sa.String(128), nullable=False),
        sa.Column("country", sa.String(64), nullable=True, server_default="India"),
        sa.Column("coordinator", sa.String(255), nullable=True),
        sa.Column("members_count", sa.Integer(), nullable=True),
        sa.Column("contact_email", sa.String(255), nullable=True),
        sa.Column("contact_phone", sa.String(32), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )

    op.create_table(
        "alumni_mentorships",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("mentor_alumni_id", sa.Integer(), sa.ForeignKey("alumni_profiles.id", ondelete="SET NULL"), nullable=True),
        sa.Column("focus_area", sa.String(255), nullable=True),
        sa.Column("description_md", sa.Text(), nullable=True),
        sa.Column("slots", sa.Integer(), nullable=True),
        sa.Column("is_open", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )


def downgrade() -> None:
    op.drop_table("alumni_mentorships")
    op.drop_table("alumni_chapters")
    op.drop_table("alumni_profiles")
    op.drop_table("officials")
    op.drop_table("board_members")
    op.drop_table("committee_members")
    op.drop_table("nirf_records")
    op.drop_table("naac_grades")
    op.drop_table("naac_documents")
