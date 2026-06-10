"""Seed minimal compliance + alumni + officials data."""
from __future__ import annotations

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import (
    AlumniChapter,
    AlumniProfile,
    BoardMember,
    CommitteeMember,
    NaacDocument,
    NaacGrade,
    NirfRecord,
    Official,
    PolicyDocument,
)

NAAC_DOCS = [
    {"cycle": "Cycle 2", "criterion": "1.1", "title": "Curricular Aspects — Self Study Report", "year": 2024,
     "pdf_url": "https://www.itmgoi.in/NAAC/docs/SSR/criterion1.pdf"},
    {"cycle": "Cycle 2", "criterion": "2.1", "title": "Teaching-Learning & Evaluation — SSR", "year": 2024,
     "pdf_url": "https://www.itmgoi.in/NAAC/docs/SSR/criterion2.pdf"},
    {"cycle": "Cycle 2", "criterion": "3.1", "title": "Research, Innovations & Extension — SSR", "year": 2024,
     "pdf_url": "https://www.itmgoi.in/NAAC/docs/SSR/criterion3.pdf"},
    {"cycle": "Cycle 2", "criterion": "4.1", "title": "Infrastructure & Learning Resources — SSR", "year": 2024,
     "pdf_url": "https://www.itmgoi.in/NAAC/docs/SSR/criterion4.pdf"},
]

NAAC_GRADES = [
    {"cycle": "Cycle 2", "grade": "A", "cgpa": 3.01},
]

NIRF = [
    {"year": 2024, "category": "Engineering", "rank_band": "201-300"},
    {"year": 2024, "category": "Management", "rank_band": "101-150"},
    {"year": 2023, "category": "Engineering", "rank_band": "201-300"},
]

COMMITTEES = [
    ("IQAC", "Dr. Preeti Singh", "Coordinator"),
    ("IQAC", "Dr. Rishi Soni", "Member"),
    ("Anti-Ragging Committee", "Dr. S.S. Chauhan", "Chair"),
    ("Anti-Ragging Committee", "Dr. Aditya Vidyarthi", "Member"),
    ("Internal Complaints Committee (ICC)", "Mrs. Shikha Sharma", "Chair"),
    ("Grievance Redressal Cell", "Mr. Arpit Singh Chauhan", "Coordinator"),
]

BOARD = [
    {"name": "Dr. Daulat Singh Chauhan", "role": "Chairman", "organization": "ITM Trust"},
    {"name": "Dr. R.D. Gupta", "role": "Member", "organization": "Industry Veteran"},
    {"name": "Prof. Sunita Manchanda", "role": "Member", "organization": "RGPV (Affiliating University)"},
]

OFFICIALS = [
    {"name": "Dr. Daulat Singh Chauhan", "role": "Director", "email": "director@itmgoi.in"},
    {"name": "Dr. S.S. Chauhan", "role": "Dean Academics", "email": "dean.academics@itmgoi.in"},
    {"name": "Mr. Arpit Singh Chauhan", "role": "Director, TAP Cell", "email": "arpit.chauhan@itmuniversity.ac.in"},
]

ALUMNI = [
    {"name": "Rohit Sharma", "batch_year": 2018, "programme_code": "B.Tech CSE", "current_role": "SDE",
     "company": "Google", "location": "Bengaluru",
     "quote": "ITM gave me the foundation — fundamentals, faculty mentorship, and a placement pipeline that put me on a global stage.",
     "is_featured": True},
    {"name": "Priya Verma", "batch_year": 2017, "programme_code": "B.Tech IT", "current_role": "Lead Architect",
     "company": "TCS", "location": "Pune",
     "quote": "From classroom code to TCS architecture review boards — the labs at ITM are where it started.",
     "is_featured": True},
    {"name": "Anil Jain", "batch_year": 2015, "programme_code": "MBA", "current_role": "Founder",
     "company": "FinThrive", "location": "Mumbai",
     "quote": "MBA at ITM is about case-method rigor + small classes. Both translated directly into founding a fintech.",
     "is_featured": True},
]

CHAPTERS = [
    {"city": "Gwalior", "coordinator": "Alumni Office", "contact_email": "alumni@itmgoi.in", "members_count": 1200},
    {"city": "Bengaluru", "coordinator": "Rohit Sharma", "members_count": 320},
    {"city": "Pune", "coordinator": "Priya Verma", "members_count": 180},
    {"city": "Mumbai", "coordinator": "Anil Jain", "members_count": 240},
    {"city": "Delhi NCR", "members_count": 450},
]

COMPLIANCE_POLICIES = [
    ("Privacy Policy", "Website privacy and data-handling policy.", "ShieldCheck",
     "https://www.itmgoi.in/NAAC/docs/policies/Privacy_Policy.pdf"),
    ("Anti-Ragging Policy", "Zero-tolerance policy and procedures.", "ShieldAlert",
     "https://www.itmgoi.in/NAAC/docs/policies/Anti_Ragging.pdf"),
    ("Code of Conduct", "Faculty, staff and student code of conduct.", "BookOpen",
     "https://www.itmgoi.in/NAAC/docs/policies/Code_of_Conduct.pdf"),
]


def _ensure(db, model, key_func, items, builder, label):
    existing = {key_func(o) for o in db.scalars(select(model)).all()}
    n = 0
    for it in items:
        k = key_func(builder(it))
        if k in existing:
            continue
        db.add(builder(it))
        n += 1
    print(f"[seed-compliance]   {label}: {n}")


def main() -> None:
    db = SessionLocal()
    try:
        _ensure(db, NaacDocument, lambda o: (o.cycle, o.title), NAAC_DOCS, lambda d: NaacDocument(**d), "naac_docs")
        _ensure(db, NaacGrade, lambda o: o.cycle, NAAC_GRADES, lambda d: NaacGrade(**d), "naac_grades")
        _ensure(db, NirfRecord, lambda o: (o.year, o.category), NIRF, lambda d: NirfRecord(**d), "nirf")
        existing_cm = {(c.committee, c.member_name) for c in db.scalars(select(CommitteeMember)).all()}
        for i, (comm, name, role) in enumerate(COMMITTEES):
            if (comm, name) in existing_cm:
                continue
            db.add(CommitteeMember(committee=comm, member_name=name, role=role, sort_order=i))
        _ensure(db, BoardMember, lambda o: o.name, BOARD, lambda d: BoardMember(**d), "board_members")
        _ensure(db, Official, lambda o: o.name, OFFICIALS, lambda d: Official(**d), "officials")
        _ensure(db, AlumniProfile, lambda o: (o.name, o.batch_year), ALUMNI, lambda d: AlumniProfile(**d), "alumni")
        _ensure(db, AlumniChapter, lambda o: o.city, CHAPTERS, lambda d: AlumniChapter(**d), "alumni_chapters")
        existing_pol = {(p.owner, p.title) for p in db.scalars(select(PolicyDocument)).all()}
        for i, (title, desc, icon, url) in enumerate(COMPLIANCE_POLICIES):
            if ("compliance", title) in existing_pol:
                continue
            db.add(PolicyDocument(owner="compliance", title=title, description=desc,
                                  icon=icon, pdf_url=url, sort_order=i))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()
