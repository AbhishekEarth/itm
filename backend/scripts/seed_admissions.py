"""Seed admissions content (steps, docs, counsellors, fees, quotas, FAQs, timeline)."""
from __future__ import annotations

from sqlalchemy import select

from app.core.database import SessionLocal
from app.models import (
    AdmissionCounsellor,
    AdmissionFAQ,
    AdmissionStep,
    AdmissionTimeline,
    FeeComponent,
    Quota,
    RequiredDocument,
    Setting,
)


STEPS = [
    {"position": 1, "title": "Register Online", "description": "Create your profile on the admissions portal with basic details and a valid email.", "icon": "UserPlus", "estimated_duration": "5 minutes"},
    {"position": 2, "title": "Pay Application Fee", "description": "Pay the non-refundable application fee online via HDFC payment gateway.", "icon": "CreditCard", "estimated_duration": "2 minutes"},
    {"position": 3, "title": "Upload Documents", "description": "Upload all required certificates, ID proofs, and academic records.", "icon": "Upload", "estimated_duration": "15 minutes"},
    {"position": 4, "title": "Document Verification", "description": "Our admissions team will verify your submitted documents within 48 hours.", "icon": "FileCheck", "estimated_duration": "48 hours"},
    {"position": 5, "title": "Counselling & Confirmation", "description": "Attend the counselling round and confirm your seat with the admission fee.", "icon": "Headset", "estimated_duration": "1 day"},
    {"position": 6, "title": "Welcome to ITM!", "description": "Get your enrolment number and join the orientation programme.", "icon": "GraduationCap"},
]

DOCS = [
    {"name": "10th Marksheet & Certificate"},
    {"name": "12th Marksheet & Certificate"},
    {"name": "Transfer Certificate"},
    {"name": "Migration Certificate", "mandatory": False},
    {"name": "Caste Certificate", "mandatory": False},
    {"name": "Domicile Certificate", "mandatory": False},
    {"name": "Aadhaar Card"},
    {"name": "Passport-size Photograph"},
    {"name": "Income Certificate", "mandatory": False},
    {"name": "JEE/NEET Score Card", "mandatory": False, "applies_to": ["B.Tech"]},
    {"name": "Graduation Marksheet", "applies_to": ["MBA", "M.Tech", "MCA"]},
    {"name": "Entrance Exam Score (CAT/GMAT/MAT/CMAT)", "mandatory": False, "applies_to": ["MBA"]},
]

COUNSELLORS = [
    {"name": "Mr. Arpit Singh Chauhan", "email": "arpit.chauhan@itmuniversity.ac.in", "phone": "+91-9691973919", "programme": "All Programmes", "icon": "User"},
    {"name": "Mrs. Shikha Sharma", "email": "shikhasharma@itmuniversity.ac.in", "phone": "+91-9229333335", "programme": "B.Tech", "icon": "Briefcase"},
    {"name": "Admissions Office", "email": "admission@itmgoi.in", "phone": "+91-7773005065", "programme": "General Enquiries", "icon": "Phone"},
]

FEES = [
    {"name": "B.Tech Tuition Fee", "type": "tuition", "amount": 95000, "frequency": "annual", "duration_semesters": 8, "applies_to_programmes": ["B.Tech"]},
    {"name": "PG (M.Tech / MBA / MCA) Tuition Fee", "type": "tuition", "amount": 80000, "frequency": "annual", "duration_semesters": 4, "applies_to_programmes": ["M.Tech", "MBA", "MCA"]},
    {"name": "Hostel Fee (optional)", "type": "hostel", "amount": 65000, "frequency": "annual"},
    {"name": "Examination & Misc.", "type": "exam", "amount": 8000, "frequency": "annual"},
    {"name": "One-time Caution Deposit", "type": "caution", "amount": 10000, "frequency": "one_time"},
]

QUOTAS = [
    {"name": "MP State Quota", "percentage": 85, "description": "Reserved for Madhya Pradesh domicile candidates."},
    {"name": "All India Quota", "percentage": 10, "description": "Open to candidates across India."},
    {"name": "Management Quota", "percentage": 5, "description": "Direct admission via management quota — limited seats."},
]

FAQS = [
    ("application", "What is the application fee?", "₹1,200 (non-refundable). Payable online via the HDFC payment gateway."),
    ("application", "Is online application available year-round?", "B.Tech admissions open in May; PG programmes open in June. Refer to the timeline above for exact dates."),
    ("fees", "What is the total programme fee for B.Tech?", "₹95,000 per year × 4 years = ₹3,80,000 total. Hostel and exam fees are additional."),
    ("fees", "Are scholarships available?", "Yes — merit, sports and need-based scholarships are available. Contact the admissions office for details."),
    ("eligibility", "What is the eligibility for B.Tech?", "10+2 with 50% (45% for reserved) in PCM. Valid JEE Main score is preferred but not mandatory."),
    ("counselling", "When is the counselling held?", "Counselling rounds are held monthly from June to August at the Gwalior campus."),
]

TIMELINE = [
    {"year": 2026, "event": "B.Tech Application Opens", "kind": "announcement"},
    {"year": 2026, "event": "Early-bird Application Deadline", "kind": "deadline"},
    {"year": 2026, "event": "First Counselling Round", "kind": "round"},
    {"year": 2026, "event": "Final Admission Deadline", "kind": "deadline"},
    {"year": 2026, "event": "Orientation Programme", "kind": "announcement"},
]


def _ensure(db, model, key_func, items, builder):
    existing = {key_func(o) for o in db.scalars(select(model)).all()}
    n = 0
    for it in items:
        k = key_func(builder(it))
        if k in existing:
            continue
        db.add(builder(it))
        n += 1
    return n


def main() -> None:
    db = SessionLocal()
    try:
        steps = _ensure(db, AdmissionStep, lambda o: o.position, STEPS,
                        lambda s: AdmissionStep(**s))
        docs = _ensure(db, RequiredDocument, lambda o: o.name, DOCS,
                       lambda d: RequiredDocument(**d))
        cs = _ensure(db, AdmissionCounsellor, lambda o: o.email or o.name, COUNSELLORS,
                     lambda c: AdmissionCounsellor(**c))
        fees = _ensure(db, FeeComponent, lambda o: o.name, FEES,
                       lambda f: FeeComponent(**f))
        qs = _ensure(db, Quota, lambda o: o.name, QUOTAS,
                     lambda q: Quota(**q))
        faqs_existing = {(f.category, f.question) for f in db.scalars(select(AdmissionFAQ)).all()}
        fcount = 0
        for cat, q, a in FAQS:
            if (cat, q) in faqs_existing:
                continue
            db.add(AdmissionFAQ(category=cat, question=q, answer_md=a))
            fcount += 1
        tl = _ensure(db, AdmissionTimeline, lambda o: (o.year, o.event), TIMELINE,
                     lambda t: AdmissionTimeline(**t))

        # Defaults for notification routing
        for key, val in [
            ("admissions.notify_email", "admission@itmgoi.in"),
            ("forms.general.notify_email", "admission@itmgoi.in"),
            ("forms.grievance.notify_email", "grievance@itmgoi.in"),
            ("careers.notify_email", "hr@itmgoi.in"),
        ]:
            if not db.scalar(select(Setting).where(Setting.key == key)):
                db.add(Setting(key=key, value=val, group="notifications",
                               description="Default notification email"))

        db.commit()
        print(f"[seed-admissions] steps={steps}, docs={docs}, counsellors={cs}, fees={fees}, quotas={qs}, faqs={fcount}, timeline={tl}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
