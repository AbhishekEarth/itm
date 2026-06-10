"""Scope registry + FastAPI dependencies for RBAC."""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class ScopeDef:
    key: str
    label: str
    description: str


# Canonical registry. Adding a new editor role = append here + run seed.
SCOPES: tuple[ScopeDef, ...] = (
    # site-wide
    ScopeDef("site.settings", "Site Settings", "Logo, theme, footer, social links, contact, default SEO"),
    ScopeDef("site.pages", "Pages", "Page metadata + arbitrary page sections"),
    ScopeDef("site.navigation", "Navigation", "Header / footer menus"),
    # departments
    ScopeDef("dept.cse", "CSE Department", "Edit CS Department page, faculty, labs, projects"),
    ScopeDef("dept.ece", "ECE Department", "Edit ECE Department"),
    ScopeDef("dept.it", "IT Department", "Edit IT Department"),
    ScopeDef("dept.ce", "Civil Department", "Edit CE Department"),
    ScopeDef("dept.me", "Mechanical Department", "Edit ME Department"),
    ScopeDef("dept.mba", "MBA Department", "Edit MBA Department + specialisations + consultancy"),
    ScopeDef("dept.esh", "ESH Department", "Edit Engineering Sciences & Humanities"),
    # emerging branches — seeded as proper Department rows so they share the
    # same dept.* scope pattern as CSE/IT/ECE. The legacy `emerging.*` keys
    # below remain for backwards compatibility with older grants.
    ScopeDef("dept.aiml", "AI & ML Department", "Edit AI & ML (emerging branch) department page"),
    ScopeDef("dept.cyber", "Cyber Security Department", "Edit Cyber Security (emerging branch) department page"),
    ScopeDef("dept.cloud", "Cloud Computing Department", "Edit Cloud Computing (emerging branch) department page"),
    ScopeDef("dept.data", "Data Science Department", "Edit Data Science (CSE specialisation) department page"),
    ScopeDef("dept.mca", "MCA Programme", "Edit MCA programme page"),
    ScopeDef("dept.bba", "BBA Programme", "Edit BBA programme page"),
    ScopeDef("dept.bca", "BCA Programme", "Edit BCA programme page"),
    ScopeDef("emerging.aiml", "AI / ML page (legacy)", "Edit AI-ML page (use dept.aiml instead)"),
    ScopeDef("emerging.cyber", "Cyber Security page (legacy)", "Edit Cyber Security page (use dept.cyber instead)"),
    ScopeDef("emerging.cloud", "Cloud Computing page (legacy)", "Edit Cloud Computing page (use dept.cloud instead)"),
    ScopeDef("library", "Central Library", "Edit Library page"),
    # admissions
    ScopeDef("admissions.content", "Admissions Content", "Programmes, fees, FAQs, counsellors, timeline"),
    ScopeDef("admissions.leads", "Admission Leads", "Read & manage inquiry submissions"),
    # placements / TAP
    ScopeDef("placements.tap", "Placement Cell (TAP)", "TAP team, services, MoUs, events, recruiters, placement records"),
    # research
    ScopeDef("research.rdcell", "R&D Cell", "R&D Cell vision/mission/offerings/policies"),
    ScopeDef("research.publications", "Publications", "Year-wise publications + books & chapters"),
    ScopeDef("research.journal", "Journal", "Journal page content"),
    ScopeDef("research.conference", "Conference", "Conferences + papers"),
    ScopeDef("research.fdp", "FDP", "Faculty development programmes"),
    ScopeDef("research.innovation", "Innovation Ecosystem", "Innovation page"),
    # events / clubs
    ScopeDef("events.pac", "PAC Events", "Performing Arts Club events"),
    ScopeDef("events.cultural", "Cultural Events", "KRONOS / cultural events"),
    ScopeDef("clubs.nss", "NSS", "NSS page + activities"),
    ScopeDef("clubs.uba", "UBA", "Unnat Bharat Abhiyan"),
    ScopeDef("clubs.wec", "WEC", "Women Empowerment Cell"),
    ScopeDef("clubs.sports", "Sports", "Sports cell"),
    ScopeDef("clubs.iqac", "IQAC", "IQAC page"),
    ScopeDef("clubs.anti_ragging", "Anti-Ragging", "Anti-ragging cell"),
    ScopeDef("clubs.other", "Other Clubs", "Other clubs page"),
    # alumni
    ScopeDef("alumni.speaks", "Alumni Speaks", "Alumni testimonials"),
    ScopeDef("alumni.chapters", "Alumni Chapters", "City chapters"),
    ScopeDef("alumni.mentorship", "Alumni Mentorship", "Mentorship programme"),
    ScopeDef("alumni.membership", "Alumni Membership", "Membership page"),
    # gallery
    ScopeDef("gallery", "Gallery", "All gallery categories, photos, videos"),
    # compliance
    ScopeDef("compliance.naac", "NAAC", "NAAC docs + grade"),
    ScopeDef("compliance.nirf", "NIRF", "NIRF rankings"),
    ScopeDef("compliance.committees", "Committees", "Committees / MoUs"),
    ScopeDef("compliance.policies", "Policies", "Policy PDFs"),
    # careers
    ScopeDef("careers.positions", "Open Positions", "Job postings"),
    ScopeDef("careers.applications", "Applications", "Read/triage applications"),
    ScopeDef("careers.jrf", "JRF Postings", "JRF research postings"),
    # notices / forms
    ScopeDef("notices", "Notices & Announcements", "Notice board"),
    ScopeDef("forms.contact", "Contact Inbox", "Contact form submissions"),
    ScopeDef("forms.grievance", "Grievance Inbox", "Grievance form submissions"),
    # cross-cutting (Phase 1 additions)
    ScopeDef("seo.edit", "SEO / Meta", "Per-page title, description, og:image, canonical, robots, schema"),
    ScopeDef("analytics.view", "Analytics", "Read admin analytics summary"),
    ScopeDef("blog.posts", "Blog Posts", "Create, edit, and publish blog posts"),
    # system
    ScopeDef("users.manage", "Manage Users", "Create/edit/disable editors (super-admin)"),
    ScopeDef("audit.read", "Audit Log", "Read audit log"),
    ScopeDef("backups.run", "Backups", "Trigger DB backup"),
)

SCOPE_KEYS: frozenset[str] = frozenset(s.key for s in SCOPES)


def is_known_scope(key: str) -> bool:
    return key in SCOPE_KEYS
