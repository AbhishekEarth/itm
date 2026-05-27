"""TAP / Placements admin endpoints. All writes require `placements.tap`."""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import NotFoundError
from app.deps import get_current_user, require
from app.models import (
    MediaAsset,
    MoU,
    PlacementRecord,
    PlacementStatistic,
    Recruiter,
    RecruiterCategory,
    RecruiterTestimonial,
    TapEvent,
    TapService,
    TapTeamMember,
    User,
)
from app.schemas.placements import (
    MoUIn,
    MoUOut,
    PlacementRecordIn,
    PlacementRecordOut,
    PlacementStatisticIn,
    PlacementStatisticOut,
    RecruiterCategoryIn,
    RecruiterCategoryOut,
    RecruiterIn,
    RecruiterOut,
    RecruiterTestimonialIn,
    RecruiterTestimonialOut,
    TapEventIn,
    TapEventOut,
    TapServiceIn,
    TapServiceOut,
    TapTeamMemberIn,
    TapTeamMemberOut,
)
from app.services import audit

router = APIRouter(prefix="/placements", tags=["placements"])

SCOPE = "placements.tap"
WRITE = [Depends(require(SCOPE))]


def _media(db: Session, mid: int | None) -> str | None:
    if not mid:
        return None
    a = db.get(MediaAsset, mid)
    return a.public_url if a and a.is_active else None


# ── Recruiter categories ────────────────────────────────────────────


@router.get("/categories", response_model=list[RecruiterCategoryOut], dependencies=[Depends(get_current_user)])
def list_categories(db: Session = Depends(get_db)):
    return db.scalars(select(RecruiterCategory).order_by(RecruiterCategory.sort_order)).all()


@router.post("/categories", response_model=RecruiterCategoryOut, status_code=status.HTTP_201_CREATED, dependencies=WRITE)
def create_category(body: RecruiterCategoryIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = RecruiterCategory(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="recruiter_category.create", entity_type="recruiter_category", entity_id=obj.id, ip=request.client.host if request.client else None)
    return obj


@router.patch("/categories/{cid}", response_model=RecruiterCategoryOut, dependencies=WRITE)
def update_category(cid: int, body: RecruiterCategoryIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(RecruiterCategory, cid)
    if not obj:
        raise NotFoundError("Category not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="recruiter_category.update", entity_type="recruiter_category", entity_id=cid, ip=request.client.host if request.client else None)
    return obj


@router.delete("/categories/{cid}", status_code=204, dependencies=WRITE)
def delete_category(cid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(RecruiterCategory, cid)
    if not obj:
        raise NotFoundError("Category not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="recruiter_category.delete", entity_type="recruiter_category", entity_id=cid, ip=request.client.host if request.client else None)


# ── Recruiters ──────────────────────────────────────────────────────


def _recruiter_out(db: Session, r: Recruiter) -> RecruiterOut:
    cat = db.get(RecruiterCategory, r.category_id) if r.category_id else None
    return RecruiterOut(
        id=r.id, name=r.name, category_id=r.category_id, sector=r.sector, tier=r.tier,
        logo_id=r.logo_id, logo_url=r.logo_url, website=r.website,
        sort_order=r.sort_order, is_active=r.is_active,
        resolved_logo_url=_media(db, r.logo_id) or r.logo_url,
        category_key=cat.key if cat else None, category_name=cat.name if cat else None,
    )


@router.get("/recruiters", response_model=list[RecruiterOut], dependencies=[Depends(get_current_user)])
def list_recruiters(
    db: Session = Depends(get_db),
    category_id: int | None = Query(None),
    tier: str | None = Query(None),
    is_active: bool | None = Query(None),
    limit: int = Query(500, ge=1, le=2000),
):
    stmt = select(Recruiter)
    if category_id is not None:
        stmt = stmt.where(Recruiter.category_id == category_id)
    if tier:
        stmt = stmt.where(Recruiter.tier == tier)
    if is_active is not None:
        stmt = stmt.where(Recruiter.is_active.is_(is_active))
    rows = db.scalars(stmt.order_by(Recruiter.sort_order, Recruiter.name).limit(limit)).all()
    return [_recruiter_out(db, r) for r in rows]


@router.post("/recruiters", response_model=RecruiterOut, status_code=status.HTTP_201_CREATED, dependencies=WRITE)
def create_recruiter(body: RecruiterIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = Recruiter(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="recruiter.create", entity_type="recruiter", entity_id=obj.id, after={"name": obj.name}, ip=request.client.host if request.client else None)
    return _recruiter_out(db, obj)


@router.patch("/recruiters/{rid}", response_model=RecruiterOut, dependencies=WRITE)
def update_recruiter(rid: int, body: RecruiterIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Recruiter, rid)
    if not obj:
        raise NotFoundError("Recruiter not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="recruiter.update", entity_type="recruiter", entity_id=rid, ip=request.client.host if request.client else None)
    return _recruiter_out(db, obj)


@router.delete("/recruiters/{rid}", status_code=204, dependencies=WRITE)
def delete_recruiter(rid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Recruiter, rid)
    if not obj:
        raise NotFoundError("Recruiter not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="recruiter.delete", entity_type="recruiter", entity_id=rid, ip=request.client.host if request.client else None)


# ── Placement records ───────────────────────────────────────────────


def _record_out(db: Session, r: PlacementRecord) -> PlacementRecordOut:
    return PlacementRecordOut(**{c.name: getattr(r, c.name) for c in r.__table__.columns}, photo_url=_media(db, r.photo_id))


@router.get("/records", response_model=list[PlacementRecordOut], dependencies=[Depends(get_current_user)])
def list_records(
    db: Session = Depends(get_db),
    department_code: str | None = Query(None),
    batch_year: int | None = Query(None),
    featured: bool | None = Query(None),
    limit: int = Query(500, ge=1, le=5000),
):
    stmt = select(PlacementRecord)
    if department_code:
        stmt = stmt.where(PlacementRecord.department_code == department_code)
    if batch_year:
        stmt = stmt.where(PlacementRecord.batch_year == batch_year)
    if featured is not None:
        stmt = stmt.where(PlacementRecord.is_featured.is_(featured))
    rows = db.scalars(stmt.order_by(PlacementRecord.sort_order, PlacementRecord.student_name).limit(limit)).all()
    return [_record_out(db, r) for r in rows]


@router.post("/records", response_model=PlacementRecordOut, status_code=status.HTTP_201_CREATED, dependencies=WRITE)
def create_record(body: PlacementRecordIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = PlacementRecord(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="placement_record.create", entity_type="placement_record", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _record_out(db, obj)


@router.patch("/records/{rid}", response_model=PlacementRecordOut, dependencies=WRITE)
def update_record(rid: int, body: PlacementRecordIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(PlacementRecord, rid)
    if not obj:
        raise NotFoundError("Placement record not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="placement_record.update", entity_type="placement_record", entity_id=rid, ip=request.client.host if request.client else None)
    return _record_out(db, obj)


@router.delete("/records/{rid}", status_code=204, dependencies=WRITE)
def delete_record(rid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(PlacementRecord, rid)
    if not obj:
        raise NotFoundError("Placement record not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="placement_record.delete", entity_type="placement_record", entity_id=rid, ip=request.client.host if request.client else None)


# ── Statistics ──────────────────────────────────────────────────────


@router.get("/stats", response_model=list[PlacementStatisticOut], dependencies=[Depends(get_current_user)])
def list_stats(db: Session = Depends(get_db), department_code: str | None = Query(None)):
    stmt = select(PlacementStatistic)
    if department_code:
        stmt = stmt.where(PlacementStatistic.department_code == department_code)
    return db.scalars(stmt.order_by(PlacementStatistic.batch_year.desc())).all()


@router.post("/stats", response_model=PlacementStatisticOut, status_code=status.HTTP_201_CREATED, dependencies=WRITE)
def create_stat(body: PlacementStatisticIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = PlacementStatistic(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="placement_stat.create", entity_type="placement_stat", entity_id=obj.id, ip=request.client.host if request.client else None)
    return obj


@router.patch("/stats/{sid}", response_model=PlacementStatisticOut, dependencies=WRITE)
def update_stat(sid: int, body: PlacementStatisticIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(PlacementStatistic, sid)
    if not obj:
        raise NotFoundError("Stat not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="placement_stat.update", entity_type="placement_stat", entity_id=sid, ip=request.client.host if request.client else None)
    return obj


@router.delete("/stats/{sid}", status_code=204, dependencies=WRITE)
def delete_stat(sid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(PlacementStatistic, sid)
    if not obj:
        raise NotFoundError("Stat not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="placement_stat.delete", entity_type="placement_stat", entity_id=sid, ip=request.client.host if request.client else None)


# ── TAP Team ────────────────────────────────────────────────────────


def _team_out(db: Session, m: TapTeamMember) -> TapTeamMemberOut:
    return TapTeamMemberOut(**{c.name: getattr(m, c.name) for c in m.__table__.columns}, resolved_photo_url=_media(db, m.photo_id) or m.photo_url)


@router.get("/team", response_model=list[TapTeamMemberOut], dependencies=[Depends(get_current_user)])
def list_team(db: Session = Depends(get_db)):
    return [_team_out(db, m) for m in db.scalars(select(TapTeamMember).order_by(TapTeamMember.sort_order)).all()]


@router.post("/team", response_model=TapTeamMemberOut, status_code=status.HTTP_201_CREATED, dependencies=WRITE)
def create_team(body: TapTeamMemberIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = TapTeamMember(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="tap_team.create", entity_type="tap_team_member", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _team_out(db, obj)


@router.patch("/team/{tid}", response_model=TapTeamMemberOut, dependencies=WRITE)
def update_team(tid: int, body: TapTeamMemberIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(TapTeamMember, tid)
    if not obj:
        raise NotFoundError("Team member not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="tap_team.update", entity_type="tap_team_member", entity_id=tid, ip=request.client.host if request.client else None)
    return _team_out(db, obj)


@router.delete("/team/{tid}", status_code=204, dependencies=WRITE)
def delete_team(tid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(TapTeamMember, tid)
    if not obj:
        raise NotFoundError("Team member not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="tap_team.delete", entity_type="tap_team_member", entity_id=tid, ip=request.client.host if request.client else None)


# ── TAP Services ────────────────────────────────────────────────────


@router.get("/services", response_model=list[TapServiceOut], dependencies=[Depends(get_current_user)])
def list_services(db: Session = Depends(get_db)):
    return db.scalars(select(TapService).order_by(TapService.sort_order)).all()


@router.post("/services", response_model=TapServiceOut, status_code=status.HTTP_201_CREATED, dependencies=WRITE)
def create_service(body: TapServiceIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = TapService(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="tap_service.create", entity_type="tap_service", entity_id=obj.id, ip=request.client.host if request.client else None)
    return obj


@router.patch("/services/{sid}", response_model=TapServiceOut, dependencies=WRITE)
def update_service(sid: int, body: TapServiceIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(TapService, sid)
    if not obj:
        raise NotFoundError("Service not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="tap_service.update", entity_type="tap_service", entity_id=sid, ip=request.client.host if request.client else None)
    return obj


@router.delete("/services/{sid}", status_code=204, dependencies=WRITE)
def delete_service(sid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(TapService, sid)
    if not obj:
        raise NotFoundError("Service not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="tap_service.delete", entity_type="tap_service", entity_id=sid, ip=request.client.host if request.client else None)


# ── MoUs ────────────────────────────────────────────────────────────


def _mou_out(db: Session, m: MoU) -> MoUOut:
    return MoUOut(
        **{c.name: getattr(m, c.name) for c in m.__table__.columns},
        resolved_logo_url=_media(db, m.logo_id) or m.logo_url,
        resolved_document_url=_media(db, m.document_id) or m.document_url,
    )


@router.get("/mous", response_model=list[MoUOut], dependencies=[Depends(get_current_user)])
def list_mous(db: Session = Depends(get_db), owner: str | None = Query(None)):
    stmt = select(MoU)
    if owner:
        stmt = stmt.where(MoU.owner == owner)
    return [_mou_out(db, m) for m in db.scalars(stmt.order_by(MoU.sort_order)).all()]


@router.post("/mous", response_model=MoUOut, status_code=status.HTTP_201_CREATED, dependencies=WRITE)
def create_mou(body: MoUIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = MoU(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="mou.create", entity_type="mou", entity_id=obj.id, after={"partner": obj.partner_name}, ip=request.client.host if request.client else None)
    return _mou_out(db, obj)


@router.patch("/mous/{mid}", response_model=MoUOut, dependencies=WRITE)
def update_mou(mid: int, body: MoUIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(MoU, mid)
    if not obj:
        raise NotFoundError("MoU not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="mou.update", entity_type="mou", entity_id=mid, ip=request.client.host if request.client else None)
    return _mou_out(db, obj)


@router.delete("/mous/{mid}", status_code=204, dependencies=WRITE)
def delete_mou(mid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(MoU, mid)
    if not obj:
        raise NotFoundError("MoU not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="mou.delete", entity_type="mou", entity_id=mid, ip=request.client.host if request.client else None)


# ── Testimonials ────────────────────────────────────────────────────


def _testimonial_out(db: Session, t: RecruiterTestimonial) -> RecruiterTestimonialOut:
    return RecruiterTestimonialOut(**{c.name: getattr(t, c.name) for c in t.__table__.columns}, photo_url=_media(db, t.photo_id))


@router.get("/testimonials", response_model=list[RecruiterTestimonialOut], dependencies=[Depends(get_current_user)])
def list_testimonials(db: Session = Depends(get_db)):
    return [_testimonial_out(db, t) for t in db.scalars(select(RecruiterTestimonial).order_by(RecruiterTestimonial.sort_order)).all()]


@router.post("/testimonials", response_model=RecruiterTestimonialOut, status_code=status.HTTP_201_CREATED, dependencies=WRITE)
def create_testimonial(body: RecruiterTestimonialIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = RecruiterTestimonial(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="testimonial.create", entity_type="testimonial", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _testimonial_out(db, obj)


@router.patch("/testimonials/{tid}", response_model=RecruiterTestimonialOut, dependencies=WRITE)
def update_testimonial(tid: int, body: RecruiterTestimonialIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(RecruiterTestimonial, tid)
    if not obj:
        raise NotFoundError("Testimonial not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="testimonial.update", entity_type="testimonial", entity_id=tid, ip=request.client.host if request.client else None)
    return _testimonial_out(db, obj)


@router.delete("/testimonials/{tid}", status_code=204, dependencies=WRITE)
def delete_testimonial(tid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(RecruiterTestimonial, tid)
    if not obj:
        raise NotFoundError("Testimonial not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="testimonial.delete", entity_type="testimonial", entity_id=tid, ip=request.client.host if request.client else None)


# ── TAP events ──────────────────────────────────────────────────────


def _event_out(db: Session, e: TapEvent) -> TapEventOut:
    return TapEventOut(**{c.name: getattr(e, c.name) for c in e.__table__.columns}, resolved_image_url=_media(db, e.image_id) or e.image_url)


@router.get("/events", response_model=list[TapEventOut], dependencies=[Depends(get_current_user)])
def list_events(db: Session = Depends(get_db), status_: str | None = Query(None, alias="status")):
    stmt = select(TapEvent)
    if status_:
        stmt = stmt.where(TapEvent.status == status_)
    return [_event_out(db, e) for e in db.scalars(stmt.order_by(TapEvent.event_date.desc(), TapEvent.sort_order)).all()]


@router.post("/events", response_model=TapEventOut, status_code=status.HTTP_201_CREATED, dependencies=WRITE)
def create_event(body: TapEventIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = TapEvent(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="tap_event.create", entity_type="tap_event", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _event_out(db, obj)


@router.patch("/events/{eid}", response_model=TapEventOut, dependencies=WRITE)
def update_event(eid: int, body: TapEventIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(TapEvent, eid)
    if not obj:
        raise NotFoundError("Event not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="tap_event.update", entity_type="tap_event", entity_id=eid, ip=request.client.host if request.client else None)
    return _event_out(db, obj)


@router.delete("/events/{eid}", status_code=204, dependencies=WRITE)
def delete_event(eid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(TapEvent, eid)
    if not obj:
        raise NotFoundError("Event not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="tap_event.delete", entity_type="tap_event", entity_id=eid, ip=request.client.host if request.client else None)
