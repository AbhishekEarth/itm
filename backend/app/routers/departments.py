"""Department + nested resources (HoD / faculty / labs / partners / projects / awards).

Per-department editor scopes (e.g. dept.cse) gate writes. Super-admin and
`site.pages` always pass. Reads are open via /api/public/department/{code}.
"""
from __future__ import annotations

from typing import TypeVar

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import ConflictError, ForbiddenError, NotFoundError
from app.deps import get_current_user, has_any_scope
from app.models import (
    Department,
    Faculty,
    HodProfile,
    IndustryPartner,
    Laboratory,
    MediaAsset,
    StudentAward,
    StudentProject,
    User,
)
from app.schemas.academics import (
    DepartmentCreate,
    DepartmentOut,
    DepartmentSummary,
    DepartmentUpdate,
    FacultyIn,
    FacultyOut,
    HodProfileIn,
    HodProfileOut,
    IndustryPartnerIn,
    IndustryPartnerOut,
    LaboratoryIn,
    LaboratoryOut,
    StudentAwardIn,
    StudentAwardOut,
    StudentProjectIn,
    StudentProjectOut,
)
from app.services import audit

router = APIRouter(prefix="/departments", tags=["departments"])

T = TypeVar("T")

GLOBAL_SCOPES = ("site.pages",)


def _resolve_media_url(db: Session, media_id: int | None) -> str | None:
    if not media_id:
        return None
    a = db.get(MediaAsset, media_id)
    return a.public_url if a and a.is_active else None


def _require_dept_edit(dept: Department, actor: User) -> None:
    """Editor must own the dept's scope, OR have `site.pages`, OR be super-admin."""
    if has_any_scope(actor, GLOBAL_SCOPES):
        return
    if dept.scope_key and has_any_scope(actor, [dept.scope_key]):
        return
    raise ForbiddenError(
        f"Requires {dept.scope_key or 'site.pages'} scope to edit {dept.code}"
    )


def _get_dept_or_404(db: Session, code_or_id: str | int) -> Department:
    dept: Department | None = None
    if isinstance(code_or_id, int) or (isinstance(code_or_id, str) and code_or_id.isdigit()):
        dept = db.get(Department, int(code_or_id))
    if not dept:
        dept = db.scalar(select(Department).where(Department.code == str(code_or_id).upper()))
    if not dept:
        raise NotFoundError(f"Department {code_or_id} not found")
    return dept


def _hod_out(db: Session, hod: HodProfile | None) -> HodProfileOut | None:
    if not hod:
        return None
    return HodProfileOut(
        id=hod.id, department_id=hod.department_id, name=hod.name, role=hod.role,
        qualification=hod.qualification, message_md=hod.message_md, phone=hod.phone,
        email=hod.email, joined_on=hod.joined_on, research_area=hod.research_area,
        photo_id=hod.photo_id, photo_url=_resolve_media_url(db, hod.photo_id),
    )


def _faculty_out(db: Session, f: Faculty) -> FacultyOut:
    return FacultyOut(
        id=f.id, department_id=f.department_id, name=f.name, role=f.role,
        qualification=f.qualification, specialization=f.specialization,
        email=f.email, phone=f.phone, bio_md=f.bio_md, photo_id=f.photo_id,
        google_scholar_url=f.google_scholar_url, orcid=f.orcid,
        employee_no=f.employee_no, is_active=f.is_active, is_highlight=f.is_highlight,
        sort_order=f.sort_order, photo_url=_resolve_media_url(db, f.photo_id),
    )


def _lab_out(db: Session, l: Laboratory) -> LaboratoryOut:
    return LaboratoryOut(
        id=l.id, department_id=l.department_id, name=l.name, icon=l.icon,
        description=l.description, tools=l.tools, photo_id=l.photo_id,
        sort_order=l.sort_order, is_active=l.is_active,
        photo_url=_resolve_media_url(db, l.photo_id),
    )


def _partner_out(db: Session, p: IndustryPartner) -> IndustryPartnerOut:
    return IndustryPartnerOut(
        id=p.id, department_id=p.department_id, name=p.name, category=p.category,
        url=p.url, logo_id=p.logo_id, sort_order=p.sort_order,
        logo_url=_resolve_media_url(db, p.logo_id),
    )


def _project_out(_db: Session, p: StudentProject) -> StudentProjectOut:
    return StudentProjectOut.model_validate(p)


def _award_out(_db: Session, a: StudentAward) -> StudentAwardOut:
    return StudentAwardOut.model_validate(a)


def _dept_out(db: Session, dept: Department) -> DepartmentOut:
    base = {c.name: getattr(dept, c.name) for c in dept.__table__.columns}
    base["image_resolved_url"] = _resolve_media_url(db, dept.image_id) or dept.image_url
    return DepartmentOut(
        **base,
        hod=_hod_out(db, dept.hod),
        faculty=[_faculty_out(db, f) for f in dept.faculty if f.is_active],
        laboratories=[_lab_out(db, l) for l in dept.laboratories if l.is_active],
        industry_partners=[_partner_out(db, p) for p in dept.industry_partners],
        student_projects=[_project_out(p) for p in dept.student_projects],
        student_awards=[_award_out(a) for a in dept.student_awards],
    )


def _dept_summary(db: Session, dept: Department) -> DepartmentSummary:
    return DepartmentSummary(
        id=dept.id,
        code=dept.code,
        name=dept.name,
        short_name=dept.short_name,
        page_path=dept.page_path,
        scope_key=dept.scope_key,
        image_resolved_url=_resolve_media_url(db, dept.image_id) or dept.image_url,
        is_published=dept.is_published,
    )


# ── Listing / detail ────────────────────────────────────────────────


@router.get("", response_model=list[DepartmentSummary], dependencies=[Depends(get_current_user)])
def list_departments(db: Session = Depends(get_db)):
    rows = db.scalars(select(Department).order_by(Department.code)).all()
    return [_dept_summary(db, d) for d in rows]


@router.get("/{code}", response_model=DepartmentOut, dependencies=[Depends(get_current_user)])
def get_department(code: str, db: Session = Depends(get_db)):
    return _dept_out(db, _get_dept_or_404(db, code))


# ── Department-level CRUD (super-admin / site.pages only) ──────────


def _require_site_pages(actor: User) -> None:
    if not has_any_scope(actor, GLOBAL_SCOPES):
        raise ForbiddenError("Requires site.pages scope")


@router.post("", response_model=DepartmentOut, status_code=status.HTTP_201_CREATED)
def create_department(
    body: DepartmentCreate,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    _require_site_pages(actor)
    dept = Department(
        **body.model_dump(),
        created_by_user_id=actor.id,
        updated_by_user_id=actor.id,
    )
    db.add(dept)
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise ConflictError("Department code or slug already exists") from e
    db.refresh(dept)
    audit.record(
        db, user_id=actor.id, action="department.create", entity_type="department",
        entity_id=dept.id, after={"code": dept.code, "name": dept.name},
        ip=request.client.host if request.client else None,
    )
    return _dept_out(db, dept)


@router.patch("/{code}", response_model=DepartmentOut)
def update_department(
    code: str,
    body: DepartmentUpdate,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)

    payload = body.model_dump(exclude_unset=True)
    before = {"name": dept.name, "intro_md": dept.intro_md}
    for k, v in payload.items():
        setattr(dept, k, v)
    dept.updated_by_user_id = actor.id
    db.commit()
    db.refresh(dept)
    audit.record(
        db, user_id=actor.id, action="department.update", entity_type="department",
        entity_id=dept.id, before=before,
        after={"name": dept.name},
        ip=request.client.host if request.client else None,
    )
    return _dept_out(db, dept)


@router.delete("/{code}", status_code=204)
def delete_department(
    code: str,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    _require_site_pages(actor)
    dept = _get_dept_or_404(db, code)
    db.delete(dept)
    db.commit()
    audit.record(
        db, user_id=actor.id, action="department.delete", entity_type="department",
        entity_id=dept.id, ip=request.client.host if request.client else None,
    )


# ── HoD profile ─────────────────────────────────────────────────────


@router.put("/{code}/hod", response_model=HodProfileOut)
def upsert_hod(
    code: str,
    body: HodProfileIn,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    existing = dept.hod
    before = (
        {"name": existing.name, "message_md": existing.message_md} if existing else None
    )
    if existing:
        for k, v in body.model_dump().items():
            setattr(existing, k, v)
        existing.updated_by_user_id = actor.id
    else:
        existing = HodProfile(
            department_id=dept.id,
            **body.model_dump(),
            created_by_user_id=actor.id,
            updated_by_user_id=actor.id,
        )
        db.add(existing)
    db.commit()
    db.refresh(existing)
    audit.record(
        db, user_id=actor.id, action="dept.hod_upsert", entity_type="hod_profile",
        entity_id=existing.id, before=before, after={"name": existing.name},
        ip=request.client.host if request.client else None,
    )
    return _hod_out(db, existing)


@router.delete("/{code}/hod", status_code=204)
def delete_hod(
    code: str,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    if dept.hod:
        db.delete(dept.hod)
        db.commit()
        audit.record(
            db, user_id=actor.id, action="dept.hod_delete", entity_type="hod_profile",
            entity_id=dept.id, ip=request.client.host if request.client else None,
        )


# ── Faculty CRUD ────────────────────────────────────────────────────


@router.get("/{code}/faculty", response_model=list[FacultyOut], dependencies=[Depends(get_current_user)])
def list_faculty(code: str, db: Session = Depends(get_db)):
    dept = _get_dept_or_404(db, code)
    return [_faculty_out(db, f) for f in dept.faculty]


@router.post("/{code}/faculty", response_model=FacultyOut, status_code=status.HTTP_201_CREATED)
def create_faculty(
    code: str,
    body: FacultyIn,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    f = Faculty(
        department_id=dept.id,
        **body.model_dump(),
        created_by_user_id=actor.id,
        updated_by_user_id=actor.id,
    )
    db.add(f)
    db.commit()
    db.refresh(f)
    audit.record(
        db, user_id=actor.id, action="faculty.create", entity_type="faculty",
        entity_id=f.id, after={"name": f.name, "dept": dept.code},
        ip=request.client.host if request.client else None,
    )
    return _faculty_out(db, f)


@router.patch("/{code}/faculty/{faculty_id}", response_model=FacultyOut)
def update_faculty(
    code: str,
    faculty_id: int,
    body: FacultyIn,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    f = db.get(Faculty, faculty_id)
    if not f or f.department_id != dept.id:
        raise NotFoundError("Faculty not found in this department")
    before = {"name": f.name, "role": f.role}
    for k, v in body.model_dump().items():
        setattr(f, k, v)
    f.updated_by_user_id = actor.id
    db.commit()
    db.refresh(f)
    audit.record(
        db, user_id=actor.id, action="faculty.update", entity_type="faculty",
        entity_id=f.id, before=before, after={"name": f.name},
        ip=request.client.host if request.client else None,
    )
    return _faculty_out(db, f)


@router.delete("/{code}/faculty/{faculty_id}", status_code=204)
def delete_faculty(
    code: str,
    faculty_id: int,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    f = db.get(Faculty, faculty_id)
    if not f or f.department_id != dept.id:
        raise NotFoundError("Faculty not found")
    db.delete(f)
    db.commit()
    audit.record(
        db, user_id=actor.id, action="faculty.delete", entity_type="faculty",
        entity_id=faculty_id, ip=request.client.host if request.client else None,
    )


# ── Labs ────────────────────────────────────────────────────────────


@router.get("/{code}/labs", response_model=list[LaboratoryOut], dependencies=[Depends(get_current_user)])
def list_labs(code: str, db: Session = Depends(get_db)):
    return [_lab_out(db, l) for l in _get_dept_or_404(db, code).laboratories]


@router.post("/{code}/labs", response_model=LaboratoryOut, status_code=status.HTTP_201_CREATED)
def create_lab(
    code: str,
    body: LaboratoryIn,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    lab = Laboratory(
        department_id=dept.id, **body.model_dump(),
        created_by_user_id=actor.id, updated_by_user_id=actor.id,
    )
    db.add(lab); db.commit(); db.refresh(lab)
    audit.record(db, user_id=actor.id, action="lab.create", entity_type="lab",
                 entity_id=lab.id, after={"dept": dept.code, "name": lab.name},
                 ip=request.client.host if request.client else None)
    return _lab_out(db, lab)


@router.patch("/{code}/labs/{lab_id}", response_model=LaboratoryOut)
def update_lab(
    code: str, lab_id: int, body: LaboratoryIn, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    lab = db.get(Laboratory, lab_id)
    if not lab or lab.department_id != dept.id:
        raise NotFoundError("Lab not found in this department")
    for k, v in body.model_dump().items():
        setattr(lab, k, v)
    lab.updated_by_user_id = actor.id
    db.commit(); db.refresh(lab)
    audit.record(db, user_id=actor.id, action="lab.update", entity_type="lab",
                 entity_id=lab.id, ip=request.client.host if request.client else None)
    return _lab_out(db, lab)


@router.delete("/{code}/labs/{lab_id}", status_code=204)
def delete_lab(
    code: str, lab_id: int, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    lab = db.get(Laboratory, lab_id)
    if not lab or lab.department_id != dept.id:
        raise NotFoundError("Lab not found")
    db.delete(lab); db.commit()
    audit.record(db, user_id=actor.id, action="lab.delete", entity_type="lab",
                 entity_id=lab_id, ip=request.client.host if request.client else None)


# ── Industry Partners ───────────────────────────────────────────────


@router.get("/{code}/partners", response_model=list[IndustryPartnerOut], dependencies=[Depends(get_current_user)])
def list_partners(code: str, db: Session = Depends(get_db)):
    return [_partner_out(db, p) for p in _get_dept_or_404(db, code).industry_partners]


@router.post("/{code}/partners", response_model=IndustryPartnerOut, status_code=status.HTTP_201_CREATED)
def create_partner(
    code: str, body: IndustryPartnerIn, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    p = IndustryPartner(
        department_id=dept.id, **body.model_dump(),
        created_by_user_id=actor.id, updated_by_user_id=actor.id,
    )
    db.add(p); db.commit(); db.refresh(p)
    audit.record(db, user_id=actor.id, action="partner.create", entity_type="partner",
                 entity_id=p.id, after={"dept": dept.code, "name": p.name},
                 ip=request.client.host if request.client else None)
    return _partner_out(db, p)


@router.patch("/{code}/partners/{partner_id}", response_model=IndustryPartnerOut)
def update_partner(
    code: str, partner_id: int, body: IndustryPartnerIn, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    p = db.get(IndustryPartner, partner_id)
    if not p or p.department_id != dept.id:
        raise NotFoundError("Partner not found in this department")
    for k, v in body.model_dump().items():
        setattr(p, k, v)
    p.updated_by_user_id = actor.id
    db.commit(); db.refresh(p)
    audit.record(db, user_id=actor.id, action="partner.update", entity_type="partner",
                 entity_id=p.id, ip=request.client.host if request.client else None)
    return _partner_out(db, p)


@router.delete("/{code}/partners/{partner_id}", status_code=204)
def delete_partner(
    code: str, partner_id: int, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    p = db.get(IndustryPartner, partner_id)
    if not p or p.department_id != dept.id:
        raise NotFoundError("Partner not found")
    db.delete(p); db.commit()
    audit.record(db, user_id=actor.id, action="partner.delete", entity_type="partner",
                 entity_id=partner_id, ip=request.client.host if request.client else None)


# ── Student Projects ────────────────────────────────────────────────


@router.get("/{code}/projects", response_model=list[StudentProjectOut], dependencies=[Depends(get_current_user)])
def list_projects(code: str, db: Session = Depends(get_db)):
    return [_project_out(db, p) for p in _get_dept_or_404(db, code).student_projects]


@router.post("/{code}/projects", response_model=StudentProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    code: str, body: StudentProjectIn, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    p = StudentProject(
        department_id=dept.id, **body.model_dump(),
        created_by_user_id=actor.id, updated_by_user_id=actor.id,
    )
    db.add(p); db.commit(); db.refresh(p)
    audit.record(db, user_id=actor.id, action="project.create", entity_type="project",
                 entity_id=p.id, after={"dept": dept.code, "title": p.title},
                 ip=request.client.host if request.client else None)
    return _project_out(db, p)


@router.patch("/{code}/projects/{project_id}", response_model=StudentProjectOut)
def update_project(
    code: str, project_id: int, body: StudentProjectIn, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    p = db.get(StudentProject, project_id)
    if not p or p.department_id != dept.id:
        raise NotFoundError("Project not found in this department")
    for k, v in body.model_dump().items():
        setattr(p, k, v)
    p.updated_by_user_id = actor.id
    db.commit(); db.refresh(p)
    audit.record(db, user_id=actor.id, action="project.update", entity_type="project",
                 entity_id=p.id, ip=request.client.host if request.client else None)
    return _project_out(db, p)


@router.delete("/{code}/projects/{project_id}", status_code=204)
def delete_project(
    code: str, project_id: int, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    p = db.get(StudentProject, project_id)
    if not p or p.department_id != dept.id:
        raise NotFoundError("Project not found")
    db.delete(p); db.commit()
    audit.record(db, user_id=actor.id, action="project.delete", entity_type="project",
                 entity_id=project_id, ip=request.client.host if request.client else None)


# ── Student Awards ──────────────────────────────────────────────────


@router.get("/{code}/awards", response_model=list[StudentAwardOut], dependencies=[Depends(get_current_user)])
def list_awards(code: str, db: Session = Depends(get_db)):
    return [_award_out(db, a) for a in _get_dept_or_404(db, code).student_awards]


@router.post("/{code}/awards", response_model=StudentAwardOut, status_code=status.HTTP_201_CREATED)
def create_award(
    code: str, body: StudentAwardIn, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    a = StudentAward(
        department_id=dept.id, **body.model_dump(),
        created_by_user_id=actor.id, updated_by_user_id=actor.id,
    )
    db.add(a); db.commit(); db.refresh(a)
    audit.record(db, user_id=actor.id, action="award.create", entity_type="award",
                 entity_id=a.id, after={"dept": dept.code, "student": a.student_name},
                 ip=request.client.host if request.client else None)
    return _award_out(db, a)


@router.patch("/{code}/awards/{award_id}", response_model=StudentAwardOut)
def update_award(
    code: str, award_id: int, body: StudentAwardIn, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    a = db.get(StudentAward, award_id)
    if not a or a.department_id != dept.id:
        raise NotFoundError("Award not found in this department")
    for k, v in body.model_dump().items():
        setattr(a, k, v)
    a.updated_by_user_id = actor.id
    db.commit(); db.refresh(a)
    audit.record(db, user_id=actor.id, action="award.update", entity_type="award",
                 entity_id=a.id, ip=request.client.host if request.client else None)
    return _award_out(db, a)


@router.delete("/{code}/awards/{award_id}", status_code=204)
def delete_award(
    code: str, award_id: int, request: Request,
    db: Session = Depends(get_db), actor: User = Depends(get_current_user),
):
    dept = _get_dept_or_404(db, code)
    _require_dept_edit(dept, actor)
    a = db.get(StudentAward, award_id)
    if not a or a.department_id != dept.id:
        raise NotFoundError("Award not found")
    db.delete(a); db.commit()
    audit.record(db, user_id=actor.id, action="award.delete", entity_type="award",
                 entity_id=award_id, ip=request.client.host if request.client else None)
