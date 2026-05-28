"""Seed: site settings + a `Home` page with editable sections.

Idempotent — only inserts what's missing. Safe to re-run after every deploy.

Run: `python -m scripts.seed_cms` (from inside backend/)
"""
from __future__ import annotations

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import Page, PageSection, Setting


DEFAULT_SETTINGS = [
    ("site.base_url", "https://itmgoi.in", "site", "Canonical site origin used for sitemap/JSON-LD"),
    ("brand.name", "ITM Gwalior", "brand", "Institute display name"),
    ("brand.tagline", "Think Big. Think Beyond.", "brand", "Tagline shown on the hero"),
    ("brand.logo_url", "/images/ITMGOILogo.png", "brand", "Site logo (path or URL)"),
    ("brand.accent_color", "#800000", "brand", "Primary brand color"),
    (
        "contact.primary",
        {
            "phone": "+91-751-2440056",
            "phone_secondary": "+91-751-2432977",
            "email": "admission@itmgoi.in",
            "address": "ITM Gwalior, Sithouli, Gwalior, Madhya Pradesh - 475001",
        },
        "contact",
        "Primary phone/email/address",
    ),
    (
        "social.links",
        [
            {"platform": "facebook", "url": "https://facebook.com/itmgoi"},
            {"platform": "twitter", "url": "https://twitter.com/itmgoi"},
            {"platform": "linkedin", "url": "https://linkedin.com/school/itmgoi"},
            {"platform": "instagram", "url": "https://instagram.com/itmgoi"},
            {"platform": "youtube", "url": "https://youtube.com/@itmgoi"},
        ],
        "social",
        "Social media handles",
    ),
    (
        "seo.defaults",
        {
            "title_suffix": " | ITM Gwalior",
            "description": "ITM Gwalior — Premier engineering & management institute in Gwalior, Madhya Pradesh.",
            "og_image": "/images/ITMGOILogo.png",
            "twitter": "@itmgoi",
            "organization": "Institute of Technology and Management, Gwalior",
        },
        "seo",
        "Defaults used when a page doesn't set its own meta",
    ),
]


HOME_SECTIONS = [
    {
        "section_key": "hero",
        "label": "Hero",
        "kind": "hero",
        "position": 0,
        "payload": {
            "headline": "Think Big. Think Beyond.",
            "subhead": (
                "At ITM Gwalior, we don't just follow the future — we shape it. "
                "Pursue engineering or management at one of central India's most "
                "trusted institutions."
            ),
            "primary_cta": {"label": "Apply Now 2026", "href": "/admissions/how-to-apply"},
            "secondary_cta": {"label": "Watch Tour", "href": "#campus-tour"},
            "slides": [
                {"image": "/images/hero/slider1.jpg", "alt": "ITM campus aerial view"},
                {"image": "/images/hero/slider2.jpg", "alt": "ITM students at convocation"},
                {"image": "/images/hero/slider3.jpg", "alt": "ITM campus life"},
                {"image": "/images/hero/slider4.jpg", "alt": "ITM auditorium"},
            ],
            "mini_stats": [
                {"value": "29+", "label": "Years"},
                {"value": "1500+", "label": "Recruiters"},
                {"value": "98%", "label": "Placement"},
            ],
        },
    },
    {
        "section_key": "stats_strip",
        "label": "Stats strip",
        "kind": "list",
        "position": 1,
        "payload": [
            {"value": "10.85 ac", "label": "Lush green campus"},
            {"value": "45", "label": "Classrooms"},
            {"value": "42", "label": "Labs"},
            {"value": "728", "label": "Computers"},
            {"value": "2500+", "label": "Students"},
            {"value": "80%+", "label": "Placement"},
        ],
    },
    {
        "section_key": "admission_cta",
        "label": "Admission CTA strip",
        "kind": "rich_text",
        "position": 2,
        "payload": {
            "headline": "Admissions 2026 are now open",
            "body": "Apply online today and secure your seat at ITM Gwalior.",
            "cta_label": "Apply Now",
            "cta_href": "https://onlineapply.itmgoi.in/form_hdfc.php?ok=Apply+Now",
            "counselling_hours": "Mon–Sat, 10am to 5pm",
        },
    },
]


def ensure_settings() -> int:
    db = SessionLocal()
    inserted = 0
    try:
        existing = {s for s in db.scalars(select(Setting.key))}
        for key, value, group, desc in DEFAULT_SETTINGS:
            if key in existing:
                continue
            db.add(Setting(key=key, value=value, group=group, description=desc))
            inserted += 1
        if inserted:
            db.commit()
        return inserted
    finally:
        db.close()


def ensure_home_page() -> bool:
    db = SessionLocal()
    try:
        page = db.scalar(select(Page).where(Page.key == "home"))
        created = False
        if not page:
            page = Page(
                key="home",
                path="/",
                title="Home",
                slug="home",
                meta_title="ITM Gwalior — Engineering & Management Institute",
                meta_description=(
                    "Pursue engineering or management at ITM Gwalior — NAAC-A, 1500+ recruiters, "
                    "98% placement, central India's most trusted institute."
                ),
                meta_keywords=["ITM", "Gwalior", "engineering", "management", "MBA", "B.Tech"],
                is_published=True,
                status="published",
                scope_key="site.pages",
            )
            db.add(page)
            db.commit()
            db.refresh(page)
            created = True

        existing_keys = {s.section_key for s in page.sections}
        for sec in HOME_SECTIONS:
            if sec["section_key"] in existing_keys:
                continue
            db.add(
                PageSection(
                    page_id=page.id,
                    section_key=sec["section_key"],
                    label=sec["label"],
                    kind=sec["kind"],
                    position=sec["position"],
                    payload=sec["payload"],
                )
            )
        db.commit()
        return created
    finally:
        db.close()


def main() -> None:
    s = ensure_settings()
    created = ensure_home_page()
    print(f"[seed-cms] settings inserted: {s}")
    print(f"[seed-cms] home page {'created' if created else 'already existed'}, sections ensured")


if __name__ == "__main__":
    main()
