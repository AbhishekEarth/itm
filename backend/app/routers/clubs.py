"""Clubs / cells + events + notices + announcements + gallery.

Scope routing:
  - Clubs: editable by the club's own scope_key (e.g. clubs.nss) OR site.pages.
  - Events: auto-scoped via club's scope_key; events.pac and events.cultural
    are extra editor scopes accepted for clubs they own.
  - Notices + Announcements: `notices` scope.
  - Gallery: `gallery` scope (or the category's own scope_key).
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import ConflictError, ForbiddenError, NotFoundError
from app.deps import get_current_user, has_any_scope, require
from app.models import (
    Announcement,
    ClubCell,
    Event,
    GalleryCategory,
    GalleryItem,
    MediaAsset,
    Notice,
    User,
    Video,
)
from app.schemas.events import (
    AnnouncementIn,
    AnnouncementOut,
    ClubCellIn,
    ClubCellOut,
    ClubCellUpdate,
    EventIn,
    EventOut,
    GalleryBulkAdd,
    GalleryCategoryIn,
    GalleryCategoryOut,
    GalleryItemIn,
    GalleryItemOut,
    NoticeIn,
    NoticeOut,
    VideoIn,
    VideoOut,
)
from app.services import audit

router = APIRouter(tags=["clubs+events+gallery"])

GLOBAL = ("site.pages",)


def _media(db: Session, mid: int | None) -> str | None:
    if not mid:
        return None
    a = db.get(MediaAsset, mid)
    return a.public_url if a and a.is_active else None


def _read_dep():
    return Depends(get_current_user)


# ── Clubs ────────────────────────────────────────────────────────────


def _club_out(db: Session, c: ClubCell) -> ClubCellOut:
    base = {col.name: getattr(c, col.name) for col in c.__table__.columns if col.name in ClubCellIn.model_fields}
    base["id"] = c.id
    return ClubCellOut(**base, resolved_logo_url=_media(db, c.logo_id) or c.logo_url)


def _require_club_edit(club: ClubCell, actor: User) -> None:
    if has_any_scope(actor, GLOBAL):
        return
    extra = []
    if club.scope_key:
        extra.append(club.scope_key)
    if has_any_scope(actor, extra):
        return
    raise ForbiddenError(f"Requires {club.scope_key or 'site.pages'} scope")


clubs = APIRouter(prefix="/clubs", tags=["clubs"])


@clubs.get("", response_model=list[ClubCellOut], dependencies=[_read_dep()])
def list_clubs(db: Session = Depends(get_db), type_: str | None = Query(None, alias="type")):
    stmt = select(ClubCell)
    if type_:
        stmt = stmt.where(ClubCell.type == type_)
    return [_club_out(db, c) for c in db.scalars(stmt.order_by(ClubCell.sort_order, ClubCell.name)).all()]


@clubs.get("/{code}", response_model=ClubCellOut, dependencies=[_read_dep()])
def get_club(code: str, db: Session = Depends(get_db)):
    c = db.scalar(select(ClubCell).where(ClubCell.code == code))
    if not c:
        raise NotFoundError(f"Club {code} not found")
    return _club_out(db, c)


@clubs.post("", response_model=ClubCellOut, status_code=status.HTTP_201_CREATED)
def create_club(body: ClubCellIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    if not has_any_scope(actor, GLOBAL):
        raise ForbiddenError("Requires site.pages scope")
    c = ClubCell(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(c)
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise ConflictError("Club code or slug already exists") from e
    db.refresh(c)
    audit.record(db, user_id=actor.id, action="club.create", entity_type="club", entity_id=c.id,
                 after={"code": c.code, "name": c.name},
                 ip=request.client.host if request.client else None)
    return _club_out(db, c)


@clubs.patch("/{code}", response_model=ClubCellOut)
def update_club(code: str, body: ClubCellUpdate, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    c = db.scalar(select(ClubCell).where(ClubCell.code == code))
    if not c:
        raise NotFoundError(f"Club {code} not found")
    _require_club_edit(c, actor)
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(c, k, v)
    c.updated_by_user_id = actor.id
    db.commit()
    db.refresh(c)
    audit.record(db, user_id=actor.id, action="club.update", entity_type="club", entity_id=c.id,
                 ip=request.client.host if request.client else None)
    return _club_out(db, c)


@clubs.delete("/{code}", status_code=204)
def delete_club(code: str, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    if not has_any_scope(actor, GLOBAL):
        raise ForbiddenError("Requires site.pages scope")
    c = db.scalar(select(ClubCell).where(ClubCell.code == code))
    if not c:
        raise NotFoundError(f"Club {code} not found")
    db.delete(c)
    db.commit()
    audit.record(db, user_id=actor.id, action="club.delete", entity_type="club", entity_id=code,
                 ip=request.client.host if request.client else None)


router.include_router(clubs)


# ── Events ───────────────────────────────────────────────────────────


events_r = APIRouter(prefix="/events", tags=["events"])

EVENT_GLOBAL_SCOPES = ("site.pages", "events.pac", "events.cultural")


def _resolve_event_club(db: Session, event: Event | None, club_id: int | None) -> ClubCell | None:
    cid = (event.club_id if event else None) or club_id
    if not cid:
        return None
    return db.get(ClubCell, cid)


def _require_event_edit(actor: User, club: ClubCell | None) -> None:
    if has_any_scope(actor, EVENT_GLOBAL_SCOPES):
        return
    if club and club.scope_key and has_any_scope(actor, [club.scope_key]):
        return
    raise ForbiddenError("Requires events.pac / events.cultural / site.pages or the club's own scope")


def _event_out(db: Session, e: Event) -> EventOut:
    base = {col.name: getattr(e, col.name) for col in e.__table__.columns if col.name in EventIn.model_fields}
    base["id"] = e.id
    club = db.get(ClubCell, e.club_id) if e.club_id else None
    return EventOut(
        **base,
        resolved_banner_url=_media(db, e.banner_id) or e.banner_url,
        club_code=club.code if club else None,
        club_name=club.name if club else None,
    )


@events_r.get("", response_model=list[EventOut], dependencies=[_read_dep()])
def list_events(
    db: Session = Depends(get_db),
    status_: str | None = Query(None, alias="status"),
    club_code: str | None = Query(None),
    limit: int = Query(200, ge=1, le=500),
):
    stmt = select(Event)
    if status_:
        stmt = stmt.where(Event.status == status_)
    if club_code:
        sub = select(ClubCell.id).where(ClubCell.code == club_code).scalar_subquery()
        stmt = stmt.where(Event.club_id == sub)
    rows = db.scalars(stmt.order_by(Event.event_date.desc().nulls_last(), Event.sort_order).limit(limit)).all()
    return [_event_out(db, e) for e in rows]


@events_r.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(body: EventIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    club = _resolve_event_club(db, None, body.club_id)
    _require_event_edit(actor, club)
    e = Event(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(e); db.commit(); db.refresh(e)
    audit.record(db, user_id=actor.id, action="event.create", entity_type="event", entity_id=e.id,
                 after={"title": e.title, "club_id": e.club_id},
                 ip=request.client.host if request.client else None)
    return _event_out(db, e)


@events_r.patch("/{eid}", response_model=EventOut)
def update_event(eid: int, body: EventIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    e = db.get(Event, eid)
    if not e:
        raise NotFoundError("Event not found")
    club = _resolve_event_club(db, e, body.club_id)
    _require_event_edit(actor, club)
    for k, v in body.model_dump().items():
        setattr(e, k, v)
    e.updated_by_user_id = actor.id
    db.commit(); db.refresh(e)
    audit.record(db, user_id=actor.id, action="event.update", entity_type="event", entity_id=eid,
                 ip=request.client.host if request.client else None)
    return _event_out(db, e)


@events_r.delete("/{eid}", status_code=204)
def delete_event(eid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    e = db.get(Event, eid)
    if not e:
        raise NotFoundError("Event not found")
    club = _resolve_event_club(db, e, None)
    _require_event_edit(actor, club)
    db.delete(e); db.commit()
    audit.record(db, user_id=actor.id, action="event.delete", entity_type="event", entity_id=eid,
                 ip=request.client.host if request.client else None)


router.include_router(events_r)


# ── Notices ──────────────────────────────────────────────────────────


notices_r = APIRouter(prefix="/notices", tags=["notices"])
NOTICE_WRITE = [Depends(require("notices"))]


def _notice_out(db: Session, n: Notice) -> NoticeOut:
    base = {col.name: getattr(n, col.name) for col in n.__table__.columns if col.name in NoticeIn.model_fields}
    base["id"] = n.id
    return NoticeOut(**base, resolved_pdf_url=_media(db, n.pdf_id) or n.pdf_url)


@notices_r.get("", response_model=list[NoticeOut], dependencies=[_read_dep()])
def list_notices(
    db: Session = Depends(get_db),
    priority: str | None = Query(None),
    active: bool | None = Query(None),
    limit: int = Query(200, ge=1, le=500),
):
    stmt = select(Notice)
    if priority:
        stmt = stmt.where(Notice.priority == priority)
    if active is not None:
        stmt = stmt.where(Notice.is_active.is_(active))
    return [_notice_out(db, n) for n in db.scalars(stmt.order_by(Notice.published_at.desc().nulls_last(), Notice.sort_order).limit(limit)).all()]


@notices_r.post("", response_model=NoticeOut, status_code=status.HTTP_201_CREATED, dependencies=NOTICE_WRITE)
def create_notice(body: NoticeIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    n = Notice(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(n); db.commit(); db.refresh(n)
    audit.record(db, user_id=actor.id, action="notice.create", entity_type="notice", entity_id=n.id,
                 ip=request.client.host if request.client else None)
    return _notice_out(db, n)


@notices_r.patch("/{nid}", response_model=NoticeOut, dependencies=NOTICE_WRITE)
def update_notice(nid: int, body: NoticeIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    n = db.get(Notice, nid)
    if not n:
        raise NotFoundError("Notice not found")
    for k, v in body.model_dump().items():
        setattr(n, k, v)
    n.updated_by_user_id = actor.id
    db.commit(); db.refresh(n)
    audit.record(db, user_id=actor.id, action="notice.update", entity_type="notice", entity_id=nid,
                 ip=request.client.host if request.client else None)
    return _notice_out(db, n)


@notices_r.delete("/{nid}", status_code=204, dependencies=NOTICE_WRITE)
def delete_notice(nid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    n = db.get(Notice, nid)
    if not n:
        raise NotFoundError("Notice not found")
    db.delete(n); db.commit()
    audit.record(db, user_id=actor.id, action="notice.delete", entity_type="notice", entity_id=nid,
                 ip=request.client.host if request.client else None)


router.include_router(notices_r)


# ── Announcements ────────────────────────────────────────────────────


ann_r = APIRouter(prefix="/announcements", tags=["announcements"])


@ann_r.get("", response_model=list[AnnouncementOut], dependencies=[_read_dep()])
def list_announcements(db: Session = Depends(get_db), active: bool | None = Query(None)):
    stmt = select(Announcement)
    if active is not None:
        stmt = stmt.where(Announcement.is_active.is_(active))
    return db.scalars(stmt.order_by(Announcement.sort_order)).all()


@ann_r.post("", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED, dependencies=NOTICE_WRITE)
def create_announcement(body: AnnouncementIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = Announcement(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="announcement.create", entity_type="announcement", entity_id=obj.id,
                 ip=request.client.host if request.client else None)
    return obj


@ann_r.patch("/{aid}", response_model=AnnouncementOut, dependencies=NOTICE_WRITE)
def update_announcement(aid: int, body: AnnouncementIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Announcement, aid)
    if not obj:
        raise NotFoundError("Announcement not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="announcement.update", entity_type="announcement", entity_id=aid,
                 ip=request.client.host if request.client else None)
    return obj


@ann_r.delete("/{aid}", status_code=204, dependencies=NOTICE_WRITE)
def delete_announcement(aid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Announcement, aid)
    if not obj:
        raise NotFoundError("Announcement not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="announcement.delete", entity_type="announcement", entity_id=aid,
                 ip=request.client.host if request.client else None)


router.include_router(ann_r)


# ── Gallery ──────────────────────────────────────────────────────────


gallery_r = APIRouter(prefix="/gallery", tags=["gallery"])
GALLERY_GLOBAL = ("site.pages", "gallery")


def _require_gallery(actor: User, cat: GalleryCategory | None = None) -> None:
    if has_any_scope(actor, GALLERY_GLOBAL):
        return
    if cat and cat.scope_key and has_any_scope(actor, [cat.scope_key]):
        return
    raise ForbiddenError("Requires gallery / site.pages scope")


def _category_out(db: Session, c: GalleryCategory) -> GalleryCategoryOut:
    count = db.scalar(
        select(func.count(GalleryItem.id)).where(GalleryItem.category_id == c.id, GalleryItem.is_active.is_(True))
    ) or 0
    base = {col.name: getattr(c, col.name) for col in c.__table__.columns if col.name in GalleryCategoryIn.model_fields}
    base["id"] = c.id
    return GalleryCategoryOut(
        **base, item_count=count, resolved_cover_url=_media(db, c.cover_media_id) or c.cover_url,
    )


def _item_out(db: Session, i: GalleryItem) -> GalleryItemOut:
    base = {col.name: getattr(i, col.name) for col in i.__table__.columns if col.name in GalleryItemIn.model_fields}
    base["id"] = i.id
    base["category_id"] = i.category_id
    return GalleryItemOut(**base, resolved_media_url=_media(db, i.media_id) or i.media_url)


@gallery_r.get("/categories", response_model=list[GalleryCategoryOut], dependencies=[_read_dep()])
def list_categories(db: Session = Depends(get_db)):
    rows = db.scalars(select(GalleryCategory).order_by(GalleryCategory.sort_order, GalleryCategory.label)).all()
    return [_category_out(db, c) for c in rows]


@gallery_r.post("/categories", response_model=GalleryCategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(body: GalleryCategoryIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    _require_gallery(actor)
    c = GalleryCategory(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(c)
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise ConflictError("Gallery category slug already exists") from e
    db.refresh(c)
    audit.record(db, user_id=actor.id, action="gallery_cat.create", entity_type="gallery_category", entity_id=c.id,
                 ip=request.client.host if request.client else None)
    return _category_out(db, c)


@gallery_r.patch("/categories/{cid}", response_model=GalleryCategoryOut)
def update_category(cid: int, body: GalleryCategoryIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    c = db.get(GalleryCategory, cid)
    if not c:
        raise NotFoundError("Category not found")
    _require_gallery(actor, c)
    for k, v in body.model_dump().items():
        setattr(c, k, v)
    c.updated_by_user_id = actor.id
    db.commit(); db.refresh(c)
    audit.record(db, user_id=actor.id, action="gallery_cat.update", entity_type="gallery_category", entity_id=cid,
                 ip=request.client.host if request.client else None)
    return _category_out(db, c)


@gallery_r.delete("/categories/{cid}", status_code=204)
def delete_category(cid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    c = db.get(GalleryCategory, cid)
    if not c:
        raise NotFoundError("Category not found")
    _require_gallery(actor, c)
    db.delete(c); db.commit()
    audit.record(db, user_id=actor.id, action="gallery_cat.delete", entity_type="gallery_category", entity_id=cid,
                 ip=request.client.host if request.client else None)


@gallery_r.get("/categories/{cid}/items", response_model=list[GalleryItemOut], dependencies=[_read_dep()])
def list_items(cid: int, db: Session = Depends(get_db)):
    return [_item_out(db, i) for i in db.scalars(select(GalleryItem).where(GalleryItem.category_id == cid).order_by(GalleryItem.sort_order)).all()]


@gallery_r.post("/categories/{cid}/items", response_model=GalleryItemOut, status_code=status.HTTP_201_CREATED)
def create_item(cid: int, body: GalleryItemIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    cat = db.get(GalleryCategory, cid)
    if not cat:
        raise NotFoundError("Category not found")
    _require_gallery(actor, cat)
    i = GalleryItem(category_id=cid, **body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(i); db.commit(); db.refresh(i)
    audit.record(db, user_id=actor.id, action="gallery_item.create", entity_type="gallery_item", entity_id=i.id,
                 ip=request.client.host if request.client else None)
    return _item_out(db, i)


@gallery_r.post("/categories/{cid}/items/bulk", response_model=list[GalleryItemOut])
def bulk_add(cid: int, body: GalleryBulkAdd, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    cat = db.get(GalleryCategory, cid)
    if not cat:
        raise NotFoundError("Category not found")
    _require_gallery(actor, cat)
    out: list[GalleryItem] = []
    pos = db.scalar(select(func.coalesce(func.max(GalleryItem.sort_order), 0)).where(GalleryItem.category_id == cid)) or 0
    for mid in body.media_ids:
        pos += 1
        out.append(GalleryItem(category_id=cid, media_id=mid, caption=body.caption, sort_order=pos,
                               created_by_user_id=actor.id, updated_by_user_id=actor.id))
    for url in body.media_urls:
        pos += 1
        out.append(GalleryItem(category_id=cid, media_url=url, caption=body.caption, sort_order=pos,
                               created_by_user_id=actor.id, updated_by_user_id=actor.id))
    for item in out:
        db.add(item)
    db.commit()
    for item in out:
        db.refresh(item)
    audit.record(db, user_id=actor.id, action="gallery_item.bulk_add", entity_type="gallery_category", entity_id=cid,
                 after={"count": len(out)},
                 ip=request.client.host if request.client else None)
    return [_item_out(db, i) for i in out]


@gallery_r.patch("/items/{iid}", response_model=GalleryItemOut)
def update_item(iid: int, body: GalleryItemIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    i = db.get(GalleryItem, iid)
    if not i:
        raise NotFoundError("Item not found")
    cat = db.get(GalleryCategory, i.category_id)
    _require_gallery(actor, cat)
    for k, v in body.model_dump().items():
        setattr(i, k, v)
    i.updated_by_user_id = actor.id
    db.commit(); db.refresh(i)
    audit.record(db, user_id=actor.id, action="gallery_item.update", entity_type="gallery_item", entity_id=iid,
                 ip=request.client.host if request.client else None)
    return _item_out(db, i)


@gallery_r.delete("/items/{iid}", status_code=204)
def delete_item(iid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    i = db.get(GalleryItem, iid)
    if not i:
        raise NotFoundError("Item not found")
    cat = db.get(GalleryCategory, i.category_id)
    _require_gallery(actor, cat)
    db.delete(i); db.commit()
    audit.record(db, user_id=actor.id, action="gallery_item.delete", entity_type="gallery_item", entity_id=iid,
                 ip=request.client.host if request.client else None)


@gallery_r.get("/videos", response_model=list[VideoOut], dependencies=[_read_dep()])
def list_videos(db: Session = Depends(get_db), category_id: int | None = Query(None)):
    stmt = select(Video).where(Video.is_active.is_(True))
    if category_id is not None:
        stmt = stmt.where(Video.category_id == category_id)
    rows = db.scalars(stmt.order_by(Video.sort_order)).all()
    return [VideoOut(
        **{col.name: getattr(v, col.name) for col in v.__table__.columns if col.name in VideoIn.model_fields},
        id=v.id,
        resolved_mp4_url=_media(db, v.mp4_media_id) or v.mp4_url,
        resolved_cover_url=_media(db, v.cover_id) or v.cover_url,
    ) for v in rows]


@gallery_r.post("/videos", response_model=VideoOut, status_code=status.HTTP_201_CREATED)
def create_video(body: VideoIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    cat = db.get(GalleryCategory, body.category_id) if body.category_id else None
    _require_gallery(actor, cat)
    v = Video(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(v); db.commit(); db.refresh(v)
    audit.record(db, user_id=actor.id, action="video.create", entity_type="video", entity_id=v.id,
                 ip=request.client.host if request.client else None)
    return VideoOut(
        **{col.name: getattr(v, col.name) for col in v.__table__.columns if col.name in VideoIn.model_fields},
        id=v.id,
        resolved_mp4_url=_media(db, v.mp4_media_id) or v.mp4_url,
        resolved_cover_url=_media(db, v.cover_id) or v.cover_url,
    )


@gallery_r.patch("/videos/{vid}", response_model=VideoOut)
def update_video(vid: int, body: VideoIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    v = db.get(Video, vid)
    if not v:
        raise NotFoundError("Video not found")
    cat = db.get(GalleryCategory, v.category_id) if v.category_id else None
    _require_gallery(actor, cat)
    for k, val in body.model_dump().items():
        setattr(v, k, val)
    v.updated_by_user_id = actor.id
    db.commit(); db.refresh(v)
    audit.record(db, user_id=actor.id, action="video.update", entity_type="video", entity_id=vid,
                 ip=request.client.host if request.client else None)
    return VideoOut(
        **{col.name: getattr(v, col.name) for col in v.__table__.columns if col.name in VideoIn.model_fields},
        id=v.id,
        resolved_mp4_url=_media(db, v.mp4_media_id) or v.mp4_url,
        resolved_cover_url=_media(db, v.cover_id) or v.cover_url,
    )


@gallery_r.delete("/videos/{vid}", status_code=204)
def delete_video(vid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    v = db.get(Video, vid)
    if not v:
        raise NotFoundError("Video not found")
    cat = db.get(GalleryCategory, v.category_id) if v.category_id else None
    _require_gallery(actor, cat)
    db.delete(v); db.commit()
    audit.record(db, user_id=actor.id, action="video.delete", entity_type="video", entity_id=vid,
                 ip=request.client.host if request.client else None)


router.include_router(gallery_r)
