"""admissions, forms, careers: 12 tables

Revision ID: 0007
Revises: 0006
Create Date: 2026-05-28
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0007"
down_revision: Union[str, None] = "0006"
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
        "admission_steps",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("icon", sa.String(64), nullable=True),
        sa.Column("estimated_duration", sa.String(64), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *_ts(),
    )
    op.create_index("ix_admission_steps_position", "admission_steps", ["position"])

    op.create_table(
        "required_documents",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("mandatory", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("applies_to", sa.JSON(), nullable=True),
        sa.Column("formats", sa.JSON(), nullable=True),
        sa.Column("max_size_mb", sa.Integer(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )

    op.create_table(
        "admission_counsellors",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("photo_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("expertise", sa.JSON(), nullable=True),
        sa.Column("programme", sa.String(128), nullable=True),
        sa.Column("icon", sa.String(64), nullable=True),
        sa.Column("is_available", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )

    op.create_table(
        "fee_components",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("type", sa.String(32), nullable=False, server_default="other"),
        sa.Column("amount", sa.Numeric(12, 2), nullable=True),
        sa.Column("currency", sa.String(8), nullable=False, server_default="INR"),
        sa.Column("frequency", sa.String(32), nullable=False, server_default="annual"),
        sa.Column("duration_semesters", sa.Integer(), nullable=True),
        sa.Column("applies_to_programmes", sa.JSON(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_fee_components_type", "fee_components", ["type"])

    op.create_table(
        "quotas",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(128), nullable=False),
        sa.Column("percentage", sa.Numeric(5, 2), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("eligibility_md", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )

    op.create_table(
        "admission_faqs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("programme_code", sa.String(64), nullable=True),
        sa.Column("category", sa.String(64), nullable=True),
        sa.Column("question", sa.String(512), nullable=False),
        sa.Column("answer_md", sa.Text(), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *_ts(),
    )
    op.create_index("ix_admission_faqs_programme_code", "admission_faqs", ["programme_code"])
    op.create_index("ix_admission_faqs_category", "admission_faqs", ["category"])

    op.create_table(
        "admission_timeline",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("event", sa.String(255), nullable=False),
        sa.Column("event_date", sa.Date(), nullable=True),
        sa.Column("kind", sa.String(32), nullable=True),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_admission_timeline_year", "admission_timeline", ["year"])

    op.create_table(
        "admission_leads",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("programme_interest", sa.String(128), nullable=True),
        sa.Column("city", sa.String(128), nullable=True),
        sa.Column("state", sa.String(128), nullable=True),
        sa.Column("source", sa.String(64), nullable=True),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="new"),
        sa.Column("assigned_to_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("ip", sa.String(64), nullable=True),
        sa.Column("user_agent", sa.String(255), nullable=True),
        *_ts(),
    )
    op.create_index("ix_admission_leads_email", "admission_leads", ["email"])
    op.create_index("ix_admission_leads_status", "admission_leads", ["status"])

    op.create_table(
        "contact_submissions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("kind", sa.String(32), nullable=False, server_default="general"),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("subject", sa.String(255), nullable=True),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("attachments", sa.JSON(), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="new"),
        sa.Column("assigned_to_user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("ip", sa.String(64), nullable=True),
        *_ts(),
    )
    op.create_index("ix_contact_submissions_kind", "contact_submissions", ["kind"])
    op.create_index("ix_contact_submissions_status", "contact_submissions", ["status"])

    op.create_table(
        "open_positions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("department_code", sa.String(16), nullable=True),
        sa.Column("category", sa.String(64), nullable=True),
        sa.Column("type", sa.String(32), nullable=False, server_default="full_time"),
        sa.Column("location", sa.String(128), nullable=True),
        sa.Column("experience", sa.String(128), nullable=True),
        sa.Column("description_md", sa.Text(), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=True),
        sa.Column("deadline", sa.Date(), nullable=True),
        sa.Column("jd_pdf_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("jd_pdf_url", sa.String(512), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="open"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_open_positions_department_code", "open_positions", ["department_code"])
    op.create_index("ix_open_positions_category", "open_positions", ["category"])
    op.create_index("ix_open_positions_status", "open_positions", ["status"])

    op.create_table(
        "job_applications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("position_id", sa.Integer(), sa.ForeignKey("open_positions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("applicant_name", sa.String(255), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(32), nullable=True),
        sa.Column("resume_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("resume_url", sa.String(512), nullable=True),
        sa.Column("cover_letter_md", sa.Text(), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="new"),
        sa.Column("notes", sa.Text(), nullable=True),
        *_ts(),
    )
    op.create_index("ix_job_applications_position_id", "job_applications", ["position_id"])
    op.create_index("ix_job_applications_email", "job_applications", ["email"])
    op.create_index("ix_job_applications_status", "job_applications", ["status"])

    op.create_table(
        "jrf_postings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("stipend", sa.String(64), nullable=True),
        sa.Column("duration", sa.String(64), nullable=True),
        sa.Column("research_area", sa.String(255), nullable=True),
        sa.Column("eligibility_md", sa.Text(), nullable=True),
        sa.Column("deadline", sa.Date(), nullable=True),
        sa.Column("jd_pdf_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("jd_pdf_url", sa.String(512), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="open"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_jrf_postings_status", "jrf_postings", ["status"])


def downgrade() -> None:
    op.drop_table("jrf_postings")
    op.drop_table("job_applications")
    op.drop_table("open_positions")
    op.drop_table("contact_submissions")
    op.drop_table("admission_leads")
    op.drop_table("admission_timeline")
    op.drop_table("admission_faqs")
    op.drop_table("quotas")
    op.drop_table("fee_components")
    op.drop_table("admission_counsellors")
    op.drop_table("required_documents")
    op.drop_table("admission_steps")
