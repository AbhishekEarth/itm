"""Align every department's seat structure with the official 2026-27 intake.

Source — the institution intake table the registrar provided:

  Bachelor of Technology (B.Tech)
  -------------------------------
    Civil Engineering ............................ 30
    Computer Science & Engineering (CSE) ......... 240
    CSE (AI & ML) ................................ 180
    CSE (Data Science) ........................... 120
    CSE (Cyber Security) .......................... 30
    Electronics & Communication Eng. (ECE) ........ 60
    Information Technology (IT) ................... 60
    Mechanical Engineering ........................ 30

  Master of Technology (M.Tech)
  -----------------------------
    Computer Science & Engineering ................. 9
    VLSI (under ECE) ................................ 9

  Other Programs
  --------------
    MBA ........................................... 120
    MCA ............................................ 60
    BBA ............................................ 60
    BCA ............................................ 60

The script is idempotent:
  * Existing rows are UPDATED in place (intake / mtech_intake / mtech_since /
    duration / programme metadata).
  * Missing rows for Data Science, MCA, BBA, BCA are INSERTED with sensible
    defaults so they appear in /admin/departments immediately.

Run from backend/:
    python -m scripts.seed_intake_2026
"""
from __future__ import annotations

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import Department


# ── 1. Updates for existing rows ───────────────────────────────────────
# `mtech_intake`/`mtech_since` are only set where applicable.
UPDATES: list[dict] = [
    {"code": "CE",    "intake": 30,  "duration": "4 Years"},
    {"code": "CSE",   "intake": 240, "duration": "4 Years",
     "mtech_intake": 9, "mtech_since": 2007},
    {"code": "AIML",  "intake": 180, "duration": "4 Years"},
    {"code": "CYBER", "intake": 30,  "duration": "4 Years"},
    {"code": "ECE",   "intake": 60,  "duration": "4 Years",
     "mtech_intake": 9, "mtech_since": 2007},  # M.Tech VLSI
    {"code": "IT",    "intake": 60,  "duration": "4 Years"},
    {"code": "ME",    "intake": 30,  "duration": "4 Years"},
    {"code": "MBA",   "intake": 120, "duration": "2 Years"},
]


# ── 2. New department rows for programmes that didn't exist yet ────────
NEW_DEPTS: list[dict] = [
    {
        "code": "DATA",
        "name": "Computer Science & Engineering (Data Science)",
        "short_name": "Data Sci.",
        "page_path": "/data-science",
        "scope_key": "dept.data",
        "established_year": 2022,
        "intake": 120,
        "duration": "4 Years",
        "affiliation": "RGPV Bhopal",
        "faculty_count": 6,
        "accent_from": "from-violet-500",
        "accent_to": "to-purple-700",
        "accent_solid": "#7c3aed",
        "icon": "📊",
        "image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80",
        "badge": "Industry-aligned Specialisation",
        "subtitle": "Statistics · Data Engineering · Big Data · Analytics — under the CSE umbrella.",
        "intro_md": (
            "Computer Science & Engineering (Data Science) trains engineers in "
            "the full data lifecycle — from collection and engineering to "
            "modelling, visualisation and storytelling. Students work hands-on "
            "with industry-grade pipelines, modern data warehouses and the "
            "statistics that underpins them."
        ),
        "chips": [["📊", "Analytics"], ["🧮", "Statistics"], ["🛢️", "Big Data"], ["🏆", "Industry Aligned"]],
        "accreditations": ["AICTE Approved", "RGPV Affiliated"],
        "specializations": ["Statistics", "Big Data", "Data Engineering", "Visual Analytics"],
        "is_published": True,
    },
    {
        "code": "MCA",
        "name": "Master of Computer Applications",
        "short_name": "MCA",
        "page_path": "/mca",
        "scope_key": "dept.mca",
        "established_year": 2010,
        "intake": 60,
        "duration": "2 Years",
        "affiliation": "RGPV Bhopal",
        "faculty_count": 8,
        "accent_from": "from-sky-500",
        "accent_to": "to-blue-700",
        "accent_solid": "#0284c7",
        "icon": "💻",
        "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1600&q=80",
        "badge": "PG Programme",
        "subtitle": "Two-year postgraduate programme in applied computing.",
        "intro_md": (
            "The Master of Computer Applications is a 2-year postgraduate "
            "programme designed for graduates seeking deep technical and "
            "industry-ready software skills. Curriculum spans modern stacks, "
            "DBMS, system design and applied AI."
        ),
        "chips": [["💻", "PG Programme"], ["🛠️", "Full Stack"], ["📚", "2 Years"], ["🏆", "RGPV"]],
        "accreditations": ["AICTE Approved", "RGPV Affiliated"],
        "is_published": True,
    },
    {
        "code": "BBA",
        "name": "Bachelor of Business Administration",
        "short_name": "BBA",
        "page_path": "/bba",
        "scope_key": "dept.bba",
        "established_year": 2015,
        "intake": 60,
        "duration": "3 Years",
        "affiliation": "Jiwaji University",
        "faculty_count": 7,
        "accent_from": "from-amber-500",
        "accent_to": "to-orange-700",
        "accent_solid": "#ea580c",
        "icon": "💼",
        "image_url": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1600&q=80",
        "badge": "UG Management Programme",
        "subtitle": "Three-year undergraduate programme in business and management.",
        "intro_md": (
            "Bachelor of Business Administration is a 3-year UG programme "
            "covering management foundations, marketing, finance, HR and "
            "entrepreneurship. Students get early exposure to internships "
            "and industry projects."
        ),
        "chips": [["💼", "Management"], ["📈", "Marketing"], ["💰", "Finance"], ["🎯", "Entrepreneurship"]],
        "accreditations": ["Jiwaji University Affiliated"],
        "is_published": True,
    },
    {
        "code": "BCA",
        "name": "Bachelor of Computer Applications",
        "short_name": "BCA",
        "page_path": "/bca",
        "scope_key": "dept.bca",
        "established_year": 2014,
        "intake": 60,
        "duration": "3 Years",
        "affiliation": "Jiwaji University",
        "faculty_count": 8,
        "accent_from": "from-emerald-500",
        "accent_to": "to-teal-700",
        "accent_solid": "#10b981",
        "icon": "🖥️",
        "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&q=80",
        "badge": "UG Programme",
        "subtitle": "Three-year undergraduate programme in computer applications.",
        "intro_md": (
            "Bachelor of Computer Applications is a 3-year UG programme that "
            "blends programming foundations with applied software development. "
            "Curriculum covers DSA, web technologies, DBMS and modern stacks."
        ),
        "chips": [["🖥️", "UG Programme"], ["💻", "Software Dev"], ["📚", "3 Years"], ["🎓", "Career-Ready"]],
        "accreditations": ["Jiwaji University Affiliated"],
        "is_published": True,
    },
]


def main() -> None:
    db = SessionLocal()
    try:
        # 1. Update existing rows
        for u in UPDATES:
            code = u["code"]
            dept = db.scalar(select(Department).where(Department.code == code))
            if not dept:
                print(f"skip      {code} (not seeded yet)")
                continue
            for k, v in u.items():
                if k == "code":
                    continue
                setattr(dept, k, v)
            print(
                f"updated   {code:<6} intake={u.get('intake')}"
                + (f"  mtech={u.get('mtech_intake')}" if u.get("mtech_intake") else "")
            )

        # 2. Insert new departments (or update if already present)
        for payload in NEW_DEPTS:
            code = payload["code"]
            dept = db.scalar(select(Department).where(Department.code == code))
            if not dept:
                db.add(Department(**payload))
                print(f"inserted  {code:<6} intake={payload['intake']}  ({payload['name']})")
            else:
                for k, v in payload.items():
                    setattr(dept, k, v)
                print(f"updated   {code:<6} intake={payload['intake']}  ({payload['name']})")

        db.commit()
        print("\nSeed complete. Intake table now matches the 2026-27 admission notice.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
