"""Compliance + Alumni + People (board / officials).

Scopes:
  - compliance.naac        : NAAC docs + grade
  - compliance.nirf        : NIRF records
  - compliance.committees  : committee members
  - compliance.policies    : reuses /api/research/policies (owner=compliance) — see research router
  - alumni.speaks          : alumni profiles + featured quotes
  - alumni.chapters        : chapters list
  - alumni.mentorship      : mentorship programmes
  - alumni.membership      : (handled via settings group=alumni.membership)
  - site.settings          : officials + board members (institute-level)
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import NotFoundError
from app.deps import get_current_user, require
from app.models import (
    AlumniChapter,
    AlumniMentorship,
    AlumniProfile,
    BoardMember,
    CommitteeMember,
    MediaAsset,
    NaacDocument,
    NaacGrade,
    NirfRecord,
    Official,
    User,
)
from app.schemas.compliance import (
    AlumniChapterIn,
    AlumniChapterOut,
    AlumniMentorshipIn,
    AlumniMentorshipOut,
    AlumniProfileIn,
    AlumniProfileOut,
    BoardMemberIn,
    BoardMemberOut,
    CommitteeMemberIn,
    CommitteeMemberOut,
    NaacDocIn,
    NaacDocOut,
    NaacGradeIn,
    NaacGradeOut,
    NirfIn,
    NirfOut,
    OfficialIn,
    OfficialOut,
)
from app.services import audit

router = APIRouter(tags=["compliance+alumni+people"])

NAAC = [Depends(require("compliance.naac"))]
NIRF = [Depends(require("compliance.nirf"))]
COMMS = [Depends(require("compliance.committees"))]
ALUM_SPEAKS = [Depends(require("alumni.speaks"))]
ALUM_CHAP = [Depends(require("alumni.chapters"))]
ALUM_MENT = [Depends(require("alumni.mentorship"))]
SITE = [Depends(require("site.settings"))]


def _media(db: Session, mid: int | None) -> str | None:
    if not mid:
        return None
    a = db.get(MediaAsset, mid)
    return a.public_url if a and a.is_active else None


# ── NAAC ─────────────────────────────────────────────────────────────


comp = APIRouter(prefix="/compliance", tags=["compliance"])


def _naac_out(db: Session, n: NaacDocument) -> NaacDocOut:
    base = {col.name: getattr(n, col.name) for col in n.__table__.columns if col.name in NaacDocIn.model_fields}
    return NaacDocOut(**base, id=n.id, resolved_pdf_url=_media(db, n.pdf_id) or n.pdf_url)


@comp.get("/naac/docs", response_model=list[NaacDocOut], dependencies=[Depends(get_current_user)])
def list_naac(db: Session = Depends(get_db), cycle: str | None = Query(None)):
    stmt = select(NaacDocument)
    if cycle:
        stmt = stmt.where(NaacDocument.cycle == cycle)
    return [_naac_out(db, n) for n in db.scalars(stmt.order_by(NaacDocument.cycle.desc(), NaacDocument.criterion, NaacDocument.sort_order)).all()]


@comp.post("/naac/docs", response_model=NaacDocOut, status_code=201, dependencies=NAAC)
def create_naac(body: NaacDocIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = NaacDocument(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    audit.record(db, user_id=actor.id, action="naac.create", entity_type="naac_document", entity_id=o.id,
                 after={"title": o.title},
                 ip=request.client.host if request.client else None)
    return _naac_out(db, o)


@comp.patch("/naac/docs/{oid}", response_model=NaacDocOut, dependencies=NAAC)
def update_naac(oid: int, body: NaacDocIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(NaacDocument, oid)
    if not o:
        raise NotFoundError("NAAC doc not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return _naac_out(db, o)


@comp.delete("/naac/docs/{oid}", status_code=204, dependencies=NAAC)
def delete_naac(oid: int, db: Session = Depends(get_db)):
    o = db.get(NaacDocument, oid)
    if not o:
        raise NotFoundError("NAAC doc not found")
    db.delete(o); db.commit()


def _grade_out(db: Session, g: NaacGrade) -> NaacGradeOut:
    base = {col.name: getattr(g, col.name) for col in g.__table__.columns if col.name in NaacGradeIn.model_fields}
    return NaacGradeOut(**base, id=g.id, resolved_certificate_url=_media(db, g.certificate_id) or g.certificate_url)


@comp.get("/naac/grades", response_model=list[NaacGradeOut], dependencies=[Depends(get_current_user)])
def list_grades(db: Session = Depends(get_db)):
    return [_grade_out(db, g) for g in db.scalars(select(NaacGrade).order_by(NaacGrade.cycle.desc())).all()]


@comp.put("/naac/grades/{cycle}", response_model=NaacGradeOut, dependencies=NAAC)
def upsert_grade(cycle: str, body: NaacGradeIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    g = db.scalar(select(NaacGrade).where(NaacGrade.cycle == cycle))
    if not g:
        g = NaacGrade(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
        g.cycle = cycle
        db.add(g)
    else:
        for k, v in body.model_dump().items():
            setattr(g, k, v)
        g.updated_by_user_id = actor.id
    db.commit(); db.refresh(g)
    return _grade_out(db, g)


# ── NIRF ─────────────────────────────────────────────────────────────


def _nirf_out(db: Session, n: NirfRecord) -> NirfOut:
    base = {col.name: getattr(n, col.name) for col in n.__table__.columns if col.name in NirfIn.model_fields}
    return NirfOut(**base, id=n.id, resolved_document_url=_media(db, n.document_id) or n.document_url)


@comp.get("/nirf", response_model=list[NirfOut], dependencies=[Depends(get_current_user)])
def list_nirf(db: Session = Depends(get_db), category: str | None = Query(None), year: int | None = Query(None)):
    stmt = select(NirfRecord)
    if category:
        stmt = stmt.where(NirfRecord.category == category)
    if year:
        stmt = stmt.where(NirfRecord.year == year)
    return [_nirf_out(db, n) for n in db.scalars(stmt.order_by(NirfRecord.year.desc(), NirfRecord.category)).all()]


@comp.post("/nirf", response_model=NirfOut, status_code=201, dependencies=NIRF)
def create_nirf(body: NirfIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = NirfRecord(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return _nirf_out(db, o)


@comp.patch("/nirf/{oid}", response_model=NirfOut, dependencies=NIRF)
def update_nirf(oid: int, body: NirfIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(NirfRecord, oid)
    if not o:
        raise NotFoundError("NIRF record not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return _nirf_out(db, o)


@comp.delete("/nirf/{oid}", status_code=204, dependencies=NIRF)
def delete_nirf(oid: int, db: Session = Depends(get_db)):
    o = db.get(NirfRecord, oid)
    if not o:
        raise NotFoundError("NIRF record not found")
    db.delete(o); db.commit()


# ── Committees ───────────────────────────────────────────────────────


@comp.get("/committees", response_model=list[CommitteeMemberOut], dependencies=[Depends(get_current_user)])
def list_committees(db: Session = Depends(get_db), committee: str | None = Query(None)):
    stmt = select(CommitteeMember)
    if committee:
        stmt = stmt.where(CommitteeMember.committee == committee)
    return db.scalars(stmt.order_by(CommitteeMember.committee, CommitteeMember.sort_order)).all()


@comp.post("/committees", response_model=CommitteeMemberOut, status_code=201, dependencies=COMMS)
def create_committee(body: CommitteeMemberIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = CommitteeMember(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return o


@comp.patch("/committees/{oid}", response_model=CommitteeMemberOut, dependencies=COMMS)
def update_committee(oid: int, body: CommitteeMemberIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(CommitteeMember, oid)
    if not o:
        raise NotFoundError("Committee member not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return o


@comp.delete("/committees/{oid}", status_code=204, dependencies=COMMS)
def delete_committee(oid: int, db: Session = Depends(get_db)):
    o = db.get(CommitteeMember, oid)
    if not o:
        raise NotFoundError("Committee member not found")
    db.delete(o); db.commit()


router.include_router(comp)


# ── People (board + officials) ───────────────────────────────────────


people = APIRouter(prefix="/people", tags=["people"])


def _board_out(db: Session, b: BoardMember) -> BoardMemberOut:
    base = {col.name: getattr(b, col.name) for col in b.__table__.columns if col.name in BoardMemberIn.model_fields}
    return BoardMemberOut(**base, id=b.id, resolved_photo_url=_media(db, b.photo_id) or b.photo_url)


def _official_out(db: Session, o: Official) -> OfficialOut:
    base = {col.name: getattr(o, col.name) for col in o.__table__.columns if col.name in OfficialIn.model_fields}
    return OfficialOut(**base, id=o.id, resolved_photo_url=_media(db, o.photo_id) or o.photo_url)


@people.get("/board", response_model=list[BoardMemberOut], dependencies=[Depends(get_current_user)])
def list_board(db: Session = Depends(get_db)):
    return [_board_out(db, b) for b in db.scalars(select(BoardMember).order_by(BoardMember.sort_order)).all()]


@people.post("/board", response_model=BoardMemberOut, status_code=201, dependencies=SITE)
def create_board(body: BoardMemberIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = BoardMember(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return _board_out(db, o)


@people.patch("/board/{oid}", response_model=BoardMemberOut, dependencies=SITE)
def update_board(oid: int, body: BoardMemberIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(BoardMember, oid)
    if not o:
        raise NotFoundError("Board member not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return _board_out(db, o)


@people.delete("/board/{oid}", status_code=204, dependencies=SITE)
def delete_board(oid: int, db: Session = Depends(get_db)):
    o = db.get(BoardMember, oid)
    if not o:
        raise NotFoundError("Board member not found")
    db.delete(o); db.commit()


@people.get("/officials", response_model=list[OfficialOut], dependencies=[Depends(get_current_user)])
def list_officials(db: Session = Depends(get_db), department_code: str | None = Query(None)):
    stmt = select(Official)
    if department_code:
        stmt = stmt.where(Official.department_code == department_code)
    return [_official_out(db, o) for o in db.scalars(stmt.order_by(Official.sort_order)).all()]


@people.post("/officials", response_model=OfficialOut, status_code=201, dependencies=SITE)
def create_official(body: OfficialIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = Official(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return _official_out(db, o)


@people.patch("/officials/{oid}", response_model=OfficialOut, dependencies=SITE)
def update_official(oid: int, body: OfficialIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(Official, oid)
    if not o:
        raise NotFoundError("Official not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return _official_out(db, o)


@people.delete("/officials/{oid}", status_code=204, dependencies=SITE)
def delete_official(oid: int, db: Session = Depends(get_db)):
    o = db.get(Official, oid)
    if not o:
        raise NotFoundError("Official not found")
    db.delete(o); db.commit()


router.include_router(people)


# ── Alumni ───────────────────────────────────────────────────────────


alum = APIRouter(prefix="/alumni", tags=["alumni"])


def _alum_out(db: Session, a: AlumniProfile) -> AlumniProfileOut:
    base = {col.name: getattr(a, col.name) for col in a.__table__.columns if col.name in AlumniProfileIn.model_fields}
    return AlumniProfileOut(**base, id=a.id, resolved_photo_url=_media(db, a.photo_id) or a.photo_url)


@alum.get("/profiles", response_model=list[AlumniProfileOut], dependencies=[Depends(get_current_user)])
def list_alumni(db: Session = Depends(get_db), featured: bool | None = Query(None), batch_year: int | None = Query(None)):
    stmt = select(AlumniProfile)
    if featured is not None:
        stmt = stmt.where(AlumniProfile.is_featured.is_(featured))
    if batch_year is not None:
        stmt = stmt.where(AlumniProfile.batch_year == batch_year)
    return [_alum_out(db, a) for a in db.scalars(stmt.order_by(AlumniProfile.sort_order, AlumniProfile.batch_year.desc())).all()]


@alum.post("/profiles", response_model=AlumniProfileOut, status_code=201, dependencies=ALUM_SPEAKS)
def create_alumni(body: AlumniProfileIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = AlumniProfile(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return _alum_out(db, o)


@alum.patch("/profiles/{oid}", response_model=AlumniProfileOut, dependencies=ALUM_SPEAKS)
def update_alumni(oid: int, body: AlumniProfileIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(AlumniProfile, oid)
    if not o:
        raise NotFoundError("Alumni profile not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return _alum_out(db, o)


@alum.delete("/profiles/{oid}", status_code=204, dependencies=ALUM_SPEAKS)
def delete_alumni(oid: int, db: Session = Depends(get_db)):
    o = db.get(AlumniProfile, oid)
    if not o:
        raise NotFoundError("Alumni profile not found")
    db.delete(o); db.commit()


@alum.get("/chapters", response_model=list[AlumniChapterOut], dependencies=[Depends(get_current_user)])
def list_chapters(db: Session = Depends(get_db)):
    return db.scalars(select(AlumniChapter).order_by(AlumniChapter.sort_order, AlumniChapter.city)).all()


@alum.post("/chapters", response_model=AlumniChapterOut, status_code=201, dependencies=ALUM_CHAP)
def create_chapter(body: AlumniChapterIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = AlumniChapter(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return o


@alum.patch("/chapters/{oid}", response_model=AlumniChapterOut, dependencies=ALUM_CHAP)
def update_chapter(oid: int, body: AlumniChapterIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(AlumniChapter, oid)
    if not o:
        raise NotFoundError("Chapter not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return o


@alum.delete("/chapters/{oid}", status_code=204, dependencies=ALUM_CHAP)
def delete_chapter(oid: int, db: Session = Depends(get_db)):
    o = db.get(AlumniChapter, oid)
    if not o:
        raise NotFoundError("Chapter not found")
    db.delete(o); db.commit()


@alum.get("/mentorships", response_model=list[AlumniMentorshipOut], dependencies=[Depends(get_current_user)])
def list_mentorships(db: Session = Depends(get_db)):
    return db.scalars(select(AlumniMentorship).order_by(AlumniMentorship.sort_order)).all()


@alum.post("/mentorships", response_model=AlumniMentorshipOut, status_code=201, dependencies=ALUM_MENT)
def create_mentorship(body: AlumniMentorshipIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = AlumniMentorship(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return o


@alum.patch("/mentorships/{oid}", response_model=AlumniMentorshipOut, dependencies=ALUM_MENT)
def update_mentorship(oid: int, body: AlumniMentorshipIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(AlumniMentorship, oid)
    if not o:
        raise NotFoundError("Mentorship not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return o


@alum.delete("/mentorships/{oid}", status_code=204, dependencies=ALUM_MENT)
def delete_mentorship(oid: int, db: Session = Depends(get_db)):
    o = db.get(AlumniMentorship, oid)
    if not o:
        raise NotFoundError("Mentorship not found")
    db.delete(o); db.commit()


router.include_router(alum)
