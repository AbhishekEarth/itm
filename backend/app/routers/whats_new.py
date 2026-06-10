"""CRUD for /api/whats-new (admin) and /api/public/whats-new (anonymous list).

Write access is gated by the `notices` scope to match the existing campus-update
content types (Notice, Announcement). Read is open on the public endpoint.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import NotFoundError
from app.deps import get_current_user, require
from app.models import MediaAsset, User
from app.models.whats_new import WhatsNewUpdate
from app.schemas.whats_new import WhatsNewIn, WhatsNewOut
from app.services import audit

router = APIRouter(prefix="/whats-new", tags=["whats-new"])

WRITE = [Depends(require("notices", "site.pages"))]


def _resolved_image(db: Session, row: WhatsNewUpdate) -> str | None:
    if row.image_id:
        asset = db.get(MediaAsset, row.image_id)
        if asset and asset.is_active:
            return asset.public_url
    return row.image_url


def _to_out(db: Session, row: WhatsNewUpdate) -> WhatsNewOut:
    base = {col.name: getattr(row, col.name) for col in row.__table__.columns if col.name in WhatsNewIn.model_fields}
    return WhatsNewOut(
        **base,
        id=row.id,
        resolved_image_url=_resolved_image(db, row),
        created_at=row.created_at,
        updated_at=row.updated_at,
    )


@router.get("", response_model=list[WhatsNewOut], dependencies=[Depends(get_current_user)])
def list_updates(
    db: Session = Depends(get_db),
    active: bool | None = Query(None),
    limit: int = Query(200, ge=1, le=500),
):
    stmt = select(WhatsNewUpdate)
    if active is not None:
        stmt = stmt.where(WhatsNewUpdate.is_active.is_(active))
    stmt = stmt.order_by(
        WhatsNewUpdate.is_featured.desc(),
        WhatsNewUpdate.sort_order,
        WhatsNewUpdate.event_date.desc().nulls_last(),
        WhatsNewUpdate.created_at.desc(),
    ).limit(limit)
    return [_to_out(db, r) for r in db.scalars(stmt).all()]


@router.post("", response_model=WhatsNewOut, status_code=status.HTTP_201_CREATED, dependencies=WRITE)
def create_update(body: WhatsNewIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    row = WhatsNewUpdate(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(row)
    db.commit()
    db.refresh(row)
    audit.record(
        db, user_id=actor.id, action="whats_new.create", entity_type="whats_new", entity_id=row.id,
        after={"title": row.title},
        ip=request.client.host if request.client else None,
    )
    return _to_out(db, row)


@router.patch("/{uid}", response_model=WhatsNewOut, dependencies=WRITE)
def update_update(uid: int, body: WhatsNewIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    row = db.get(WhatsNewUpdate, uid)
    if not row:
        raise NotFoundError("Update not found")
    for k, v in body.model_dump().items():
        setattr(row, k, v)
    row.updated_by_user_id = actor.id
    db.commit()
    db.refresh(row)
    audit.record(
        db, user_id=actor.id, action="whats_new.update", entity_type="whats_new", entity_id=uid,
        ip=request.client.host if request.client else None,
    )
    return _to_out(db, row)


@router.delete("/{uid}", status_code=204, dependencies=WRITE)
def delete_update(uid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    row = db.get(WhatsNewUpdate, uid)
    if not row:
        raise NotFoundError("Update not found")
    db.delete(row)
    db.commit()
    audit.record(
        db, user_id=actor.id, action="whats_new.delete", entity_type="whats_new", entity_id=uid,
        ip=request.client.host if request.client else None,
    )


# ── Public read endpoint ─────────────────────────────────────────────
public_router = APIRouter(prefix="/public/whats-new", tags=["public-whats-new"])


@public_router.get("", response_model=list[WhatsNewOut])
def public_list(db: Session = Depends(get_db), limit: int = Query(100, ge=1, le=200)):
    stmt = (
        select(WhatsNewUpdate)
        .where(WhatsNewUpdate.is_active.is_(True))
        .order_by(
            WhatsNewUpdate.is_featured.desc(),
            WhatsNewUpdate.sort_order,
            WhatsNewUpdate.event_date.desc().nulls_last(),
            WhatsNewUpdate.created_at.desc(),
        )
        .limit(limit)
    )
    return [_to_out(db, r) for r in db.scalars(stmt).all()]
