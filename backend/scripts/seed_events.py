"""Seed clubs/cells + gallery categories from the existing frontend constants."""
from __future__ import annotations

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import ClubCell, GalleryCategory


CLUBS = [
    {"code": "pac",   "name": "Performing Arts Club",     "type": "club", "icon": "🎭", "accent": "from-rose-500 to-[#800000]",   "page_path": "/pac",   "scope_key": "events.pac",     "tags": ["Music", "Dance", "Drama"]},
    {"code": "pix",   "name": "Photography Club",         "type": "club", "icon": "📷", "accent": "from-amber-500 to-orange-600", "page_path": "/photography", "scope_key": "events.cultural", "tags": ["Photography"]},
    {"code": "dev",   "name": "Coding Club",              "type": "club", "icon": "💻", "accent": "from-emerald-500 to-teal-700","page_path": "/coding", "scope_key": "events.cultural", "tags": ["Programming"]},
    {"code": "nss",   "name": "NSS",                      "type": "cell", "icon": "🤝", "accent": "from-rose-500 to-[#800000]",   "page_path": "/nss",   "scope_key": "clubs.nss"},
    {"code": "uba",   "name": "Unnat Bharat Abhiyan",     "type": "cell", "icon": "🌾", "accent": "from-amber-500 to-orange-600", "page_path": "/uba",   "scope_key": "clubs.uba"},
    {"code": "wec",   "name": "Women Empowerment Cell",   "type": "cell", "icon": "♀️", "accent": "from-pink-500 to-rose-700",    "page_path": "/wec",   "scope_key": "clubs.wec"},
    {"code": "sports","name": "Sports",                   "type": "cell", "icon": "🏆", "accent": "from-indigo-500 to-violet-700","page_path": "/sports","scope_key": "clubs.sports"},
    {"code": "iqac",  "name": "IQAC",                     "type": "cell", "icon": "📊", "accent": "from-sky-500 to-blue-700",     "page_path": "/iqac",  "scope_key": "clubs.iqac"},
    {"code": "anti_ragging", "name": "Anti-Ragging Cell", "type": "cell", "icon": "🛡️","accent": "from-yellow-600 to-amber-800", "page_path": "/anti-ragging", "scope_key": "clubs.anti_ragging"},
]


GALLERY_CATEGORIES = [
    {"slug": "cultural",       "label": "Cultural Events",    "icon": "🎉", "accent": "from-rose-500 to-[#800000]"},
    {"slug": "experts",        "label": "Expert Visits",      "icon": "🎤", "accent": "from-amber-500 to-orange-600"},
    {"slug": "infrastructure", "label": "Infrastructure",     "icon": "🏛️","accent": "from-sky-500 to-blue-700"},
    {"slug": "sports",         "label": "Sports",             "icon": "🏆", "accent": "from-indigo-500 to-violet-700"},
    {"slug": "students",       "label": "Student Photos",     "icon": "🎓", "accent": "from-emerald-500 to-teal-700"},
    {"slug": "life",           "label": "Life @ ITM",         "icon": "💫", "accent": "from-pink-500 to-rose-700"},
    {"slug": "videos",         "label": "Video Gallery",      "icon": "🎬", "accent": "from-yellow-600 to-amber-800"},
]


def ensure_clubs(db) -> int:
    existing = {c.code for c in db.scalars(select(ClubCell)).all()}
    inserted = 0
    for i, c in enumerate(CLUBS):
        if c["code"] in existing:
            continue
        slug = c["page_path"].lstrip("/") if c.get("page_path") else c["code"]
        db.add(ClubCell(
            slug=slug,
            sort_order=i,
            is_published=True,
            meta_title=f"{c['name']} — ITM Gwalior",
            **c,
        ))
        inserted += 1
    return inserted


def ensure_gallery_categories(db) -> int:
    existing = {g.slug for g in db.scalars(select(GalleryCategory)).all()}
    inserted = 0
    for i, g in enumerate(GALLERY_CATEGORIES):
        if g["slug"] in existing:
            continue
        db.add(GalleryCategory(sort_order=i, scope_key="gallery", **g))
        inserted += 1
    return inserted


def main() -> None:
    db = SessionLocal()
    try:
        c = ensure_clubs(db)
        g = ensure_gallery_categories(db)
        db.commit()
        print(f"[seed-events] clubs={c}, gallery_categories={g}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
