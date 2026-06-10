"""Dynamic sitemap.xml + robots.txt + JSON-LD endpoints."""
from __future__ import annotations

from datetime import datetime
from xml.sax.saxutils import escape

from fastapi import APIRouter, Depends, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models import (
    AlumniProfile,
    ClubCell,
    Conference,
    Department,
    Event,
    GalleryCategory,
    JournalIssue,
    Notice,
    OpenPosition,
    Page,
)
from app.services.seo import abs_url, organization_jsonld, site_base_url

router = APIRouter(tags=["seo"])


def _xml_url(loc: str, lastmod: datetime | None = None, priority: float | None = None) -> str:
    parts = [f"  <url>", f"    <loc>{escape(loc)}</loc>"]
    if lastmod:
        parts.append(f"    <lastmod>{lastmod.strftime('%Y-%m-%d')}</lastmod>")
    if priority is not None:
        parts.append(f"    <priority>{priority:.1f}</priority>")
    parts.append("  </url>")
    return "\n".join(parts)


@router.get("/public/sitemap.xml")
def sitemap(response: Response, db: Session = Depends(get_db)):
    urls: list[str] = []
    # Pages (CMS rows)
    for p in db.scalars(select(Page).where(Page.is_published.is_(True)).order_by(Page.path)).all():
        urls.append(_xml_url(abs_url(db, p.path), p.updated_at, 1.0 if p.path == "/" else 0.8))
    # Departments
    for d in db.scalars(select(Department).where(Department.is_published.is_(True))).all():
        if d.page_path:
            urls.append(_xml_url(abs_url(db, d.page_path), d.updated_at, 0.8))
    # Clubs
    for c in db.scalars(select(ClubCell).where(ClubCell.is_published.is_(True))).all():
        if c.page_path:
            urls.append(_xml_url(abs_url(db, c.page_path), c.updated_at, 0.6))
    # Gallery categories
    for g in db.scalars(select(GalleryCategory)).all():
        urls.append(_xml_url(abs_url(db, f"/gallery/{g.slug}"), g.updated_at, 0.5))
    # Events
    for e in db.scalars(select(Event).where(Event.status == "upcoming")).all():
        urls.append(_xml_url(abs_url(db, f"/events#{e.id}"), e.updated_at, 0.4))
    # Notices
    for n in db.scalars(select(Notice).where(Notice.is_active.is_(True))).all():
        urls.append(_xml_url(abs_url(db, f"/notices#{n.id}"), n.updated_at, 0.4))
    # Journal issues
    for j in db.scalars(select(JournalIssue).where(JournalIssue.is_published.is_(True))).all():
        urls.append(_xml_url(abs_url(db, f"/research/journal#{j.id}"), j.updated_at, 0.5))
    # Conferences
    for cf in db.scalars(select(Conference)).all():
        urls.append(_xml_url(abs_url(db, f"/research/conference#{cf.id}"), cf.updated_at, 0.5))
    # Featured alumni
    for a in db.scalars(select(AlumniProfile).where(AlumniProfile.is_featured.is_(True))).all():
        urls.append(_xml_url(abs_url(db, f"/alumni/speaks#{a.id}"), a.updated_at, 0.3))
    # Open positions
    for op in db.scalars(select(OpenPosition).where(OpenPosition.status == "open")).all():
        urls.append(_xml_url(abs_url(db, f"/careers/open-positions/{op.id}"), op.updated_at, 0.5))

    body = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(urls) + "\n</urlset>\n"
    )
    response.headers["Cache-Control"] = "public, max-age=3600"
    return Response(content=body, media_type="application/xml")


@router.get("/public/robots.txt")
def robots(response: Response, db: Session = Depends(get_db)):
    base = site_base_url(db)
    lines = [
        "User-agent: *",
        "Disallow: /admin",
        "Disallow: /api",
        "Allow: /api/public",
        "",
        f"Sitemap: {base}/api/public/sitemap.xml",
        "",
    ]
    response.headers["Cache-Control"] = "public, max-age=3600"
    return Response(content="\n".join(lines), media_type="text/plain")


@router.get("/public/seo/organization-jsonld")
def organization_ld(response: Response, db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "public, max-age=3600"
    return organization_jsonld(db)
