"""whats_new_updates: campus updates surfaced on /whats-new.

Revision ID: 0013
Revises: 0012
Create Date: 2026-06-05
"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0013"
down_revision: Union[str, None] = "0012"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "whats_new_updates",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("caption", sa.Text(), nullable=True),
        sa.Column("event_date", sa.Date(), nullable=True),
        sa.Column(
            "image_id",
            sa.Integer(),
            sa.ForeignKey("media_assets.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column("image_url", sa.String(512), nullable=True),
        sa.Column("link_url", sa.String(512), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("is_featured", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column(
            "created_by_user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
        sa.Column(
            "updated_by_user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.create_index("ix_whats_new_updates_event_date", "whats_new_updates", ["event_date"])
    op.create_index("ix_whats_new_updates_is_active", "whats_new_updates", ["is_active"])

    # Seed the 10 starter cards. image_url paths resolve through Vercel's
    # static handler — frontend/public/images/new-events/ ships with the SPA.
    seed = [
        {"title": "Campus Event 1",  "image_url": "/images/new-events/event-01.jpeg", "sort_order": 1, "is_featured": True},
        {"title": "Campus Event 2",  "image_url": "/images/new-events/event-02.jpeg", "sort_order": 2},
        {"title": "Campus Event 3",  "image_url": "/images/new-events/event-03.jpeg", "sort_order": 3},
        {"title": "Campus Event 4",  "image_url": "/images/new-events/event-04.jpeg", "sort_order": 4},
        {"title": "Campus Event 5",  "image_url": "/images/new-events/event-05.jpeg", "sort_order": 5},
        {"title": "Campus Event 6",  "image_url": "/images/new-events/event-06.jpeg", "sort_order": 6},
        {"title": "Campus Event 7",  "image_url": "/images/new-events/event-07.jpeg", "sort_order": 7},
        {"title": "Campus Event 8",  "image_url": "/images/new-events/event-08.jpeg", "sort_order": 8},
        {"title": "Campus Event 9",  "image_url": "/images/new-events/event-09.jpeg", "sort_order": 9},
        {"title": "Campus Event 10", "image_url": "/images/new-events/event-10.jpeg", "sort_order": 10},
    ]
    rows = [
        {
            "title": s["title"],
            "caption": None,
            "event_date": None,
            "image_id": None,
            "image_url": s["image_url"],
            "link_url": None,
            "is_active": True,
            "is_featured": s.get("is_featured", False),
            "sort_order": s["sort_order"],
        }
        for s in seed
    ]
    op.bulk_insert(
        sa.table(
            "whats_new_updates",
            sa.column("title", sa.String),
            sa.column("caption", sa.Text),
            sa.column("event_date", sa.Date),
            sa.column("image_id", sa.Integer),
            sa.column("image_url", sa.String),
            sa.column("link_url", sa.String),
            sa.column("is_active", sa.Boolean),
            sa.column("is_featured", sa.Boolean),
            sa.column("sort_order", sa.Integer),
        ),
        rows,
    )


def downgrade() -> None:
    op.drop_index("ix_whats_new_updates_is_active", table_name="whats_new_updates")
    op.drop_index("ix_whats_new_updates_event_date", table_name="whats_new_updates")
    op.drop_table("whats_new_updates")
