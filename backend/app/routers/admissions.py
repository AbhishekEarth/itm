"""Admissions + Forms + Careers.

Scopes:
  - admissions.content : edit steps/docs/counsellors/fees/quotas/faqs/timeline
  - admissions.leads   : read & manage inquiry inbox (public can POST without auth)
  - forms.contact      : read contact submissions
  - forms.grievance    : read grievance submissions
  - careers.positions  : create / update / close open positions
  - careers.applications : read & triage job applications
  - careers.jrf        : manage JRF postings
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import NotFoundError
from app.deps import get_current_user, require
from app.models import (
    AdmissionCounsellor,
    AdmissionFAQ,
    AdmissionLead,
    AdmissionStep,
    AdmissionTimeline,
    ContactSubmission,
    FeeComponent,
    JobApplication,
    JrfPosting,
    MediaAsset,
    OpenPosition,
    Quota,
    RequiredDocument,
    Setting,
    User,
)
from app.schemas.admissions import (
    AdmissionLeadCreate,
    AdmissionLeadOut,
    AdmissionStepIn,
    AdmissionStepOut,
    ContactSubmissionCreate,
    ContactSubmissionOut,
    CounsellorIn,
    CounsellorOut,
    FAQIn,
    FAQOut,
    FeeComponentIn,
    FeeComponentOut,
    JobApplicationCreate,
    JobApplicationOut,
    JobApplicationStatus,
    JrfPostingIn,
    JrfPostingOut,
    LeadStatusUpdate,
    OpenPositionIn,
    OpenPositionOut,
    QuotaIn,
    QuotaOut,
    RequiredDocumentIn,
    RequiredDocumentOut,
    TimelineIn,
    TimelineOut,
)
from app.services import audit
from app.services.mailer import send_email

router = APIRouter(tags=["admissions+forms+careers"])

CONTENT = [Depends(require("admissions.content"))]
LEADS = [Depends(require("admissions.leads"))]
CONTACT = [Depends(require("forms.contact"))]
GRIEVANCE = [Depends(require("forms.grievance"))]
CAREERS_POS = [Depends(require("careers.positions"))]
CAREERS_APP = [Depends(require("careers.applications"))]
CAREERS_JRF = [Depends(require("careers.jrf"))]


def _media(db: Session, mid: int | None) -> str | None:
    if not mid:
        return None
    a = db.get(MediaAsset, mid)
    return a.public_url if a and a.is_active else None


# ── Admission CONTENT (admin) ────────────────────────────────────────
adm = APIRouter(prefix="/admissions", tags=["admissions"])


def _crud(prefix: str, model, schema_in, schema_out, audit_kind: str, scope_deps: list, mapper=None):
    @adm.get(f"/{prefix}", response_model=list[schema_out], dependencies=[Depends(get_current_user)])
    def list_items(db: Session = Depends(get_db)):
        rows = db.scalars(select(model).order_by(model.sort_order if hasattr(model, "sort_order") else model.id)).all()
        return [mapper(db, r) if mapper else r for r in rows]

    @adm.post(f"/{prefix}", response_model=schema_out, status_code=status.HTTP_201_CREATED, dependencies=scope_deps)
    def create_item(body: schema_in, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
        obj = model(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
        db.add(obj); db.commit(); db.refresh(obj)
        audit.record(db, user_id=actor.id, action=f"{audit_kind}.create", entity_type=audit_kind, entity_id=obj.id,
                     ip=request.client.host if request.client else None)
        return mapper(db, obj) if mapper else obj

    @adm.patch(f"/{prefix}/{{oid}}", response_model=schema_out, dependencies=scope_deps)
    def update_item(oid: int, body: schema_in, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
        obj = db.get(model, oid)
        if not obj:
            raise NotFoundError(f"{audit_kind} not found")
        for k, v in body.model_dump().items():
            setattr(obj, k, v)
        obj.updated_by_user_id = actor.id
        db.commit(); db.refresh(obj)
        audit.record(db, user_id=actor.id, action=f"{audit_kind}.update", entity_type=audit_kind, entity_id=oid,
                     ip=request.client.host if request.client else None)
        return mapper(db, obj) if mapper else obj

    @adm.delete(f"/{prefix}/{{oid}}", status_code=204, dependencies=scope_deps)
    def delete_item(oid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
        obj = db.get(model, oid)
        if not obj:
            raise NotFoundError(f"{audit_kind} not found")
        db.delete(obj); db.commit()
        audit.record(db, user_id=actor.id, action=f"{audit_kind}.delete", entity_type=audit_kind, entity_id=oid,
                     ip=request.client.host if request.client else None)


# We deliberately call _crud one-at-a-time with literal types — avoids the
# closure/__future__.annotations bug we hit in Phase 3.
def _counsellor_out(db: Session, c: AdmissionCounsellor) -> CounsellorOut:
    base = {col.name: getattr(c, col.name) for col in c.__table__.columns if col.name in CounsellorIn.model_fields}
    return CounsellorOut(**base, id=c.id, photo_url=_media(db, c.photo_id))


# steps
@adm.get("/steps", response_model=list[AdmissionStepOut], dependencies=[Depends(get_current_user)])
def list_steps(db: Session = Depends(get_db)):
    return db.scalars(select(AdmissionStep).order_by(AdmissionStep.position)).all()


@adm.post("/steps", response_model=AdmissionStepOut, status_code=201, dependencies=CONTENT)
def create_step(body: AdmissionStepIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = AdmissionStep(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    audit.record(db, user_id=actor.id, action="adm_step.create", entity_type="admission_step", entity_id=o.id,
                 ip=request.client.host if request.client else None)
    return o


@adm.patch("/steps/{oid}", response_model=AdmissionStepOut, dependencies=CONTENT)
def update_step(oid: int, body: AdmissionStepIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(AdmissionStep, oid)
    if not o:
        raise NotFoundError("Step not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    audit.record(db, user_id=actor.id, action="adm_step.update", entity_type="admission_step", entity_id=oid,
                 ip=request.client.host if request.client else None)
    return o


@adm.delete("/steps/{oid}", status_code=204, dependencies=CONTENT)
def delete_step(oid: int, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(AdmissionStep, oid)
    if not o:
        raise NotFoundError("Step not found")
    db.delete(o); db.commit()
    audit.record(db, user_id=actor.id, action="adm_step.delete", entity_type="admission_step", entity_id=oid,
                 ip=request.client.host if request.client else None)


# documents
@adm.get("/documents", response_model=list[RequiredDocumentOut], dependencies=[Depends(get_current_user)])
def list_documents(db: Session = Depends(get_db)):
    return db.scalars(select(RequiredDocument).order_by(RequiredDocument.sort_order)).all()


@adm.post("/documents", response_model=RequiredDocumentOut, status_code=201, dependencies=CONTENT)
def create_document(body: RequiredDocumentIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = RequiredDocument(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    audit.record(db, user_id=actor.id, action="adm_doc.create", entity_type="required_document", entity_id=o.id,
                 ip=request.client.host if request.client else None)
    return o


@adm.patch("/documents/{oid}", response_model=RequiredDocumentOut, dependencies=CONTENT)
def update_document(oid: int, body: RequiredDocumentIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(RequiredDocument, oid)
    if not o:
        raise NotFoundError("Document not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return o


@adm.delete("/documents/{oid}", status_code=204, dependencies=CONTENT)
def delete_document(oid: int, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(RequiredDocument, oid)
    if not o:
        raise NotFoundError("Document not found")
    db.delete(o); db.commit()


# counsellors
@adm.get("/counsellors", response_model=list[CounsellorOut], dependencies=[Depends(get_current_user)])
def list_counsellors(db: Session = Depends(get_db)):
    return [_counsellor_out(db, c) for c in db.scalars(select(AdmissionCounsellor).order_by(AdmissionCounsellor.sort_order)).all()]


@adm.post("/counsellors", response_model=CounsellorOut, status_code=201, dependencies=CONTENT)
def create_counsellor(body: CounsellorIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = AdmissionCounsellor(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return _counsellor_out(db, o)


@adm.patch("/counsellors/{oid}", response_model=CounsellorOut, dependencies=CONTENT)
def update_counsellor(oid: int, body: CounsellorIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(AdmissionCounsellor, oid)
    if not o:
        raise NotFoundError("Counsellor not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return _counsellor_out(db, o)


@adm.delete("/counsellors/{oid}", status_code=204, dependencies=CONTENT)
def delete_counsellor(oid: int, db: Session = Depends(get_db)):
    o = db.get(AdmissionCounsellor, oid)
    if not o:
        raise NotFoundError("Counsellor not found")
    db.delete(o); db.commit()


# fees
@adm.get("/fees", response_model=list[FeeComponentOut], dependencies=[Depends(get_current_user)])
def list_fees(db: Session = Depends(get_db)):
    return db.scalars(select(FeeComponent).order_by(FeeComponent.sort_order)).all()


@adm.post("/fees", response_model=FeeComponentOut, status_code=201, dependencies=CONTENT)
def create_fee(body: FeeComponentIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = FeeComponent(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return o


@adm.patch("/fees/{oid}", response_model=FeeComponentOut, dependencies=CONTENT)
def update_fee(oid: int, body: FeeComponentIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(FeeComponent, oid)
    if not o:
        raise NotFoundError("Fee not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return o


@adm.delete("/fees/{oid}", status_code=204, dependencies=CONTENT)
def delete_fee(oid: int, db: Session = Depends(get_db)):
    o = db.get(FeeComponent, oid)
    if not o:
        raise NotFoundError("Fee not found")
    db.delete(o); db.commit()


# quotas
@adm.get("/quotas", response_model=list[QuotaOut], dependencies=[Depends(get_current_user)])
def list_quotas(db: Session = Depends(get_db)):
    return db.scalars(select(Quota).order_by(Quota.sort_order)).all()


@adm.post("/quotas", response_model=QuotaOut, status_code=201, dependencies=CONTENT)
def create_quota(body: QuotaIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = Quota(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return o


@adm.patch("/quotas/{oid}", response_model=QuotaOut, dependencies=CONTENT)
def update_quota(oid: int, body: QuotaIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(Quota, oid)
    if not o:
        raise NotFoundError("Quota not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return o


@adm.delete("/quotas/{oid}", status_code=204, dependencies=CONTENT)
def delete_quota(oid: int, db: Session = Depends(get_db)):
    o = db.get(Quota, oid)
    if not o:
        raise NotFoundError("Quota not found")
    db.delete(o); db.commit()


# faqs
@adm.get("/faqs", response_model=list[FAQOut], dependencies=[Depends(get_current_user)])
def list_faqs(db: Session = Depends(get_db), category: str | None = Query(None)):
    stmt = select(AdmissionFAQ)
    if category:
        stmt = stmt.where(AdmissionFAQ.category == category)
    return db.scalars(stmt.order_by(AdmissionFAQ.sort_order)).all()


@adm.post("/faqs", response_model=FAQOut, status_code=201, dependencies=CONTENT)
def create_faq(body: FAQIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = AdmissionFAQ(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return o


@adm.patch("/faqs/{oid}", response_model=FAQOut, dependencies=CONTENT)
def update_faq(oid: int, body: FAQIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(AdmissionFAQ, oid)
    if not o:
        raise NotFoundError("FAQ not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return o


@adm.delete("/faqs/{oid}", status_code=204, dependencies=CONTENT)
def delete_faq(oid: int, db: Session = Depends(get_db)):
    o = db.get(AdmissionFAQ, oid)
    if not o:
        raise NotFoundError("FAQ not found")
    db.delete(o); db.commit()


# timeline
@adm.get("/timeline", response_model=list[TimelineOut], dependencies=[Depends(get_current_user)])
def list_timeline(db: Session = Depends(get_db), year: int | None = Query(None)):
    stmt = select(AdmissionTimeline)
    if year:
        stmt = stmt.where(AdmissionTimeline.year == year)
    return db.scalars(stmt.order_by(AdmissionTimeline.year.desc(), AdmissionTimeline.sort_order)).all()


@adm.post("/timeline", response_model=TimelineOut, status_code=201, dependencies=CONTENT)
def create_timeline(body: TimelineIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = AdmissionTimeline(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return o


@adm.patch("/timeline/{oid}", response_model=TimelineOut, dependencies=CONTENT)
def update_timeline(oid: int, body: TimelineIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(AdmissionTimeline, oid)
    if not o:
        raise NotFoundError("Timeline not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return o


@adm.delete("/timeline/{oid}", status_code=204, dependencies=CONTENT)
def delete_timeline(oid: int, db: Session = Depends(get_db)):
    o = db.get(AdmissionTimeline, oid)
    if not o:
        raise NotFoundError("Timeline not found")
    db.delete(o); db.commit()


# ── Admission LEADS (inbox + public submission) ─────────────────────


@adm.post("/leads", response_model=AdmissionLeadOut, status_code=201)
def create_lead(body: AdmissionLeadCreate, request: Request, db: Session = Depends(get_db)):
    """Public form submission — no auth required."""
    obj = AdmissionLead(
        **body.model_dump(),
        ip=request.client.host if request.client else None,
        user_agent=(request.headers.get("User-Agent") or "")[:255],
    )
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=None, action="admission_lead.create", entity_type="admission_lead", entity_id=obj.id,
                 after={"email": obj.email, "programme": obj.programme_interest},
                 ip=request.client.host if request.client else None)

    # Notify admissions counsellors (best-effort).
    to_addrs = [s.value for s in db.scalars(
        select(Setting).where(Setting.key == "admissions.notify_email")
    ).all() if isinstance(s.value, str)]
    if not to_addrs:
        # fallback: first available counsellor with email
        c = db.scalar(select(AdmissionCounsellor).where(AdmissionCounsellor.email.is_not(None)))
        if c:
            to_addrs = [c.email]
    if to_addrs:
        send_email(
            to=to_addrs,
            subject=f"New admissions inquiry — {obj.name}",
            body=(
                f"A new admissions inquiry has been submitted.\n\n"
                f"Name: {obj.name}\nEmail: {obj.email}\nPhone: {obj.phone}\n"
                f"Programme of interest: {obj.programme_interest}\nCity: {obj.city}\n\n"
                f"Message:\n{obj.message or '(none)'}\n\n"
                f"— ITM Gwalior website"
            ),
        )
    return obj


@adm.get("/leads", response_model=list[AdmissionLeadOut], dependencies=LEADS)
def list_leads(
    db: Session = Depends(get_db),
    status_: str | None = Query(None, alias="status"),
    limit: int = Query(200, ge=1, le=1000),
):
    stmt = select(AdmissionLead)
    if status_:
        stmt = stmt.where(AdmissionLead.status == status_)
    return db.scalars(stmt.order_by(AdmissionLead.created_at.desc()).limit(limit)).all()


@adm.patch("/leads/{lid}", response_model=AdmissionLeadOut, dependencies=LEADS)
def update_lead(lid: int, body: LeadStatusUpdate, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(AdmissionLead, lid)
    if not obj:
        raise NotFoundError("Lead not found")
    before = {"status": obj.status, "assigned_to_user_id": obj.assigned_to_user_id}
    obj.status = body.status
    if body.assigned_to_user_id is not None:
        obj.assigned_to_user_id = body.assigned_to_user_id
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="admission_lead.update", entity_type="admission_lead", entity_id=lid,
                 before=before, after={"status": obj.status, "assigned_to_user_id": obj.assigned_to_user_id},
                 ip=request.client.host if request.client else None)
    return obj


@adm.delete("/leads/{lid}", status_code=204, dependencies=LEADS)
def delete_lead(lid: int, db: Session = Depends(get_db)):
    obj = db.get(AdmissionLead, lid)
    if not obj:
        raise NotFoundError("Lead not found")
    db.delete(obj); db.commit()


router.include_router(adm)


# ── Forms (contact + grievance + gallery_submission) ────────────────


forms_r = APIRouter(prefix="/forms", tags=["forms"])


@forms_r.post("/submit", response_model=ContactSubmissionOut, status_code=201)
def submit_form(body: ContactSubmissionCreate, request: Request, db: Session = Depends(get_db)):
    """Public submission for general/grievance/info/gallery_submission etc. No auth."""
    obj = ContactSubmission(
        **body.model_dump(),
        ip=request.client.host if request.client else None,
    )
    db.add(obj); db.commit(); db.refresh(obj)
    audit.record(db, user_id=None, action=f"form.{obj.kind}.create", entity_type="contact_submission",
                 entity_id=obj.id, ip=request.client.host if request.client else None)

    notify_key = f"forms.{obj.kind}.notify_email"
    s = db.scalar(select(Setting).where(Setting.key == notify_key))
    if s and isinstance(s.value, str):
        send_email(
            to=s.value,
            subject=f"[ITM website] New {obj.kind} submission — {obj.subject or obj.name}",
            body=f"From: {obj.name} <{obj.email}> ({obj.phone or 'no phone'})\n\n{obj.message}",
        )
    return obj


def _scope_for_kind(kind: str) -> list:
    return GRIEVANCE if kind == "grievance" else CONTACT


@forms_r.get("/submissions", response_model=list[ContactSubmissionOut], dependencies=[Depends(get_current_user)])
def list_submissions(
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
    kind: str | None = Query(None),
    status_: str | None = Query(None, alias="status"),
    limit: int = Query(200, ge=1, le=1000),
):
    # Permission check: must have at least one of forms.contact / forms.grievance / super_admin
    from app.deps import has_any_scope
    if not has_any_scope(actor, ("forms.contact", "forms.grievance")):
        from app.core.errors import ForbiddenError as _Fb
        raise _Fb("Requires forms.contact or forms.grievance scope")

    stmt = select(ContactSubmission)
    if kind:
        stmt = stmt.where(ContactSubmission.kind == kind)
    if status_:
        stmt = stmt.where(ContactSubmission.status == status_)
    return db.scalars(stmt.order_by(ContactSubmission.created_at.desc()).limit(limit)).all()


@forms_r.patch("/submissions/{sid}", response_model=ContactSubmissionOut)
def update_submission(sid: int, body: LeadStatusUpdate, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    obj = db.get(ContactSubmission, sid)
    if not obj:
        raise NotFoundError("Submission not found")
    from app.deps import has_any_scope
    needed = ("forms.grievance",) if obj.kind == "grievance" else ("forms.contact",)
    if not has_any_scope(actor, needed):
        from app.core.errors import ForbiddenError as _Fb
        raise _Fb(f"Requires {needed[0]} scope")
    obj.status = body.status
    if body.assigned_to_user_id is not None:
        obj.assigned_to_user_id = body.assigned_to_user_id
    obj.updated_by_user_id = actor.id
    db.commit(); db.refresh(obj)
    audit.record(db, user_id=actor.id, action="submission.update", entity_type="contact_submission", entity_id=sid,
                 ip=request.client.host if request.client else None)
    return obj


router.include_router(forms_r)


# ── Careers ──────────────────────────────────────────────────────────


careers_r = APIRouter(prefix="/careers", tags=["careers"])


def _position_out(db: Session, p: OpenPosition) -> OpenPositionOut:
    base = {col.name: getattr(p, col.name) for col in p.__table__.columns if col.name in OpenPositionIn.model_fields}
    return OpenPositionOut(**base, id=p.id, resolved_jd_pdf_url=_media(db, p.jd_pdf_id) or p.jd_pdf_url)


@careers_r.get("/positions", response_model=list[OpenPositionOut], dependencies=[Depends(get_current_user)])
def list_positions(db: Session = Depends(get_db), status_: str | None = Query(None, alias="status")):
    stmt = select(OpenPosition)
    if status_:
        stmt = stmt.where(OpenPosition.status == status_)
    return [_position_out(db, p) for p in db.scalars(stmt.order_by(OpenPosition.sort_order, OpenPosition.deadline.asc().nulls_last())).all()]


@careers_r.post("/positions", response_model=OpenPositionOut, status_code=201, dependencies=CAREERS_POS)
def create_position(body: OpenPositionIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = OpenPosition(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    audit.record(db, user_id=actor.id, action="position.create", entity_type="open_position", entity_id=o.id,
                 after={"title": o.title},
                 ip=request.client.host if request.client else None)
    return _position_out(db, o)


@careers_r.patch("/positions/{pid}", response_model=OpenPositionOut, dependencies=CAREERS_POS)
def update_position(pid: int, body: OpenPositionIn, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(OpenPosition, pid)
    if not o:
        raise NotFoundError("Position not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return _position_out(db, o)


@careers_r.delete("/positions/{pid}", status_code=204, dependencies=CAREERS_POS)
def delete_position(pid: int, db: Session = Depends(get_db)):
    o = db.get(OpenPosition, pid)
    if not o:
        raise NotFoundError("Position not found")
    db.delete(o); db.commit()


@careers_r.post("/applications", response_model=JobApplicationOut, status_code=201)
def apply(body: JobApplicationCreate, request: Request, db: Session = Depends(get_db)):
    """Public submission — no auth."""
    pos = db.get(OpenPosition, body.position_id)
    if not pos or pos.status != "open":
        raise NotFoundError("Position not found or no longer open")
    o = JobApplication(**body.model_dump())
    db.add(o); db.commit(); db.refresh(o)
    audit.record(db, user_id=None, action="job_application.create", entity_type="job_application", entity_id=o.id,
                 after={"position_id": body.position_id, "email": body.email},
                 ip=request.client.host if request.client else None)

    notify = db.scalar(select(Setting).where(Setting.key == "careers.notify_email"))
    if notify and isinstance(notify.value, str):
        send_email(
            to=notify.value,
            subject=f"[Careers] New application — {pos.title}",
            body=f"{o.applicant_name} <{o.email}> applied for {pos.title}\n\n{o.cover_letter_md or ''}",
        )
    return o


@careers_r.get("/applications", response_model=list[JobApplicationOut], dependencies=CAREERS_APP)
def list_applications(db: Session = Depends(get_db), position_id: int | None = Query(None), status_: str | None = Query(None, alias="status")):
    stmt = select(JobApplication)
    if position_id is not None:
        stmt = stmt.where(JobApplication.position_id == position_id)
    if status_:
        stmt = stmt.where(JobApplication.status == status_)
    return db.scalars(stmt.order_by(JobApplication.created_at.desc())).all()


@careers_r.patch("/applications/{aid}", response_model=JobApplicationOut, dependencies=CAREERS_APP)
def update_application(aid: int, body: JobApplicationStatus, request: Request, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(JobApplication, aid)
    if not o:
        raise NotFoundError("Application not found")
    o.status = body.status
    if body.notes is not None:
        o.notes = body.notes
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    audit.record(db, user_id=actor.id, action="job_application.update", entity_type="job_application", entity_id=aid,
                 ip=request.client.host if request.client else None)
    return o


def _jrf_out(db: Session, j: JrfPosting) -> JrfPostingOut:
    base = {col.name: getattr(j, col.name) for col in j.__table__.columns if col.name in JrfPostingIn.model_fields}
    return JrfPostingOut(**base, id=j.id, resolved_jd_pdf_url=_media(db, j.jd_pdf_id) or j.jd_pdf_url)


@careers_r.get("/jrf", response_model=list[JrfPostingOut], dependencies=[Depends(get_current_user)])
def list_jrf(db: Session = Depends(get_db), status_: str | None = Query(None, alias="status")):
    stmt = select(JrfPosting)
    if status_:
        stmt = stmt.where(JrfPosting.status == status_)
    return [_jrf_out(db, j) for j in db.scalars(stmt.order_by(JrfPosting.sort_order)).all()]


@careers_r.post("/jrf", response_model=JrfPostingOut, status_code=201, dependencies=CAREERS_JRF)
def create_jrf(body: JrfPostingIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = JrfPosting(**body.model_dump(), created_by_user_id=actor.id, updated_by_user_id=actor.id)
    db.add(o); db.commit(); db.refresh(o)
    return _jrf_out(db, o)


@careers_r.patch("/jrf/{jid}", response_model=JrfPostingOut, dependencies=CAREERS_JRF)
def update_jrf(jid: int, body: JrfPostingIn, db: Session = Depends(get_db), actor: User = Depends(get_current_user)):
    o = db.get(JrfPosting, jid)
    if not o:
        raise NotFoundError("JRF not found")
    for k, v in body.model_dump().items():
        setattr(o, k, v)
    o.updated_by_user_id = actor.id
    db.commit(); db.refresh(o)
    return _jrf_out(db, o)


@careers_r.delete("/jrf/{jid}", status_code=204, dependencies=CAREERS_JRF)
def delete_jrf(jid: int, db: Session = Depends(get_db)):
    o = db.get(JrfPosting, jid)
    if not o:
        raise NotFoundError("JRF not found")
    db.delete(o); db.commit()


router.include_router(careers_r)
