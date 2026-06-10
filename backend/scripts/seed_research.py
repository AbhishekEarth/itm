"""Seed R&D Cell + Research data carved out of ResearchRDCell.jsx + related pages."""
from __future__ import annotations

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import (
    BookOrChapter,
    PolicyDocument,
    Publication,
    ResearchFocusArea,
    Setting,
)

VISION = "To foster a robust research culture within the institute that drives innovation, intellectual growth, and societal impact through high-quality research and development activities."
MISSION = "To support and enhance research activities, protect intellectual properties, provide financial assistance, and communicate research opportunities to faculty and students."

KEY_FEATURES = [
    {"icon": "Trophy",   "title": "12+ Patents",      "sub": "Filed across IoT, ML, smart systems & crop yield"},
    {"icon": "BookText", "title": "200+ Publications","sub": "SCI / Scopus indexed across 6 academic years"},
    {"icon": "FlaskConical","title":"34+ Research Areas","sub":"AI, IoT, Blockchain, Concrete, Optoelectronics, Robotics"},
    {"icon": "Award",    "title": "20+ Books",        "sub": "Books & book chapters published"},
]
DEPT_RESEARCH = [
    {"dept": "CSE",    "focus": "AI, IoT, Blockchain, Smart Surveillance", "patents": 4},
    {"dept": "IT",     "focus": "ML, Crop Yield, Smart Irrigation",        "patents": 12},
    {"dept": "ECE",    "focus": "VLSI, Optoelectronics, Antenna",          "patents": 3},
    {"dept": "ME",     "focus": "Sustainable Manufacturing, Materials",    "patents": 2},
    {"dept": "CE",     "focus": "Sustainable Concrete, Infrastructure",    "patents": 2},
    {"dept": "ESH",    "focus": "Material Science, Optoelectronics",       "patents": 1},
]
RESEARCH_AREAS = [
    ("AI & Fraud Detection",         "🤖"),
    ("IoT Facial Recognition",       "📡"),
    ("Blockchain Applications",      "🔗"),
    ("Sustainable Concrete",         "🏗️"),
    ("Infrastructure Health",        "📊"),
    ("Material Sciences",            "🔬"),
    ("Optoelectronics",              "💡"),
    ("Environmental Sustainability", "🌱"),
    ("AI-driven Robotics",           "🦾"),
    ("Smart Surveillance",           "📹"),
    ("Financial Analytics",          "📈"),
    ("Smart Irrigation",             "💧"),
]
PUBLICATIONS = [
    ("2024-25", "60+", "http://itmgoi.in/IQAC/docs/DocswithoutDigi/2024-2025.pdf"),
    ("2023-24", "75+", "http://itmgoi.in/IQAC/docs/DocswithoutDigi/2023-24.pdf"),
    ("2022-23", "80+", "http://itmgoi.in/IQAC/docs/DocswithoutDigi/2022-23.pdf"),
    ("2021-22", "70+", "http://itmgoi.in/IQAC/docs/Website_UpdateDec2024/research_publication/2021-22.pdf"),
    ("2020-21", "65+", "http://itmgoi.in/IQAC/docs/DocswithoutDigi/2020-21.pdf"),
    ("2019-20", "55+", "http://itmgoi.in/IQAC/docs/DocswithoutDigi/2019-20.pdf"),
]
BOOKS = [
    ("2023-24", "https://www.itmgoi.in/IQAC/docs/DocswithoutDigi/Book_2023-2024.pdf"),
    ("2022-23", "https://www.itmgoi.in/IQAC/docs/DocswithoutDigi/Book_2022-2023.pdf"),
    ("2021-22", "https://www.itmgoi.in/IQAC/docs/DocswithoutDigi/Book_2021-2022.pdf"),
    ("2019-20", "https://www.itmgoi.in/IQAC/docs/DocswithoutDigi/Book_2019-2020.pdf"),
]
POLICIES = [
    ("Research Promotion Policy", "Institutional policy governing research grants, sabbatical & IPR support.",
     "Shield", "https://www.itmgoi.in/NAAC/docs/policies/Research%20Promotion%20Policy.pdf"),
    ("Research Grants Received", "Detailed list of grants received over the past five years.",
     "Briefcase", "https://www.itmgoi.in/IQAC/docs/DocswithoutDigi/Research_Grants.pdf"),
    ("List of IPR 2019-2024", "Patents, copyrights and design registrations filed and secured.",
     "FileText", "https://www.itmgoi.in/IQAC/docs/DocswithoutDigi/List_of_IPR_2019-2024.pdf"),
    ("NIRF Patent Details", "National Institute Ranking Framework — patent data and reports.",
     "Award", "https://www.itmgoi.in/nirf_itm_patent_details.php"),
]


def _set(db, key, value, desc):
    if not db.scalar(select(Setting).where(Setting.key == key)):
        db.add(Setting(key=key, value=value, group="research", description=desc))


def ensure_settings(db) -> None:
    _set(db, "vision", VISION, "R&D Cell vision (research group, also used by public/research/rdcell)")
    _set(db, "mission", MISSION, "R&D Cell mission")
    _set(db, "key_features", KEY_FEATURES, "R&D Cell key feature tiles")
    _set(db, "dept_research", DEPT_RESEARCH, "Per-department research focus + patent counts")


def ensure_focus_areas(db) -> int:
    existing = {f.name for f in db.scalars(select(ResearchFocusArea)).all()}
    inserted = 0
    for i, (name, icon) in enumerate(RESEARCH_AREAS):
        if name in existing:
            continue
        db.add(ResearchFocusArea(name=name, icon=icon, sort_order=i))
        inserted += 1
    return inserted


def ensure_publications(db) -> int:
    existing = {p.year for p in db.scalars(select(Publication)).all()}
    inserted = 0
    for i, (year, count, url) in enumerate(PUBLICATIONS):
        if year in existing:
            continue
        db.add(Publication(year=year, count_label=count, pdf_url=url, sort_order=i))
        inserted += 1
    return inserted


def ensure_books(db) -> int:
    existing = {b.year for b in db.scalars(select(BookOrChapter)).all()}
    inserted = 0
    for i, (year, url) in enumerate(BOOKS):
        if year in existing:
            continue
        db.add(BookOrChapter(year=year, pdf_url=url, sort_order=i))
        inserted += 1
    return inserted


def ensure_policies(db) -> int:
    existing = {(p.owner, p.title) for p in db.scalars(select(PolicyDocument)).all()}
    inserted = 0
    for i, (title, desc, icon, url) in enumerate(POLICIES):
        if ("research", title) in existing:
            continue
        db.add(PolicyDocument(owner="research", title=title, description=desc,
                              icon=icon, pdf_url=url, sort_order=i))
        inserted += 1
    return inserted


def main() -> None:
    db = SessionLocal()
    try:
        ensure_settings(db)
        fa = ensure_focus_areas(db)
        pubs = ensure_publications(db)
        books = ensure_books(db)
        pol = ensure_policies(db)
        db.commit()
        print(f"[seed-research] focus_areas={fa}, publications={pubs}, books={books}, policies={pol}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
