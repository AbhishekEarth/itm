"""research: focus areas, publications, books, patents, journal, conferences, fdps, policies

Revision ID: 0005
Revises: 0004
Create Date: 2026-05-28
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0005"
down_revision: Union[str, None] = "0004"
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
        "research_focus_areas",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("icon", sa.String(8), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("departments", sa.JSON(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )

    op.create_table(
        "publications",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("year", sa.String(16), nullable=False),
        sa.Column("count_label", sa.String(32), nullable=True),
        sa.Column("pdf_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("pdf_url", sa.String(512), nullable=True),
        sa.Column("department_code", sa.String(16), nullable=True),
        sa.Column("summary", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_publications_year", "publications", ["year"])
    op.create_index("ix_publications_department_code", "publications", ["department_code"])

    op.create_table(
        "books_and_chapters",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("year", sa.String(16), nullable=False),
        sa.Column("title", sa.String(512), nullable=True),
        sa.Column("pdf_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("pdf_url", sa.String(512), nullable=True),
        sa.Column("contributors", sa.JSON(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_books_and_chapters_year", "books_and_chapters", ["year"])

    op.create_table(
        "patents",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(512), nullable=False),
        sa.Column("inventors", sa.JSON(), nullable=True),
        sa.Column("filed_on", sa.Date(), nullable=True),
        sa.Column("granted_on", sa.Date(), nullable=True),
        sa.Column("patent_no", sa.String(128), nullable=True),
        sa.Column("status", sa.String(32), nullable=False, server_default="filed"),
        sa.Column("department_code", sa.String(16), nullable=True),
        sa.Column("pdf_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("pdf_url", sa.String(512), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_patents_status", "patents", ["status"])
    op.create_index("ix_patents_department_code", "patents", ["department_code"])
    op.create_index("ix_patents_patent_no", "patents", ["patent_no"])

    op.create_table(
        "journal_issues",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("volume", sa.String(32), nullable=True),
        sa.Column("issue", sa.String(32), nullable=True),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("theme", sa.String(512), nullable=True),
        sa.Column("cover_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("cover_url", sa.String(512), nullable=True),
        sa.Column("pdf_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("pdf_url", sa.String(512), nullable=True),
        sa.Column("is_published", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_journal_issues_year", "journal_issues", ["year"])

    op.create_table(
        "conferences",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(512), nullable=False),
        sa.Column("short_name", sa.String(64), nullable=True),
        sa.Column("year", sa.Integer(), nullable=False),
        sa.Column("location", sa.String(255), nullable=True),
        sa.Column("theme", sa.Text(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("banner_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("banner_url", sa.String(512), nullable=True),
        sa.Column("brochure_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("brochure_url", sa.String(512), nullable=True),
        sa.Column("proceedings_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("proceedings_url", sa.String(512), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="upcoming"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_conferences_year", "conferences", ["year"])
    op.create_index("ix_conferences_status", "conferences", ["status"])

    op.create_table(
        "conference_papers",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("conference_id", sa.Integer(), sa.ForeignKey("conferences.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(512), nullable=False),
        sa.Column("authors", sa.JSON(), nullable=True),
        sa.Column("abstract_md", sa.Text(), nullable=True),
        sa.Column("pdf_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("pdf_url", sa.String(512), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_conference_papers_conference_id", "conference_papers", ["conference_id"])

    op.create_table(
        "fdps",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(512), nullable=False),
        sa.Column("start_date", sa.Date(), nullable=True),
        sa.Column("end_date", sa.Date(), nullable=True),
        sa.Column("mode", sa.String(16), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("banner_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("banner_url", sa.String(512), nullable=True),
        sa.Column("brochure_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("brochure_url", sa.String(512), nullable=True),
        sa.Column("status", sa.String(16), nullable=False, server_default="upcoming"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_fdps_start_date", "fdps", ["start_date"])
    op.create_index("ix_fdps_status", "fdps", ["status"])

    op.create_table(
        "fdp_sessions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("fdp_id", sa.Integer(), sa.ForeignKey("fdps.id", ondelete="CASCADE"), nullable=False),
        sa.Column("day", sa.Integer(), nullable=False, server_default="1"),
        sa.Column("time_slot", sa.String(64), nullable=True),
        sa.Column("speaker", sa.String(255), nullable=True),
        sa.Column("topic", sa.String(512), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_fdp_sessions_fdp_id", "fdp_sessions", ["fdp_id"])

    op.create_table(
        "policy_documents",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("owner", sa.String(32), nullable=False, server_default="research"),
        sa.Column("title", sa.String(512), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("icon", sa.String(64), nullable=True),
        sa.Column("pdf_id", sa.Integer(), sa.ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True),
        sa.Column("pdf_url", sa.String(512), nullable=True),
        sa.Column("version", sa.String(32), nullable=True),
        sa.Column("last_revised_on", sa.Date(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        *_ts(),
    )
    op.create_index("ix_policy_documents_owner", "policy_documents", ["owner"])


def downgrade() -> None:
    op.drop_table("policy_documents")
    op.drop_table("fdp_sessions")
    op.drop_table("fdps")
    op.drop_table("conference_papers")
    op.drop_table("conferences")
    op.drop_table("journal_issues")
    op.drop_table("patents")
    op.drop_table("books_and_chapters")
    op.drop_table("publications")
    op.drop_table("research_focus_areas")
