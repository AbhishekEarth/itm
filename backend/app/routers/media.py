from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, Query, Request, UploadFile, status
from sqlalchemy import desc, or_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import NotFoundError
from app.deps import get_current_user, require
from app.models import MediaAsset, User
from app.schemas.media import MediaOut, MediaUpdate, MediaVariant
from app.services import audit, media as media_svc

router = APIRouter(prefix="/media", tags=["media"])

EDIT_SCOPES = ("site.settings", "site.pages", "gallery")


def _to_out(asset: MediaAsset, variants: list[dict] | None = None) -> MediaOut:
    return MediaOut(
        id=asset.id,
        kind=asset.kind,
        public_url=asset.public_url,
        mime=asset.mime,
        size_bytes=asset.size_bytes,
        width=asset.width,
        height=asset.height,
        alt=asset.alt,
        caption=asset.caption,
        folder=asset.folder,
        original_name=asset.original_name,
        variants=[MediaVariant(**v) for v in (variants or [])],
        created_at=asset.created_at,
    )


@router.post(
    "",
    response_model=MediaOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require(*EDIT_SCOPES, "placements.tap", "events.pac", "events.cultural"))],
)
async def upload(
    request: Request,
    file: UploadFile = File(...),
    folder: str | None = Form(None),
    alt: str | None = Form(None),
    caption: str | None = Form(None),
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    raw = await file.read()
    mime = file.content_type or "application/octet-stream"
    result = media_svc.save_upload(
        db,
        raw=raw,
        mime=mime,
        original_name=file.filename or "upload",
        folder=folder,
        alt=alt,
        caption=caption,
        uploaded_by_user_id=actor.id,
    )
    audit.record(
        db,
        user_id=actor.id,
        action="media.upload",
        entity_type="media",
        entity_id=result.asset.id,
        after={"mime": mime, "size": len(raw), "folder": folder},
        ip=request.client.host if request.client else None,
    )
    return _to_out(result.asset, result.variants)


@router.get("", response_model=list[MediaOut], dependencies=[Depends(get_current_user)])
def list_media(
    db: Session = Depends(get_db),
    folder: str | None = Query(None),
    kind: str | None = Query(None),
    q: str | None = Query(None),
    limit: int = Query(60, ge=1, le=200),
    offset: int = Query(0, ge=0),
):
    stmt = select(MediaAsset).where(MediaAsset.is_active.is_(True))
    if folder:
        stmt = stmt.where(MediaAsset.folder == folder)
    if kind:
        stmt = stmt.where(MediaAsset.kind == kind)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(
            or_(MediaAsset.alt.ilike(like), MediaAsset.caption.ilike(like), MediaAsset.original_name.ilike(like))
        )
    rows = db.scalars(stmt.order_by(desc(MediaAsset.created_at)).limit(limit).offset(offset)).all()
    return [_to_out(a) for a in rows]


@router.get("/{media_id}", response_model=MediaOut, dependencies=[Depends(get_current_user)])
def get_media(media_id: int, db: Session = Depends(get_db)):
    asset = db.get(MediaAsset, media_id)
    if not asset or not asset.is_active:
        raise NotFoundError("Media not found")
    return _to_out(asset)


@router.patch("/{media_id}", response_model=MediaOut, dependencies=[Depends(require(*EDIT_SCOPES))])
def update_media(
    media_id: int,
    body: MediaUpdate,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    asset = db.get(MediaAsset, media_id)
    if not asset or not asset.is_active:
        raise NotFoundError("Media not found")
    before = {"alt": asset.alt, "caption": asset.caption, "folder": asset.folder}
    if body.alt is not None:
        asset.alt = body.alt
    if body.caption is not None:
        asset.caption = body.caption
    if body.folder is not None:
        asset.folder = body.folder
    asset.updated_by_user_id = actor.id
    db.commit()
    db.refresh(asset)
    audit.record(
        db,
        user_id=actor.id,
        action="media.update",
        entity_type="media",
        entity_id=asset.id,
        before=before,
        after={"alt": asset.alt, "caption": asset.caption, "folder": asset.folder},
        ip=request.client.host if request.client else None,
    )
    return _to_out(asset)


@router.delete("/{media_id}", status_code=204, dependencies=[Depends(require(*EDIT_SCOPES))])
def delete_media(
    media_id: int,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    asset = db.get(MediaAsset, media_id)
    if not asset or not asset.is_active:
        raise NotFoundError("Media not found")
    asset.is_active = False
    db.commit()
    audit.record(
        db,
        user_id=actor.id,
        action="media.delete",
        entity_type="media",
        entity_id=asset.id,
        ip=request.client.host if request.client else None,
    )
