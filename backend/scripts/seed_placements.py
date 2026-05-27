"""Seed TAP/Placement data carved out of TapPage.jsx.

Idempotent. Run via `python -m scripts.seed_placements` or transitively from seed.py.
"""
from __future__ import annotations

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import (
    MoU,
    Recruiter,
    RecruiterCategory,
    RecruiterTestimonial,
    Setting,
    TapService,
    TapTeamMember,
)


CATEGORIES = [
    {"key": "eng_it", "name": "Engineering & IT", "sort_order": 0},
    {"key": "management", "name": "Management", "sort_order": 1},
]

# Top recruiters listed in TapPage.jsx TOP_RECRUITERS
TOP_RECRUITERS = [
    "TCS", "Wipro", "Cognizant", "ICICI", "Xiaomi", "VISA Steel", "Thermax",
    "FedEx", "Mphasis", "IBM India", "Infosys Technologies", "Infosys Limited",
]
# Bulk Eng/IT pool (logos folder index, mostly)
ENG_IT_RECRUITERS = [
    "Accenture", "Adobe", "Amazon", "Amdocs", "Bitwise", "Bosch", "Capgemini",
    "Cognizant", "DRDO", "Genpact", "Google", "Hexaware", "Hike Education",
    "HP", "IBM India", "Infosys Limited", "Infosys Technologies", "Intel",
    "Intellipaat", "ISRO", "JK Tyre", "L&T", "Microsoft", "Mindtree",
    "Mphasis", "Naval Group India", "NTT DATA", "Oracle", "SAP Labs",
    "Sasken", "SGS", "Siemens", "TCS", "Tech Mahindra", "Wipro", "Zoho",
]
MGMT_RECRUITERS = [
    "Axis Bank", "Bajaj FinServ", "Bharti Airtel", "Canara Bank", "Capgemini",
    "Cognizant", "FedEx", "Genpact", "Havells", "HCL", "HDFC", "ICICI", "IDFC First",
    "JK Tyre", "Kotak Mahindra", "Mahindra Group", "Mastercard", "Mphasis",
    "Naval Group India", "Paytm", "Reliance Retail", "Reliance Jio",
    "SBI", "Tata Capital", "Tata Power", "TCS", "Tech Mahindra", "Thermax",
    "Visa Steel", "Wipro", "Xiaomi", "Yes Bank",
]

TAP_TEAM = [
    {"name": "Mr. Arpit Singh Chauhan", "role": "Dean / Director TAP CELL (I/C)",
     "email": "arpit.chauhan@itmuniversity.ac.in", "phone": "+91-9691973919",
     "initials": "AC", "accent": "from-rose-500 to-[#800000]",
     "photo_url": "https://www.itmgoi.in/assets2/images/Arpit_Singh.jpg"},
    {"name": "Mrs. Shikha Sharma", "role": "Assistant Director Placement",
     "email": "shikhasharma@itmuniversity.ac.in", "phone": "+91-9229333335",
     "initials": "SS", "accent": "from-amber-500 to-orange-600",
     "photo_url": "https://www.itmgoi.in/assets2/images/Shikha_Sharma.jpg"},
]

TAP_SERVICES = [
    {"icon": "ClipboardCheck", "title": "Personal Interview Training",
     "description": "One-on-one sessions before every placement / internship drive — covering aptitude, mock interviews and HR-fit grooming.",
     "bg_class": "bg-rose-50 dark:bg-rose-950/20",
     "text_class": "text-[#800000] dark:text-rose-400",
     "accent": "from-rose-500 to-[#800000]"},
    {"icon": "Presentation", "title": "Industrial Expert Talks",
     "description": "Renowned professionals from industry share overviews, tips and case studies — online and offline sessions throughout the year.",
     "bg_class": "bg-amber-50 dark:bg-amber-950/20",
     "text_class": "text-amber-700 dark:text-amber-400",
     "accent": "from-amber-500 to-orange-600"},
    {"icon": "Briefcase", "title": "Mandatory 45-day Internship",
     "description": "Every student completes a 45-day summer internship — industry exposure, practical learning and an offer pipeline.",
     "bg_class": "bg-emerald-50 dark:bg-emerald-950/20",
     "text_class": "text-emerald-700 dark:text-emerald-400",
     "accent": "from-emerald-500 to-teal-700"},
    {"icon": "Target", "title": "Campus Recruitment Drives",
     "description": "150+ recruiters on campus year-round including TCS, Infosys, Wipro, Capgemini, ICICI, IBM, Cognizant, FedEx and more.",
     "bg_class": "bg-indigo-50 dark:bg-indigo-950/20",
     "text_class": "text-indigo-600 dark:text-indigo-400",
     "accent": "from-indigo-500 to-violet-700"},
]

MOUS = [
    {"partner_name": "EduSkills Foundation", "logo": "🎓",
     "logo_url": "https://www.itmgoi.in/assets2/images/LOGO_EduSkills.png",
     "description": "Digital skills expansion in networking, cyber security, cloud computing, automation and RPA. ITM ranked #35 nationally in EduSkills Virtual Internship Rankings 2024.",
     "tags": ["Networking", "Cyber Security", "Cloud", "RPA"]},
    {"partner_name": "AWS Academy", "logo": "☁️",
     "logo_url": "https://www.itmgoi.in/assets2/images/aws.jpg",
     "description": "Authorised AWS Academy — cloud computing, machine learning and data analytics training with AWS-recognised certifications.",
     "tags": ["AWS Cloud", "ML", "Data Analytics"]},
    {"partner_name": "Microsoft Learn", "logo": "🪟",
     "logo_url": "https://www.itmgoi.in/assets2/images/ms.jpg",
     "description": "Center of Excellence (May 2024 – April 2025). Programmes in AI, cyber security and green skills with Microsoft certifications.",
     "tags": ["AI", "Cyber Security", "Green Skills"]},
    {"partner_name": "Bajaj FinServ", "logo": "💼",
     "logo_url": "https://www.itmgoi.in/assets2/images/mou.jpg",
     "description": "Certificate Programme in Banking, Finance and Insurance (CPBFI) — industry-driven curriculum and guaranteed interview pipeline.",
     "tags": ["BFSI", "Certified"]},
]
MOU_DOCS = [
    ("MoU 2023–2024", "https://www.itmgoi.in/IQAC/docs/Website_UpdateDec2024/MoU_2023-2024.pdf"),
    ("MoU 2022–2023", "https://www.itmgoi.in/IQAC/docs/Website_UpdateDec2024/MoU_2022-2023.pdf"),
    ("MoU 2021–2022", "https://www.itmgoi.in/IQAC/docs/Website_UpdateDec2024/MoU_2021-2022.pdf"),
    ("MoU 2020–2021", "https://www.itmgoi.in/IQAC/docs/Website_UpdateDec2024/MoU_2020-2021.pdf"),
    ("MoU 2019–2020", "https://www.itmgoi.in/IQAC/docs/Website_UpdateDec2024/MoU_2019-2020.pdf"),
]

TESTIMONIALS = [
    ("Aditya Mahajan", "Recruiter Campus Hiring, TCS", "It was a wonderful and great experience for conducting interviews at ITM. Students were well prepared. College Management has invested a lot in grooming them. Good performance by students. Good professionalism.", "AM", "from-rose-500 to-[#800000]"),
    ("Lakshmi", "Regional Head, Wipro", "It was a good batch that we interviewed met most of our requirement. Technical knowledge of students was good. Looking forward to conduct more drives in future.", "L", "from-amber-500 to-orange-600"),
    ("Ronak Choudhary", "Regional Head, Cognizant", "The spirit shown by students was very delightful and encouraging for us & for our company too. Did bulk hiring even on the virtual mode. Students have good technical knowledge.", "RC", "from-emerald-500 to-teal-700"),
    ("Piuli Ghosh", "Campus Lead, ICICI", "We had a good experience! We expected more candidates for interview, out of 30 to 40 students almost 50% got placed. Decent quality of students.", "PG", "from-indigo-500 to-violet-700"),
    ("Deepti Thakur", "Campus Team, Xiaomi", "It was a good experience, glad to provide this opportunity to the students of ITM. Students should keep working on aptitude.", "DT", "from-sky-500 to-blue-700"),
    ("Sandeep Mishra", "HR, VISA Steel", "It was an amazing experience and the students were really enthusiastic. Every year we get an upgraded batch. Will love to visit again.", "SM", "from-pink-500 to-rose-700"),
    ("Kajal Soni", "HR Recruiter, Thermax Limited", "During the pandemic time, it was unexpected to conduct such a wonderful drive on a Virtual Mode. Students have good technical knowledge. Great experience!", "KS", "from-yellow-600 to-amber-800"),
    ("Akhil James", "HR Specialist, FedEx", "Had a great experience visiting ITM. Courtesy campus members really appreciate the efforts and support provided. Well-groomed and prepared students.", "AJ", "from-violet-500 to-indigo-700"),
    ("Amrita Paul", "DGM, IBM India", "Good Campus. Got lot of support from the staff, well organised. It was a pleasure being here.", "AP", "from-cyan-500 to-blue-700"),
    ("Ms. Shazia Siddiqui", "HR Manager, Infosys Technologies", "Extremely impressive infrastructure. A good team of officials with a good vision for the institute and the students. The students will definitely be groomed into good professionals.", "SS", "from-lime-500 to-green-700"),
    ("Achu Mani", "Senior Analyst, Mphasis", "It was a good batch that we interviewed. Good luck to each of them.", "AM", "from-teal-500 to-cyan-700"),
    ("Varun Jain", "Senior Project Manager, Infosys Limited", "Overall good performance by students. Impressive communication skills.", "VJ", "from-blue-500 to-sky-700"),
]


def _settings_inserted(db) -> int:
    inserted = 0
    defaults = [
        ("tap.vision", "To bridge the gap between students' skill, knowledge and the industry's requirement and expectation by building employability through various workshops, seminars and campus recruitment training so that the student can grab the best opportunities and will grow vigorously in their career.", "tap", "TAP Cell vision"),
        ("tap.mission", "The Training Augmentation and Placement team of ITM Gwalior is dedicated towards achieving 100% placements by collaborating with HR teams of different corporates to ensure the smooth functioning of the Campus-Recruitment process.", "tap", "TAP Cell mission"),
    ]
    existing = {s for s in db.scalars(select(Setting.key))}
    for k, v, g, d in defaults:
        if k in existing:
            continue
        # public_tap reads "vision" / "mission" without the "tap." prefix — provide both keys
        db.add(Setting(key=k, value=v, group=g, description=d))
        short = k.split(".", 1)[1]
        if short not in existing:
            db.add(Setting(key=short, value=v, group="tap", description=d))
        inserted += 1
    return inserted


def ensure_categories(db) -> dict[str, int]:
    out: dict[str, int] = {}
    for c in CATEGORIES:
        row = db.scalar(select(RecruiterCategory).where(RecruiterCategory.key == c["key"]))
        if not row:
            row = RecruiterCategory(**c)
            db.add(row); db.flush()
        out[c["key"]] = row.id
    return out


def ensure_recruiters(db, cat_ids: dict[str, int]) -> int:
    existing = {(r.name, r.category_id) for r in db.scalars(select(Recruiter)).all()}
    inserted = 0
    for i, name in enumerate(ENG_IT_RECRUITERS):
        if (name, cat_ids["eng_it"]) in existing:
            continue
        db.add(Recruiter(
            name=name, category_id=cat_ids["eng_it"],
            tier="top" if name in TOP_RECRUITERS else "standard", sort_order=i, is_active=True,
        ))
        inserted += 1
    for i, name in enumerate(MGMT_RECRUITERS):
        if (name, cat_ids["management"]) in existing:
            continue
        db.add(Recruiter(
            name=name, category_id=cat_ids["management"],
            tier="top" if name in TOP_RECRUITERS else "standard", sort_order=i, is_active=True,
        ))
        inserted += 1
    return inserted


def ensure_team(db) -> int:
    existing = {m.name for m in db.scalars(select(TapTeamMember)).all()}
    inserted = 0
    for i, t in enumerate(TAP_TEAM):
        if t["name"] in existing:
            continue
        db.add(TapTeamMember(sort_order=i, **t))
        inserted += 1
    return inserted


def ensure_services(db) -> int:
    existing = {s.title for s in db.scalars(select(TapService)).all()}
    inserted = 0
    for i, s in enumerate(TAP_SERVICES):
        if s["title"] in existing:
            continue
        db.add(TapService(sort_order=i, **s))
        inserted += 1
    return inserted


def ensure_mous(db) -> int:
    existing = {m.partner_name for m in db.scalars(select(MoU).where(MoU.owner == "tap")).all()}
    inserted = 0
    # MoU partner rows
    for i, m in enumerate(MOUS):
        if m["partner_name"] in existing:
            continue
        db.add(MoU(owner="tap", sort_order=i, **m))
        inserted += 1
    # MoU-by-year document rows (separate)
    doc_existing = {m.document_label for m in db.scalars(select(MoU).where(MoU.owner == "tap", MoU.document_label.is_not(None))).all()}
    for i, (label, url) in enumerate(MOU_DOCS):
        if label in doc_existing:
            continue
        db.add(MoU(
            owner="tap", partner_name=label,
            document_label=label, document_url=url, sort_order=100 + i,
        ))
        inserted += 1
    return inserted


def ensure_testimonials(db) -> int:
    existing = {(t.name, t.role) for t in db.scalars(select(RecruiterTestimonial)).all()}
    inserted = 0
    for i, (name, role, quote, initials, accent) in enumerate(TESTIMONIALS):
        if (name, role) in existing:
            continue
        db.add(RecruiterTestimonial(
            name=name, role=role, quote=quote,
            initials=initials, accent=accent, sort_order=i,
        ))
        inserted += 1
    return inserted


def main() -> None:
    db = SessionLocal()
    try:
        s = _settings_inserted(db)
        cat_ids = ensure_categories(db)
        r = ensure_recruiters(db, cat_ids)
        t = ensure_team(db)
        sv = ensure_services(db)
        m = ensure_mous(db)
        ts = ensure_testimonials(db)
        db.commit()
        print(f"[seed-tap] settings={s}, recruiters={r}, team={t}, services={sv}, mous={m}, testimonials={ts}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
