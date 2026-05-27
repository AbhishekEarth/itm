"""Research suite — per-section scopes:
  - research.rdcell        focus areas + policy docs
  - research.publications  publication archive + books/chapters + patents
  - research.journal       journal issues
  - research.conference    conferences + papers
  - research.fdp           FDPs + sessions
  - research.innovation    (settings-based; see /api/settings group=research.innovation)
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import NotFoundError
from app.deps import get_current_user, require
from app.models import (
    BookOrChapter,
    Conference,
    ConferencePaper,
    Fdp,
    FdpSession,
    JournalIssue,
    MediaAsset,
    Patent,
    PolicyDocument,
    Publication,
    ResearchFocusArea,
    User,
)
from app.schemas.research import (
    BookIn,
    BookOut,
    ConferenceIn,
    ConferenceOut,
    ConferencePaperIn,
    ConferencePaperOut,
    FdpIn,
    FdpOut,
    FdpSessionIn,
    FdpSessionOut,
    FocusAreaIn,
    FocusAreaOut,
    JournalIssueIn,
    JournalIssueOut,
    PatentIn,
    PatentOut,
    PolicyIn,
    PolicyOut,
    PublicationIn,
    PublicationOut,
)
from app.services import audit

router = APIRouter(prefix="/research", tags=["research"])


def _media(db: Session, mid: int | None) -> str | None:
    if not mid:
        return None
    a = db.get(MediaAsset, mid)
    return a.public_url if a and a.is_active else None


def _read_dep():
    return Depends(get_current_user)


def _write(scope: str):
    return [Depends(require(scope))]


# ── Focus areas (research.rdcell) ────────────────────────────────────


@router.get("/focus-areas", response_model=list[FocusAreaOut], dependencies=[_read_dep()])
def list_focus_areas(db: Session = Depends(get_db)):
    return db.scalars(select(ResearchFocusArea).order_by(ResearchFocusArea.sort_order)).all()


@router.post("/focus-areas", response_model=FocusAreaOut, status_code=status.HTTP_201_CREATED, dependencies=_write("research.rdcell"))
def create_focus_area(body: FocusAreaIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = ResearchFocusArea(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="focus_area.create", entity_type="focus_area", entity_id=obj.id, ip=request.client.host if request.client else None)
    return obj


@router.patch("/focus-areas/{fid}", response_model=FocusAreaOut, dependencies=_write("research.rdcell"))
def update_focus_area(fid: int, body: FocusAreaIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(ResearchFocusArea, fid)
    if not obj:
        raise NotFoundError("Focus area not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="focus_area.update", entity_type="focus_area", entity_id=fid, ip=request.client.host if request.client else None)
    return obj


@router.delete("/focus-areas/{fid}", status_code=204, dependencies=_write("research.rdcell"))
def delete_focus_area(fid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(ResearchFocusArea, fid)
    if not obj:
        raise NotFoundError("Focus area not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="focus_area.delete", entity_type="focus_area", entity_id=fid, ip=request.client.host if request.client else None)


# ── Publications (research.publications) ─────────────────────────────


def _pub_out(db: Session, p: Publication) -> PublicationOut:
    return PublicationOut(**{c.name: getattr(p, c.name) for c in p.__table__.columns}, resolved_pdf_url=_media(db, p.pdf_id) or p.pdf_url)


@router.get("/publications", response_model=list[PublicationOut], dependencies=[_read_dep()])
def list_publications(db: Session = Depends(get_db), year: str | None = Query(None), department_code: str | None = Query(None)):
    stmt = select(Publication)
    if year:
        stmt = stmt.where(Publication.year == year)
    if department_code:
        stmt = stmt.where(Publication.department_code == department_code)
    rows = db.scalars(stmt.order_by(Publication.year.desc(), Publication.sort_order)).all()
    return [_pub_out(db, p) for p in rows]


@router.post("/publications", response_model=PublicationOut, status_code=status.HTTP_201_CREATED, dependencies=_write("research.publications"))
def create_publication(body: PublicationIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = Publication(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="publication.create", entity_type="publication", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _pub_out(db, obj)


@router.patch("/publications/{pid}", response_model=PublicationOut, dependencies=_write("research.publications"))
def update_publication(pid: int, body: PublicationIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Publication, pid)
    if not obj:
        raise NotFoundError("Publication not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="publication.update", entity_type="publication", entity_id=pid, ip=request.client.host if request.client else None)
    return _pub_out(db, obj)


@router.delete("/publications/{pid}", status_code=204, dependencies=_write("research.publications"))
def delete_publication(pid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Publication, pid)
    if not obj:
        raise NotFoundError("Publication not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="publication.delete", entity_type="publication", entity_id=pid, ip=request.client.host if request.client else None)


# ── Books & chapters ─────────────────────────────────────────────────


def _book_out(db: Session, b: BookOrChapter) -> BookOut:
    return BookOut(**{c.name: getattr(b, c.name) for c in b.__table__.columns}, resolved_pdf_url=_media(db, b.pdf_id) or b.pdf_url)


@router.get("/books", response_model=list[BookOut], dependencies=[_read_dep()])
def list_books(db: Session = Depends(get_db), year: str | None = Query(None)):
    stmt = select(BookOrChapter)
    if year:
        stmt = stmt.where(BookOrChapter.year == year)
    return [_book_out(db, b) for b in db.scalars(stmt.order_by(BookOrChapter.year.desc(), BookOrChapter.sort_order)).all()]


@router.post("/books", response_model=BookOut, status_code=status.HTTP_201_CREATED, dependencies=_write("research.publications"))
def create_book(body: BookIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = BookOrChapter(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="book.create", entity_type="book", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _book_out(db, obj)


@router.patch("/books/{bid}", response_model=BookOut, dependencies=_write("research.publications"))
def update_book(bid: int, body: BookIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(BookOrChapter, bid)
    if not obj:
        raise NotFoundError("Book not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="book.update", entity_type="book", entity_id=bid, ip=request.client.host if request.client else None)
    return _book_out(db, obj)


@router.delete("/books/{bid}", status_code=204, dependencies=_write("research.publications"))
def delete_book(bid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(BookOrChapter, bid)
    if not obj:
        raise NotFoundError("Book not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="book.delete", entity_type="book", entity_id=bid, ip=request.client.host if request.client else None)


# ── Patents ──────────────────────────────────────────────────────────


def _patent_out(db: Session, p: Patent) -> PatentOut:
    return PatentOut(**{c.name: getattr(p, c.name) for c in p.__table__.columns}, resolved_pdf_url=_media(db, p.pdf_id) or p.pdf_url)


@router.get("/patents", response_model=list[PatentOut], dependencies=[_read_dep()])
def list_patents(db: Session = Depends(get_db), status_: str | None = Query(None, alias="status")):
    stmt = select(Patent)
    if status_:
        stmt = stmt.where(Patent.status == status_)
    return [_patent_out(db, p) for p in db.scalars(stmt.order_by(Patent.filed_on.desc().nulls_last(), Patent.sort_order)).all()]


@router.post("/patents", response_model=PatentOut, status_code=status.HTTP_201_CREATED, dependencies=_write("research.publications"))
def create_patent(body: PatentIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = Patent(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="patent.create", entity_type="patent", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _patent_out(db, obj)


@router.patch("/patents/{pid}", response_model=PatentOut, dependencies=_write("research.publications"))
def update_patent(pid: int, body: PatentIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Patent, pid)
    if not obj:
        raise NotFoundError("Patent not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="patent.update", entity_type="patent", entity_id=pid, ip=request.client.host if request.client else None)
    return _patent_out(db, obj)


@router.delete("/patents/{pid}", status_code=204, dependencies=_write("research.publications"))
def delete_patent(pid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Patent, pid)
    if not obj:
        raise NotFoundError("Patent not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="patent.delete", entity_type="patent", entity_id=pid, ip=request.client.host if request.client else None)


# ── Journal issues ───────────────────────────────────────────────────


def _journal_out(db: Session, j: JournalIssue) -> JournalIssueOut:
    return JournalIssueOut(
        **{c.name: getattr(j, c.name) for c in j.__table__.columns},
        resolved_cover_url=_media(db, j.cover_id) or j.cover_url,
        resolved_pdf_url=_media(db, j.pdf_id) or j.pdf_url,
    )


@router.get("/journal", response_model=list[JournalIssueOut], dependencies=[_read_dep()])
def list_journal(db: Session = Depends(get_db), year: int | None = Query(None)):
    stmt = select(JournalIssue)
    if year:
        stmt = stmt.where(JournalIssue.year == year)
    return [_journal_out(db, j) for j in db.scalars(stmt.order_by(JournalIssue.year.desc(), JournalIssue.sort_order)).all()]


@router.post("/journal", response_model=JournalIssueOut, status_code=status.HTTP_201_CREATED, dependencies=_write("research.journal"))
def create_journal(body: JournalIssueIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = JournalIssue(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="journal.create", entity_type="journal", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _journal_out(db, obj)


@router.patch("/journal/{jid}", response_model=JournalIssueOut, dependencies=_write("research.journal"))
def update_journal(jid: int, body: JournalIssueIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(JournalIssue, jid)
    if not obj:
        raise NotFoundError("Journal issue not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="journal.update", entity_type="journal", entity_id=jid, ip=request.client.host if request.client else None)
    return _journal_out(db, obj)


@router.delete("/journal/{jid}", status_code=204, dependencies=_write("research.journal"))
def delete_journal(jid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(JournalIssue, jid)
    if not obj:
        raise NotFoundError("Journal issue not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="journal.delete", entity_type="journal", entity_id=jid, ip=request.client.host if request.client else None)


# ── Conferences + papers ─────────────────────────────────────────────


def _paper_out(db: Session, p: ConferencePaper) -> ConferencePaperOut:
    return ConferencePaperOut(**{c.name: getattr(p, c.name) for c in p.__table__.columns}, resolved_pdf_url=_media(db, p.pdf_id) or p.pdf_url)


def _conf_out(db: Session, c: Conference) -> ConferenceOut:
    base = {col.name: getattr(c, col.name) for col in c.__table__.columns}
    return ConferenceOut(
        **base,
        resolved_banner_url=_media(db, c.banner_id) or c.banner_url,
        resolved_brochure_url=_media(db, c.brochure_id) or c.brochure_url,
        resolved_proceedings_url=_media(db, c.proceedings_id) or c.proceedings_url,
        papers=[_paper_out(db, p) for p in c.papers],
    )


@router.get("/conferences", response_model=list[ConferenceOut], dependencies=[_read_dep()])
def list_conferences(db: Session = Depends(get_db), status_: str | None = Query(None, alias="status")):
    stmt = select(Conference)
    if status_:
        stmt = stmt.where(Conference.status == status_)
    return [_conf_out(db, c) for c in db.scalars(stmt.order_by(Conference.year.desc(), Conference.sort_order)).all()]


@router.post("/conferences", response_model=ConferenceOut, status_code=status.HTTP_201_CREATED, dependencies=_write("research.conference"))
def create_conference(body: ConferenceIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = Conference(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="conference.create", entity_type="conference", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _conf_out(db, obj)


@router.patch("/conferences/{cid}", response_model=ConferenceOut, dependencies=_write("research.conference"))
def update_conference(cid: int, body: ConferenceIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Conference, cid)
    if not obj:
        raise NotFoundError("Conference not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="conference.update", entity_type="conference", entity_id=cid, ip=request.client.host if request.client else None)
    return _conf_out(db, obj)


@router.delete("/conferences/{cid}", status_code=204, dependencies=_write("research.conference"))
def delete_conference(cid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Conference, cid)
    if not obj:
        raise NotFoundError("Conference not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="conference.delete", entity_type="conference", entity_id=cid, ip=request.client.host if request.client else None)


@router.post("/conferences/{cid}/papers", response_model=ConferencePaperOut, status_code=status.HTTP_201_CREATED, dependencies=_write("research.conference"))
def create_paper(cid: int, body: ConferencePaperIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    conf = db.get(Conference, cid)
    if not conf:
        raise NotFoundError("Conference not found")
    obj = ConferencePaper(conference_id=cid, **body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="paper.create", entity_type="paper", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _paper_out(db, obj)


@router.patch("/conferences/{cid}/papers/{pid}", response_model=ConferencePaperOut, dependencies=_write("research.conference"))
def update_paper(cid: int, pid: int, body: ConferencePaperIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(ConferencePaper, pid)
    if not obj or obj.conference_id != cid:
        raise NotFoundError("Paper not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="paper.update", entity_type="paper", entity_id=pid, ip=request.client.host if request.client else None)
    return _paper_out(db, obj)


@router.delete("/conferences/{cid}/papers/{pid}", status_code=204, dependencies=_write("research.conference"))
def delete_paper(cid: int, pid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(ConferencePaper, pid)
    if not obj or obj.conference_id != cid:
        raise NotFoundError("Paper not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="paper.delete", entity_type="paper", entity_id=pid, ip=request.client.host if request.client else None)


# ── FDPs + sessions ──────────────────────────────────────────────────


def _session_out(s: FdpSession) -> FdpSessionOut:
    return FdpSessionOut.model_validate(s)


def _fdp_out(db: Session, f: Fdp) -> FdpOut:
    base = {col.name: getattr(f, col.name) for col in f.__table__.columns}
    return FdpOut(
        **base,
        resolved_banner_url=_media(db, f.banner_id) or f.banner_url,
        resolved_brochure_url=_media(db, f.brochure_id) or f.brochure_url,
        sessions=[_session_out(s) for s in f.sessions],
    )


@router.get("/fdps", response_model=list[FdpOut], dependencies=[_read_dep()])
def list_fdps(db: Session = Depends(get_db), status_: str | None = Query(None, alias="status")):
    stmt = select(Fdp)
    if status_:
        stmt = stmt.where(Fdp.status == status_)
    return [_fdp_out(db, f) for f in db.scalars(stmt.order_by(Fdp.start_date.desc().nulls_last(), Fdp.sort_order)).all()]


@router.post("/fdps", response_model=FdpOut, status_code=status.HTTP_201_CREATED, dependencies=_write("research.fdp"))
def create_fdp(body: FdpIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = Fdp(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="fdp.create", entity_type="fdp", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _fdp_out(db, obj)


@router.patch("/fdps/{fid}", response_model=FdpOut, dependencies=_write("research.fdp"))
def update_fdp(fid: int, body: FdpIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Fdp, fid)
    if not obj:
        raise NotFoundError("FDP not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="fdp.update", entity_type="fdp", entity_id=fid, ip=request.client.host if request.client else None)
    return _fdp_out(db, obj)


@router.delete("/fdps/{fid}", status_code=204, dependencies=_write("research.fdp"))
def delete_fdp(fid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(Fdp, fid)
    if not obj:
        raise NotFoundError("FDP not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="fdp.delete", entity_type="fdp", entity_id=fid, ip=request.client.host if request.client else None)


@router.post("/fdps/{fid}/sessions", response_model=FdpSessionOut, status_code=status.HTTP_201_CREATED, dependencies=_write("research.fdp"))
def create_session(fid: int, body: FdpSessionIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    fdp = db.get(Fdp, fid)
    if not fdp:
        raise NotFoundError("FDP not found")
    obj = FdpSession(fdp_id=fid, **body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="fdp_session.create", entity_type="fdp_session", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _session_out(obj)


@router.patch("/fdps/{fid}/sessions/{sid}", response_model=FdpSessionOut, dependencies=_write("research.fdp"))
def update_session(fid: int, sid: int, body: FdpSessionIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(FdpSession, sid)
    if not obj or obj.fdp_id != fid:
        raise NotFoundError("Session not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="fdp_session.update", entity_type="fdp_session", entity_id=sid, ip=request.client.host if request.client else None)
    return _session_out(obj)


@router.delete("/fdps/{fid}/sessions/{sid}", status_code=204, dependencies=_write("research.fdp"))
def delete_session(fid: int, sid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(FdpSession, sid)
    if not obj or obj.fdp_id != fid:
        raise NotFoundError("Session not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="fdp_session.delete", entity_type="fdp_session", entity_id=sid, ip=request.client.host if request.client else None)


# ── Policy documents (research + compliance share table) ─────────────


def _policy_out(db: Session, p: PolicyDocument) -> PolicyOut:
    return PolicyOut(**{c.name: getattr(p, c.name) for c in p.__table__.columns}, resolved_pdf_url=_media(db, p.pdf_id) or p.pdf_url)


@router.get("/policies", response_model=list[PolicyOut], dependencies=[_read_dep()])
def list_policies(db: Session = Depends(get_db), owner: str | None = Query(None)):
    stmt = select(PolicyDocument)
    if owner:
        stmt = stmt.where(PolicyDocument.owner == owner)
    return [_policy_out(db, p) for p in db.scalars(stmt.order_by(PolicyDocument.sort_order)).all()]


@router.post("/policies", response_model=PolicyOut, status_code=status.HTTP_201_CREATED, dependencies=_write("research.rdcell"))
def create_policy(body: PolicyIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = PolicyDocument(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="policy.create", entity_type="policy", entity_id=obj.id, ip=request.client.host if request.client else None)
    return _policy_out(db, obj)


@router.patch("/policies/{pid}", response_model=PolicyOut, dependencies=_write("research.rdcell"))
def update_policy(pid: int, body: PolicyIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(PolicyDocument, pid)
    if not obj:
        raise NotFoundError("Policy not found")
    for k, v in body.model_dump().items():
        setattr(obj, k, v)
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="policy.update", entity_type="policy", entity_id=pid, ip=request.client.host if request.client else None)
    return _policy_out(db, obj)


@router.delete("/policies/{pid}", status_code=204, dependencies=_write("research.rdcell"))
def delete_policy(pid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(PolicyDocument, pid)
    if not obj:
        raise NotFoundError("Policy not found")
    db.delete(obj); db.commit()
    audit.record(db, user_id=actor.id, action="policy.delete", entity_type="policy", entity_id=pid, ip=request.client.host if request.client else None)
