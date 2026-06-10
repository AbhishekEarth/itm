"""SEO helpers: site URL resolution + JSON-LD builders."""
from __future__ import annotations

from datetime import datetime
from urllib.parse import urljoin

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import Setting


def site_base_url(db: Session) -> str:
    """Resolve the public site origin from settings or the first FRONTEND_ORIGINS entry."""
    s = db.get(Setting, "site.base_url")
    if s and isinstance(s.value, str) and s.value:
        return s.value.rstrip("/")
    if settings.frontend_origins_list:
        return settings.frontend_origins_list[0].rstrip("/")
    return "https://itmgoi.in"


def abs_url(db: Session, path: str) -> str:
    if path.startswith(("http://", "https://")):
        return path
    base = site_base_url(db)
    return urljoin(base + "/", path.lstrip("/"))


def organization_jsonld(db: Session) -> dict:
    brand = db.get(Setting, "brand.name")
    logo = db.get(Setting, "brand.logo_url")
    contact = db.get(Setting, "contact.primary")
    socials = db.get(Setting, "social.links")
    seo_defaults = db.get(Setting, "seo.defaults")
    base = site_base_url(db)

    same_as = []
    if socials and isinstance(socials.value, list):
        same_as = [item.get("url") for item in socials.value if isinstance(item, dict) and item.get("url")]

    contact_block = None
    if contact and isinstance(contact.value, dict):
        cv = contact.value
        contact_block = {
            "@type": "ContactPoint",
            "telephone": cv.get("phone"),
            "email": cv.get("email"),
            "contactType": "admissions",
        }

    return {
        "@context": "https://schema.org",
        "@type": "CollegeOrUniversity",
        "name": (brand.value if brand else None) or "ITM Gwalior",
        "alternateName": "Institute of Technology and Management",
        "url": base,
        "logo": (logo.value if logo else None),
        "sameAs": [u for u in same_as if u],
        "description": (seo_defaults.value or {}).get("description") if seo_defaults else None,
        "contactPoint": contact_block,
    }


def breadcrumb_jsonld(items: list[tuple[str, str]]) -> dict:
    """items: list of (name, url) — first should be Home."""
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": name, "item": url}
            for i, (name, url) in enumerate(items)
        ],
    }


def course_jsonld(*, name: str, description: str | None, provider_name: str, provider_url: str) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": name,
        "description": description,
        "provider": {"@type": "CollegeOrUniversity", "name": provider_name, "sameAs": provider_url},
    }


def event_jsonld(
    *, name: str, description: str | None, start: datetime | str | None,
    end: datetime | str | None, location: str | None, image: str | None,
    url: str | None,
) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": name,
        "description": description,
        "startDate": start if isinstance(start, str) else (start.isoformat() if start else None),
        "endDate": end if isinstance(end, str) else (end.isoformat() if end else None),
        "location": {"@type": "Place", "name": location} if location else None,
        "image": image,
        "url": url,
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    }


def article_jsonld(*, headline: str, date_published: datetime | str | None, image: str | None, url: str | None) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": headline,
        "datePublished": date_published if isinstance(date_published, str) else (date_published.isoformat() if date_published else None),
        "image": image,
        "url": url,
    }


def department_jsonld(*, name: str, description: str | None, url: str) -> dict:
    return {
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        "name": name,
        "description": description,
        "url": url,
    }
