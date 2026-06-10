"""academics: departments + hod + faculty + labs + partners + projects + awards

Revision ID: 0003
Revises: 0002
Create Date: 2026-05-28
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "departments",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("code", sa.String(16), nullable=False, unique=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("short_name", sa.String(32), nullable=True),
        sa.Column("page_path", sa.String(64), nullable=True),
        sa.Column("established_year", sa.Integer(), nullable=True),
        sa.Column("intake", sa.Integer(), nullable=True),
        sa.Column("duration", sa.String(64), nullable=True),
        sa.Column("mtech_since", sa.Integer(), nullable=True),
        sa.Column("mtech_intake", sa.Integer(), nullable=True),
        sa.Column("affiliation", sa.String(255), nullable=True),
        sa.Column("faculty_count", sa.Integer(), nullable=True),
        sa.Column("accent_from", sa.String(64), nullable=True),
        sa.Column("accent_to", sa.String(64), nullable=True),
        sa.Column("accent_solid", sa.String(32), nullable=True),
        sa.Column("icon", sa.String(8), nullable=True),
        sa.Column(
            "image_id",
            sa.Integer(),
            sa.ForeignKey("media_assets.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("image_url", sa.String(512), nullable=True),
        sa.Column("badge", sa.String(128), nullable=True),
        sa.Column("subtitle", sa.String(512), nullable=True),
        sa.Column("intro_md", sa.Text(), nullable=True),
        sa.Column("chips", sa.JSON(), nullable=True),
        sa.Column("accreditations", sa.JSON(), nullable=True),
        sa.Column("specializations", sa.JSON(), nullable=True),
        sa.Column("features", sa.JSON(), nullable=True),
        sa.Column("hod_highlights", sa.JSON(), nullable=True),
        sa.Column("software", sa.JSON(), nullable=True),
        sa.Column("vision", sa.Text(), nullable=True),
        sa.Column("mission", sa.JSON(), nullable=True),
        sa.Column("peos", sa.JSON(), nullable=True),
        sa.Column("psos", sa.JSON(), nullable=True),
        sa.Column("achievements", sa.JSON(), nullable=True),
        sa.Column("sub_units", sa.JSON(), nullable=True),
        sa.Column("infra", sa.JSON(), nullable=True),
        sa.Column("consultancy", sa.JSON(), nullable=True),
        sa.Column("events_list", sa.JSON(), nullable=True),
        sa.Column("guest_lectures", sa.JSON(), nullable=True),
        sa.Column("industrial_visits", sa.JSON(), nullable=True),
        sa.Column("placement_payload", sa.JSON(), nullable=True),
        sa.Column("placement_batches", sa.JSON(), nullable=True),
        sa.Column("contact", sa.JSON(), nullable=True),
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
    op.create_index("ix_departments_code", "departments", ["code"])
    op.create_index("ix_departments_scope_key", "departments", ["scope_key"])
    op.create_index("ix_departments_slug", "departments", ["slug"])

    op.create_table(
        "hod_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("department_id", sa.Integer(), sa.ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(128), nullable=True),
        sa.Column("qualification", sa.String(255), nullable=True),
        sa.Column("message_md", sa.Text(), nullable=True),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("joined_on", sa.String(64), nullable=True),
        sa.Column("research_area", sa.String(255), nullable=True),
        sa.Column("photo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )

    op.create_table(
        "faculty",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("department_id", sa.Integer(), sa.ForeignKey("departments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("employee_no", sa.String(64), nullable=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("role", sa.String(128), nullable=True),
        sa.Column("qualification", sa.String(255), nullable=True),
        sa.Column("specialization", sa.String(255), nullable=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("bio_md", sa.Text(), nullable=True),
        sa.Column("photo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("google_scholar_url", sa.String(512), nullable=True),
        sa.Column("orcid", sa.String(64), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("is_highlight", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_faculty_department_id", "faculty", ["department_id"])
    op.create_index("ix_faculty_employee_no", "faculty", ["employee_no"])

    op.create_table(
        "laboratories",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("department_id", sa.Integer(), sa.ForeignKey("departments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("icon", sa.String(8), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("tools", sa.JSON(), nullable=True),
        sa.Column("photo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_laboratories_department_id", "laboratories", ["department_id"])

    op.create_table(
        "industry_partners",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("department_id", sa.Integer(), sa.ForeignKey("departments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("category", sa.String(32), nullable=False, server_default="industry"),
        sa.Column("url", sa.String(512), nullable=True),
        sa.Column("logo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_industry_partners_department_id", "industry_partners", ["department_id"])
    op.create_index("ix_industry_partners_category", "industry_partners", ["category"])

    op.create_table(
        "student_projects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("department_id", sa.Integer(), sa.ForeignKey("departments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("note", sa.Text(), nullable=True),
        sa.Column("year", sa.Integer(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_student_projects_department_id", "student_projects", ["department_id"])

    op.create_table(
        "student_awards",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("department_id", sa.Integer(), sa.ForeignKey("departments.id", ondelete="CASCADE"), nullable=False),
        sa.Column("student_name", sa.String(255), nullable=False),
        sa.Column("award", sa.String(255), nullable=False),
        sa.Column("batch", sa.String(64), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("created_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("updated_by_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_student_awards_department_id", "student_awards", ["department_id"])


def downgrade() -> None:
    op.drop_table("student_awards")
    op.drop_table("student_projects")
    op.drop_table("industry_partners")
    op.drop_table("laboratories")
    op.drop_table("faculty")
    op.drop_table("hod_profiles")
    op.drop_table("departments")
