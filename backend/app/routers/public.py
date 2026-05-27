"""Unauthenticated public-read endpoints consumed by the website."""
from __future__ import annotations

from fastapi import APIRouter, Depends, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.cache import cache
from app.core.database import get_db
from app.core.errors import NotFoundError
from app.models import (
    AdmissionCounsellor,
    AdmissionFAQ,
    AdmissionStep,
    AdmissionTimeline,
    AlumniChapter,
    AlumniMentorship,
    AlumniProfile,
    Announcement,
    BoardMember,
    BookOrChapter,
    ClubCell,
    CommitteeMember,
    Conference,
    Department,
    Event,
    Fdp,
    FeeComponent,
    GalleryCategory,
    GalleryItem,
    JournalIssue,
    JrfPosting,
    MediaAsset,
    MoU,
    NaacDocument,
    NaacGrade,
    NirfRecord,
    Notice,
    Official,
    OpenPosition,
    Page,
    Patent,
    PlacementStatistic,
    PolicyDocument,
    Publication,
    Quota,
    Recruiter,
    RecruiterCategory,
    RecruiterTestimonial,
    RequiredDocument,
    ResearchFocusArea,
    Setting,
    TapEvent,
    TapService,
    TapTeamMember,
    Video,
)

router = APIRouter(prefix="/public", tags=["public"])


def _cache(response: Response, seconds: int = 60) -> None:
    response.headers["Cache-Control"] = f"public, max-age={seconds}"


def _cached(key: str, ttl: int, tags: list[str], compute):
    """Read-through Redis cache. Cheap miss path; safe on Redis failure."""
    hit = cache.get(key)
    if hit is not None:
        return hit
    value = compute()
    cache.set(key, value, ttl=ttl, tags=tags)
    return value


@router.get("/settings")
def public_settings(response: Response, db: Session = Depends(get_db)):
    """Site-wide bag of settings the frontend reads on every page (logo, social, contact, theme)."""
    _cache(response, 60)
    return _cached(
        "public:settings", ttl=300, tags=["public", "settings"],
        compute=lambda: {s.key: s.value for s in db.scalars(select(Setting)).all()},
    )


def _resolve_media_url(db: Session, media_id: int | None) -> str | None:
    if not media_id:
        return None
    asset = db.get(MediaAsset, media_id)
    return asset.public_url if asset and asset.is_active else None


@router.get("/page/{path:path}")
def public_page(path: str, response: Response, db: Session = Depends(get_db)):
    """Returns metadata + active sections for the page at `path`. Path is URL-decoded."""
    if not path.startswith("/"):
        path = "/" + path
    page = db.scalar(select(Page).where(Page.path == path, Page.is_published.is_(True)))
    if not page:
        raise NotFoundError(f"No page at {path}")

    _cache(response, 60)
    sections = {
        s.section_key: {
            "kind": s.kind,
            "label": s.label,
            "position": s.position,
            "payload": s.payload,
        }
        for s in page.sections
        if s.is_active
    }
    return {
        "id": page.id,
        "key": page.key,
        "path": page.path,
        "title": page.title,
        "intro_md": page.intro_md,
        "hero_image_url": _resolve_media_url(db, page.hero_image_id),
        "meta": {
            "title": page.meta_title or page.title,
            "description": page.meta_description,
            "keywords": page.meta_keywords or [],
            "og_image": _resolve_media_url(db, page.og_image_id),
            "canonical_url": page.canonical_url,
            "robots": page.robots,
        },
        "sections": sections,
    }


@router.get("/home")
def public_home(response: Response, db: Session = Depends(get_db)):
    """Convenience alias for the home page."""
    return public_page("/", response, db)


def _media(db: Session, mid: int | None) -> str | None:
    if not mid:
        return None
    a = db.get(MediaAsset, mid)
    return a.public_url if a and a.is_active else None


@router.get("/department/{code}")
def public_department(code: str, response: Response, db: Session = Depends(get_db)):
    """Bundle the dept page needs in one round-trip; shape matches DepartmentTemplate's prop."""
    dept = db.scalar(select(Department).where(Department.code == code.upper()))
    if not dept or not dept.is_published:
        raise NotFoundError(f"Department {code} not found")

    _cache(response, 60)

    image = _media(db, dept.image_id) or dept.image_url

    return {
        "id": dept.code.lower(),
        "code": dept.code,
        "name": dept.name,
        "short": dept.short_name,
        "established": dept.established_year,
        "intake": dept.intake or 0,
        "duration": dept.duration,
        "mtechSince": dept.mtech_since,
        "mtechIntake": dept.mtech_intake,
        "affiliation": dept.affiliation,
        "facultyCount": dept.faculty_count,
        "accent": f"{dept.accent_from or ''} {dept.accent_to or ''}".strip() or None,
        "accentSolid": dept.accent_solid,
        "icon": dept.icon,
        "image": image,
        "badge": dept.badge,
        "subtitle": dept.subtitle,
        "intro": dept.intro_md,
        "chips": dept.chips,
        "accreditations": dept.accreditations,
        "specializations": dept.specializations,
        "features": dept.features,
        "hodHighlights": dept.hod_highlights,
        "software": dept.software,
        "vision": dept.vision,
        "mission": dept.mission,
        "peos": dept.peos,
        "psos": dept.psos,
        "achievements": dept.achievements,
        "subUnits": dept.sub_units,
        "infra": dept.infra,
        "consultancy": dept.consultancy,
        "events": dept.events_list,
        "guestLectures": dept.guest_lectures,
        "industrialVisits": dept.industrial_visits,
        "placement": dept.placement_payload,
        "placementBatches": dept.placement_batches,
        "contact": dept.contact,
        "subPath": dept.page_path,
        "hod": (
            {
                "name": dept.hod.name,
                "role": dept.hod.role,
                "qualification": dept.hod.qualification,
                "message": dept.hod.message_md,
                "phone": dept.hod.phone,
                "email": dept.hod.email,
                "photo": _media(db, dept.hod.photo_id),
            }
            if dept.hod
            else None
        ),
        "facultyHighlights": [
            {
                "name": f.name,
                "role": f.role,
                "qual": f.qualification,
                "photo": _media(db, f.photo_id),
            }
            for f in dept.faculty
            if f.is_active and f.is_highlight
        ],
        "labs": [
            {
                "name": l.name,
                "icon": l.icon,
                "desc": l.description,
                "tools": l.tools,
                "photo": _media(db, l.photo_id),
            }
            for l in dept.laboratories
            if l.is_active
        ],
        "industryPartners": [
            p.name for p in dept.industry_partners if p.category == "industry"
        ],
        "govPartners": [
            p.name for p in dept.industry_partners if p.category in ("govt", "psu")
        ],
        "projects": [
            {"title": p.title, "note": p.note, "year": p.year}
            for p in dept.student_projects
        ],
        "studentAchievements": [
            {"name": a.student_name, "award": a.award, "batch": a.batch}
            for a in dept.student_awards
        ],
        "meta": {
            "title": dept.meta_title or dept.name,
            "description": dept.meta_description,
            "keywords": dept.meta_keywords or [],
            "og_image": _media(db, dept.og_image_id),
            "canonical_url": dept.canonical_url,
            "robots": dept.robots,
        },
    }


@router.get("/recruiters")
def public_recruiters(response: Response, db: Session = Depends(get_db)):
    """Logo marquee bundle — grouped by category."""
    _cache(response, 300)
    cats = db.scalars(select(RecruiterCategory).order_by(RecruiterCategory.sort_order)).all()
    recruiters = db.scalars(
        select(Recruiter).where(Recruiter.is_active.is_(True)).order_by(Recruiter.sort_order, Recruiter.name)
    ).all()
    by_cat: dict[int | None, list] = {}
    for r in recruiters:
        by_cat.setdefault(r.category_id, []).append({
            "id": r.id,
            "name": r.name,
            "logo": _media(db, r.logo_id) or r.logo_url,
            "website": r.website,
            "tier": r.tier,
        })
    return {
        "categories": [
            {
                "id": c.id,
                "key": c.key,
                "name": c.name,
                "recruiters": by_cat.get(c.id, []),
            }
            for c in cats
        ],
        "uncategorized": by_cat.get(None, []),
        "all": [
            {"id": r.id, "name": r.name, "logo": _media(db, r.logo_id) or r.logo_url}
            for r in recruiters
        ],
    }


@router.get("/tap")
def public_tap(response: Response, db: Session = Depends(get_db)):
    """Single payload for /tap page."""
    _cache(response, 60)
    settings_map = {s.key: s.value for s in db.scalars(select(Setting).where(Setting.group == "tap")).all()}
    team = db.scalars(select(TapTeamMember).order_by(TapTeamMember.sort_order)).all()
    services = db.scalars(select(TapService).order_by(TapService.sort_order)).all()
    mous = db.scalars(select(MoU).where(MoU.owner == "tap").order_by(MoU.sort_order)).all()
    testimonials = db.scalars(select(RecruiterTestimonial).order_by(RecruiterTestimonial.sort_order)).all()
    events = db.scalars(select(TapEvent).order_by(TapEvent.event_date.desc(), TapEvent.sort_order)).all()
    top_recruiters = [
        r.name for r in db.scalars(
            select(Recruiter).where(Recruiter.tier == "top", Recruiter.is_active.is_(True))
            .order_by(Recruiter.sort_order, Recruiter.name)
        ).all()
    ]
    stats = db.scalars(
        select(PlacementStatistic).where(PlacementStatistic.department_code.is_(None))
        .order_by(PlacementStatistic.batch_year.desc())
    ).all()

    return {
        "vision": settings_map.get("vision"),
        "mission": settings_map.get("mission"),
        "team": [
            {
                "name": m.name, "role": m.role, "email": m.email, "phone": m.phone,
                "initials": m.initials, "accent": m.accent,
                "photo": _media(db, m.photo_id) or m.photo_url,
            }
            for m in team
        ],
        "services": [
            {
                "icon": s.icon, "title": s.title, "desc": s.description,
                "bgClass": s.bg_class, "textClass": s.text_class, "accent": s.accent,
            }
            for s in services
        ],
        "mous": [
            {
                "name": m.partner_name, "logo": m.logo,
                "logo_img": _media(db, m.logo_id) or m.logo_url,
                "desc": m.description, "tags": m.tags or [],
            }
            for m in mous
        ],
        "mou_docs": [
            {"label": m.document_label, "url": _media(db, m.document_id) or m.document_url}
            for m in mous
            if (m.document_label and (m.document_url or m.document_id))
        ],
        "testimonials": [
            {
                "name": t.name, "role": t.role, "text": t.quote,
                "initials": t.initials, "accent": t.accent,
                "photo": _media(db, t.photo_id),
            }
            for t in testimonials
        ],
        "events": [
            {
                "title": e.title, "description": e.description,
                "event_date": e.event_date.isoformat() if e.event_date else None,
                "image_url": _media(db, e.image_id) or e.image_url,
                "icon": e.icon, "type": e.type, "status": e.status,
            }
            for e in events
        ],
        "top_recruiters": top_recruiters,
        "stats": [
            {
                "batch_year": s.batch_year,
                "highest_lpa": float(s.highest_lpa) if s.highest_lpa is not None else None,
                "average_lpa": float(s.average_lpa) if s.average_lpa is not None else None,
                "placement_rate_pct": float(s.placement_rate_pct) if s.placement_rate_pct is not None else None,
                "offers_count": s.offers_count,
                "recruiters_count": s.recruiters_count,
            }
            for s in stats
        ],
    }


@router.get("/compliance/naac")
def public_naac(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    grades = db.scalars(select(NaacGrade).order_by(NaacGrade.cycle.desc())).all()
    docs = db.scalars(select(NaacDocument).order_by(NaacDocument.cycle.desc(), NaacDocument.sort_order)).all()
    policies = db.scalars(select(PolicyDocument).where(PolicyDocument.owner == "compliance").order_by(PolicyDocument.sort_order)).all()
    return {
        "grades": [
            {"cycle": g.cycle, "grade": g.grade, "cgpa": float(g.cgpa) if g.cgpa is not None else None,
             "valid_from": g.valid_from.isoformat() if g.valid_from else None,
             "valid_to": g.valid_to.isoformat() if g.valid_to else None,
             "certificate_url": _media(db, g.certificate_id) or g.certificate_url}
            for g in grades
        ],
        "documents": [
            {"cycle": d.cycle, "criterion": d.criterion, "title": d.title,
             "description": d.description, "year": d.year,
             "url": _media(db, d.pdf_id) or d.pdf_url}
            for d in docs
        ],
        "policies": [
            {"title": p.title, "description": p.description, "url": _media(db, p.pdf_id) or p.pdf_url}
            for p in policies
        ],
    }


@router.get("/compliance/nirf")
def public_nirf(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    rows = db.scalars(select(NirfRecord).order_by(NirfRecord.year.desc(), NirfRecord.category)).all()
    return [
        {
            "year": r.year, "category": r.category, "rank": r.rank, "rank_band": r.rank_band,
            "total_score": float(r.total_score) if r.total_score is not None else None,
            "sub_scores": r.sub_scores or {},
            "document_url": _media(db, r.document_id) or r.document_url,
        }
        for r in rows
    ]


@router.get("/compliance/committees")
def public_committees(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    rows = db.scalars(select(CommitteeMember).order_by(CommitteeMember.committee, CommitteeMember.sort_order)).all()
    out: dict[str, list] = {}
    for m in rows:
        out.setdefault(m.committee, []).append({
            "name": m.member_name, "role": m.role, "contact": m.contact,
            "term_start": m.term_start.isoformat() if m.term_start else None,
            "term_end": m.term_end.isoformat() if m.term_end else None,
        })
    return [{"committee": k, "members": v} for k, v in out.items()]


@router.get("/about/officials")
def public_officials(response: Response, db: Session = Depends(get_db), department_code: str | None = None):
    _cache(response, 300)
    stmt = select(Official).where(Official.is_active.is_(True))
    if department_code:
        stmt = stmt.where(Official.department_code == department_code)
    rows = db.scalars(stmt.order_by(Official.sort_order)).all()
    return [
        {
            "name": o.name, "role": o.role, "department_code": o.department_code,
            "email": o.email, "phone": o.phone, "bio": o.bio_md,
            "photo": _media(db, o.photo_id) or o.photo_url,
        }
        for o in rows
    ]


@router.get("/about/board")
def public_board(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    rows = db.scalars(select(BoardMember).where(BoardMember.is_active.is_(True)).order_by(BoardMember.sort_order)).all()
    return [
        {
            "name": b.name, "role": b.role, "organization": b.organization, "bio": b.bio_md,
            "photo": _media(db, b.photo_id) or b.photo_url,
        }
        for b in rows
    ]


@router.get("/alumni/speaks")
def public_alumni_speaks(response: Response, db: Session = Depends(get_db), limit: int = 50):
    _cache(response, 300)
    rows = db.scalars(
        select(AlumniProfile).where(AlumniProfile.is_featured.is_(True))
        .order_by(AlumniProfile.sort_order, AlumniProfile.batch_year.desc()).limit(limit)
    ).all()
    return [
        {
            "name": a.name, "batch_year": a.batch_year, "current_role": a.current_role,
            "company": a.company, "location": a.location,
            "quote": a.quote, "linkedin": a.linkedin,
            "photo": _media(db, a.photo_id) or a.photo_url,
        }
        for a in rows
    ]


@router.get("/alumni/chapters")
def public_alumni_chapters(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    rows = db.scalars(select(AlumniChapter).order_by(AlumniChapter.sort_order, AlumniChapter.city)).all()
    return [
        {
            "city": c.city, "country": c.country, "coordinator": c.coordinator,
            "members_count": c.members_count, "contact_email": c.contact_email,
            "contact_phone": c.contact_phone, "notes": c.notes,
        }
        for c in rows
    ]


@router.get("/alumni/mentorships")
def public_alumni_mentorships(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    rows = db.scalars(select(AlumniMentorship).where(AlumniMentorship.is_open.is_(True)).order_by(AlumniMentorship.sort_order)).all()
    return [
        {
            "name": m.name, "focus_area": m.focus_area, "description": m.description_md,
            "slots": m.slots, "is_open": m.is_open,
        }
        for m in rows
    ]


@router.get("/admissions")
def public_admissions(response: Response, db: Session = Depends(get_db)):
    """One payload with steps + docs + counsellors + fees + quotas + faqs + timeline."""
    _cache(response, 300)
    return {
        "steps": [
            {"position": s.position, "title": s.title, "description": s.description,
             "icon": s.icon, "estimated_duration": s.estimated_duration}
            for s in db.scalars(select(AdmissionStep).where(AdmissionStep.is_active.is_(True)).order_by(AdmissionStep.position)).all()
        ],
        "documents": [
            {"name": d.name, "description": d.description, "mandatory": d.mandatory,
             "applies_to": d.applies_to or [], "formats": d.formats or [], "max_size_mb": d.max_size_mb}
            for d in db.scalars(select(RequiredDocument).order_by(RequiredDocument.sort_order)).all()
        ],
        "counsellors": [
            {"name": c.name, "email": c.email, "phone": c.phone, "programme": c.programme,
             "expertise": c.expertise or [], "icon": c.icon,
             "photo": _media(db, c.photo_id)}
            for c in db.scalars(select(AdmissionCounsellor).where(AdmissionCounsellor.is_available.is_(True)).order_by(AdmissionCounsellor.sort_order)).all()
        ],
        "fees": [
            {"name": f.name, "description": f.description, "type": f.type,
             "amount": float(f.amount) if f.amount is not None else None,
             "currency": f.currency, "frequency": f.frequency,
             "duration_semesters": f.duration_semesters,
             "applies_to_programmes": f.applies_to_programmes or []}
            for f in db.scalars(select(FeeComponent).order_by(FeeComponent.sort_order)).all()
        ],
        "quotas": [
            {"name": q.name, "percentage": float(q.percentage) if q.percentage is not None else None,
             "description": q.description, "eligibility_md": q.eligibility_md}
            for q in db.scalars(select(Quota).order_by(Quota.sort_order)).all()
        ],
        "faqs": [
            {"category": f.category, "question": f.question, "answer_md": f.answer_md,
             "programme_code": f.programme_code}
            for f in db.scalars(select(AdmissionFAQ).where(AdmissionFAQ.is_active.is_(True)).order_by(AdmissionFAQ.sort_order)).all()
        ],
        "timeline": [
            {"year": t.year, "event": t.event,
             "event_date": t.event_date.isoformat() if t.event_date else None,
             "kind": t.kind}
            for t in db.scalars(select(AdmissionTimeline).where(AdmissionTimeline.is_published.is_(True)).order_by(AdmissionTimeline.year.desc(), AdmissionTimeline.sort_order)).all()
        ],
    }


@router.get("/careers/positions")
def public_positions(response: Response, db: Session = Depends(get_db), department_code: str | None = None):
    _cache(response, 60)
    stmt = select(OpenPosition).where(OpenPosition.status == "open")
    if department_code:
        stmt = stmt.where(OpenPosition.department_code == department_code)
    rows = db.scalars(stmt.order_by(OpenPosition.sort_order, OpenPosition.deadline.asc().nulls_last())).all()
    return [
        {
            "id": p.id, "title": p.title, "department_code": p.department_code,
            "category": p.category, "type": p.type, "location": p.location,
            "experience": p.experience, "description": p.description_md,
            "tags": p.tags or [],
            "deadline": p.deadline.isoformat() if p.deadline else None,
            "jd_pdf_url": _media(db, p.jd_pdf_id) or p.jd_pdf_url,
        }
        for p in rows
    ]


@router.get("/careers/jrf")
def public_jrf(response: Response, db: Session = Depends(get_db)):
    _cache(response, 60)
    rows = db.scalars(select(JrfPosting).where(JrfPosting.status == "open").order_by(JrfPosting.sort_order)).all()
    return [
        {
            "id": j.id, "title": j.title, "stipend": j.stipend, "duration": j.duration,
            "research_area": j.research_area, "eligibility_md": j.eligibility_md,
            "deadline": j.deadline.isoformat() if j.deadline else None,
            "jd_pdf_url": _media(db, j.jd_pdf_id) or j.jd_pdf_url,
        }
        for j in rows
    ]


@router.get("/clubs")
def public_clubs(response: Response, db: Session = Depends(get_db), type_: str | None = None):
    _cache(response, 300)
    stmt = select(ClubCell).where(ClubCell.is_published.is_(True))
    if type_:
        stmt = stmt.where(ClubCell.type == type_)
    rows = db.scalars(stmt.order_by(ClubCell.sort_order, ClubCell.name)).all()
    return [
        {
            "code": c.code, "name": c.name, "type": c.type, "description": c.description,
            "icon": c.icon, "accent": c.accent, "page_path": c.page_path,
            "logo": _media(db, c.logo_id) or c.logo_url,
            "contact_email": c.contact_email, "contact_phone": c.contact_phone,
            "tags": c.tags or [],
        }
        for c in rows
    ]


@router.get("/events")
def public_events(response: Response, db: Session = Depends(get_db), status_: str | None = None, club_code: str | None = None, limit: int = 100):
    _cache(response, 60)
    stmt = select(Event)
    if status_:
        stmt = stmt.where(Event.status == status_)
    if club_code:
        sub = select(ClubCell.id).where(ClubCell.code == club_code).scalar_subquery()
        stmt = stmt.where(Event.club_id == sub)
    rows = db.scalars(stmt.order_by(Event.event_date.desc().nulls_last(), Event.sort_order).limit(limit)).all()
    return [
        {
            "id": e.id, "title": e.title, "description": e.description_md,
            "event_date": e.event_date.isoformat() if e.event_date else None,
            "event_end_date": e.event_end_date.isoformat() if e.event_end_date else None,
            "location": e.location, "type": e.type, "status": e.status,
            "image_url": _media(db, e.banner_id) or e.banner_url,
            "registration_url": e.registration_url,
            "is_featured": e.is_featured,
            "club_code": (db.get(ClubCell, e.club_id).code if e.club_id else None),
        }
        for e in rows
    ]


@router.get("/notices")
def public_notices(response: Response, db: Session = Depends(get_db), limit: int = 20):
    _cache(response, 60)
    rows = db.scalars(
        select(Notice).where(Notice.is_active.is_(True))
        .order_by(Notice.priority.desc(), Notice.published_at.desc().nulls_last(), Notice.sort_order)
        .limit(limit)
    ).all()
    return [
        {
            "id": n.id, "title": n.title, "body": n.body_md, "priority": n.priority,
            "audience": n.audience or [],
            "published_at": n.published_at.isoformat() if n.published_at else None,
            "expires_on": n.expires_on.isoformat() if n.expires_on else None,
            "pdf_url": _media(db, n.pdf_id) or n.pdf_url,
        }
        for n in rows
    ]


@router.get("/announcements")
def public_announcements(response: Response, db: Session = Depends(get_db)):
    _cache(response, 30)
    rows = db.scalars(select(Announcement).where(Announcement.is_active.is_(True)).order_by(Announcement.sort_order)).all()
    return [
        {"id": a.id, "message": a.message, "link": a.link, "level": a.level}
        for a in rows
    ]


@router.get("/gallery")
def public_gallery(response: Response, db: Session = Depends(get_db)):
    """List of categories with item counts + cover."""
    _cache(response, 300)
    cats = db.scalars(select(GalleryCategory).order_by(GalleryCategory.sort_order, GalleryCategory.label)).all()
    return [
        {
            "slug": c.slug, "label": c.label, "icon": c.icon, "accent": c.accent,
            "description": c.description,
            "cover": _media(db, c.cover_media_id) or c.cover_url,
        }
        for c in cats
    ]


@router.get("/gallery/{slug}")
def public_gallery_category(slug: str, response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    cat = db.scalar(select(GalleryCategory).where(GalleryCategory.slug == slug))
    if not cat:
        raise NotFoundError(f"Gallery '{slug}' not found")
    items = db.scalars(
        select(GalleryItem).where(GalleryItem.category_id == cat.id, GalleryItem.is_active.is_(True))
        .order_by(GalleryItem.sort_order)
    ).all()
    return {
        "slug": cat.slug, "label": cat.label, "icon": cat.icon, "accent": cat.accent,
        "description": cat.description,
        "cover": _media(db, cat.cover_media_id) or cat.cover_url,
        "items": [
            {
                "id": i.id, "src": _media(db, i.media_id) or i.media_url,
                "caption": i.caption, "photographer": i.photographer,
                "captured_on": i.captured_on.isoformat() if i.captured_on else None,
            }
            for i in items
        ],
    }


@router.get("/videos")
def public_videos(response: Response, db: Session = Depends(get_db), category_slug: str | None = None):
    _cache(response, 300)
    stmt = select(Video).where(Video.is_active.is_(True))
    if category_slug:
        sub = select(GalleryCategory.id).where(GalleryCategory.slug == category_slug).scalar_subquery()
        stmt = stmt.where(Video.category_id == sub)
    rows = db.scalars(stmt.order_by(Video.sort_order)).all()
    return [
        {
            "id": v.id, "title": v.title,
            "youtube_id": v.youtube_id,
            "mp4_url": _media(db, v.mp4_media_id) or v.mp4_url,
            "cover": _media(db, v.cover_id) or v.cover_url,
            "duration_seconds": v.duration_seconds,
        }
        for v in rows
    ]


@router.get("/research/rdcell")
def public_research_rdcell(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    settings_map = {s.key: s.value for s in db.scalars(select(Setting).where(Setting.group == "research")).all()}
    focus = db.scalars(select(ResearchFocusArea).order_by(ResearchFocusArea.sort_order)).all()
    pubs = db.scalars(select(Publication).order_by(Publication.year.desc(), Publication.sort_order)).all()
    books = db.scalars(select(BookOrChapter).order_by(BookOrChapter.year.desc(), BookOrChapter.sort_order)).all()
    policies = db.scalars(select(PolicyDocument).where(PolicyDocument.owner == "research").order_by(PolicyDocument.sort_order)).all()
    return {
        "vision": settings_map.get("vision"),
        "mission": settings_map.get("mission"),
        "key_features": settings_map.get("key_features", []),
        "dept_research": settings_map.get("dept_research", []),
        "focus_areas": [
            {"name": f.name, "icon": f.icon, "description": f.description, "departments": f.departments or []}
            for f in focus
        ],
        "publications": [
            {"year": p.year, "count": p.count_label, "url": _media(db, p.pdf_id) or p.pdf_url, "summary": p.summary}
            for p in pubs
        ],
        "books": [
            {"year": b.year, "title": b.title, "url": _media(db, b.pdf_id) or b.pdf_url, "contributors": b.contributors or []}
            for b in books
        ],
        "policies": [
            {
                "title": p.title, "description": p.description, "icon": p.icon,
                "url": _media(db, p.pdf_id) or p.pdf_url, "version": p.version,
            }
            for p in policies
        ],
    }


@router.get("/research/journal")
def public_research_journal(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    rows = db.scalars(
        select(JournalIssue).where(JournalIssue.is_published.is_(True))
        .order_by(JournalIssue.year.desc(), JournalIssue.sort_order)
    ).all()
    return {
        "issues": [
            {
                "volume": j.volume, "issue": j.issue, "year": j.year, "theme": j.theme,
                "cover": _media(db, j.cover_id) or j.cover_url,
                "url": _media(db, j.pdf_id) or j.pdf_url,
            }
            for j in rows
        ],
    }


@router.get("/research/conferences")
def public_research_conferences(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    rows = db.scalars(select(Conference).order_by(Conference.year.desc(), Conference.sort_order)).all()
    return {
        "conferences": [
            {
                "id": c.id, "name": c.name, "short_name": c.short_name, "year": c.year,
                "location": c.location, "theme": c.theme, "description": c.description,
                "banner": _media(db, c.banner_id) or c.banner_url,
                "brochure": _media(db, c.brochure_id) or c.brochure_url,
                "proceedings": _media(db, c.proceedings_id) or c.proceedings_url,
                "status": c.status,
                "papers": [
                    {
                        "id": p.id, "title": p.title, "authors": p.authors or [],
                        "abstract": p.abstract_md,
                        "url": _media(db, p.pdf_id) or p.pdf_url,
                    }
                    for p in c.papers
                ],
            }
            for c in rows
        ],
    }


@router.get("/research/fdps")
def public_research_fdps(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    rows = db.scalars(select(Fdp).order_by(Fdp.start_date.desc().nulls_last(), Fdp.sort_order)).all()
    return {
        "fdps": [
            {
                "id": f.id, "title": f.title,
                "start_date": f.start_date.isoformat() if f.start_date else None,
                "end_date": f.end_date.isoformat() if f.end_date else None,
                "mode": f.mode, "description": f.description, "status": f.status,
                "banner": _media(db, f.banner_id) or f.banner_url,
                "brochure": _media(db, f.brochure_id) or f.brochure_url,
                "sessions": [
                    {
                        "id": s.id, "day": s.day, "time_slot": s.time_slot,
                        "speaker": s.speaker, "topic": s.topic, "notes": s.notes,
                    }
                    for s in f.sessions
                ],
            }
            for f in rows
        ],
    }


@router.get("/research/patents")
def public_research_patents(response: Response, db: Session = Depends(get_db)):
    _cache(response, 300)
    rows = db.scalars(select(Patent).order_by(Patent.filed_on.desc().nulls_last(), Patent.sort_order)).all()
    return {
        "patents": [
            {
                "title": p.title, "patent_no": p.patent_no, "status": p.status,
                "inventors": p.inventors or [],
                "filed_on": p.filed_on.isoformat() if p.filed_on else None,
                "granted_on": p.granted_on.isoformat() if p.granted_on else None,
                "department_code": p.department_code,
                "url": _media(db, p.pdf_id) or p.pdf_url,
            }
            for p in rows
        ],
    }


@router.get("/departments")
def public_departments(response: Response, db: Session = Depends(get_db)):
    """Lightweight list for header / footer / sitemap rendering."""
    _cache(response, 300)
    rows = db.scalars(
        select(Department).where(Department.is_published.is_(True)).order_by(Department.code)
    ).all()
    return [
        {
            "code": d.code,
            "name": d.name,
            "short": d.short_name,
            "icon": d.icon,
            "page_path": d.page_path,
            "image": _media(db, d.image_id) or d.image_url,
        }
        for d in rows
    ]
