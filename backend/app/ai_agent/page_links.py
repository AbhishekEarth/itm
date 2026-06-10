"""Registry of ITM Gwalior website routes used to suggest direct page links.

Every chatbot reply ends with a "Useful Links" section pointing the visitor at
the relevant routes on the SPA so they can land on the right page in one click.

The registry is intentionally redundant — multiple keywords can map to the same
page so phrasing variations like "fees" / "fee structure" / "scholarship" all
surface the admissions page.

Paths are returned as site-relative URLs (e.g. ``/admissions/ug``) which the
React Router will resolve when the chatbot is embedded in the SPA.
"""
from __future__ import annotations

import re
from collections import OrderedDict

# ── Registry ────────────────────────────────────────────────────────────────
# Each entry: keyword (lowercase substring match on the user question) ->
# list of (label, path). Order is preserved: more-specific keywords first.

_KEYWORD_LINKS: list[tuple[list[str], list[tuple[str, str]]]] = [
    # Admissions
    (
        ["how to apply", "how do i apply", "apply now", "apply online", "application form"],
        [
            ("How to Apply", "/admissions/how-to-apply"),
            ("Admissions Overview", "/admissions"),
        ],
    ),
    (
        ["ug course", "ug program", "b.tech", "btech", "bca", "bba", "undergraduate"],
        [
            ("UG Courses", "/admissions/ug"),
            ("Admissions Overview", "/admissions"),
        ],
    ),
    (
        ["pg course", "pg program", "m.tech", "mtech", "mca", "mba", "post graduate", "postgraduate"],
        [
            ("PG Courses", "/admissions/pg"),
            ("MBA Department", "/mba"),
        ],
    ),
    (
        ["admission", "admissions", "eligibility", "entrance", "counselling"],
        [
            ("Admissions Overview", "/admissions"),
            ("How to Apply", "/admissions/how-to-apply"),
        ],
    ),
    (
        ["fee", "fees", "fee structure", "tuition", "cost", "scholarship", "payment"],
        [
            ("Admissions Overview", "/admissions"),
            ("How to Apply", "/admissions/how-to-apply"),
        ],
    ),

    # Department-specific pages
    (["computer science", "cse", " cs "], [("CSE Department", "/cs")]),
    (["information technology", " it ", "it department"], [("IT Department", "/it")]),
    (["electronics", "ece", "communication"], [("ECE Department", "/ece")]),
    (["mechanical", " me ", "me department"], [("ME Department", "/me")]),
    (["civil", " ce ", "ce department"], [("CE Department", "/ce")]),
    (["mba", "business administration", "management"], [("MBA Department", "/mba")]),
    (["esh", "engineering sciences", "humanities", "chemistry", "physics", "math"], [("ESH Department", "/esh")]),
    (["aiml", "ai & ml", "ai/ml", "artificial intelligence", "machine learning"], [("AI & ML", "/aiml")]),
    (["cyber", "cyber security", "cybersecurity"], [("Cyber Security", "/cyber-security")]),
    (["cloud", "cloud computing", "aws", "azure"], [("Cloud Computing", "/cloud-computing")]),
    (["library", "central library", "books", "journals"], [("Central Library", "/library")]),
    (["emerging branch", "specialisation", "specialization"], [("Emerging Branches", "/emerging-branches")]),

    # Placements
    (
        ["placement", "placements", "package", "salary", "recruit", "recruiter", "company", "companies", "placed", "tap"],
        [
            ("Training & Placements", "/tap"),
        ],
    ),

    # Research
    (["research", "publications", "phd", "doctorate"], [("Research", "/research")]),
    (["r&d", "rd cell"], [("R&D Cell", "/research/rd-cell")]),
    (["innovation", "incubator", "ideapad", "startup"], [("Innovation Ecosystem", "/research/innovation-ecosystem")]),
    (["journal", "iijisem"], [("ITM International Journal", "/research/journal")]),
    (["conference", "itm ic"], [("International Conference", "/research/conference")]),
    (["fdp", "faculty development", "workshop"], [("FDP", "/research/fdp")]),

    # Campus Life / Clubs / Cells
    (["pac", "performing arts"], [("Performing Arts Club", "/pac")]),
    (["clubs", "club"], [("Clubs", "/clubs")]),
    (["nss"], [("NSS Cell", "/cells/nss")]),
    (["uba", "unnat bharat"], [("UBA Cell", "/cells/uba")]),
    (["sports", "athletic", "playground"], [("Sports Cell", "/cells/sports")]),
    (["wec", "women empowerment"], [("Women Empowerment Cell", "/cells/wec")]),

    # About / Officials / Leadership
    (["director", "principal", "dean"], [
        ("Director's Message", "/about/director-message"),
        ("ITM Officials", "/about/officials"),
    ]),
    (["officials", "leadership", "management team"], [("ITM Officials", "/about/officials")]),
    (["board of governors", "trustee", "trust"], [("Board of Governors", "/about/board-of-governors")]),
    (["mission", "vision"], [("Mission & Vision", "/about/mission-vision")]),
    (["about itm", "about institute", "history", "established"], [
        ("About Institute", "/about"),
        ("Mission & Vision", "/about/mission-vision"),
    ]),
    (["distinct", "best practice"], [
        ("Institute Distinctiveness", "/about/distinctiveness"),
        ("Best Practices", "/about/best-practices"),
    ]),
    (["programme", "programmes", "programs", "course catalog", "course catalogue"], [("Programmes Offered", "/about/programmes")]),
    (["infrastructure", "campus", "lab", "facility", "facilities"], [
        ("Infrastructure", "/about/infrastructure"),
        ("Gallery", "/gallery"),
    ]),
    (["magazine"], [("Student Magazine", "/about/magazine")]),
    (["policies", "policy", "privacy", "terms"], [("Policies & Reports", "/about/policies")]),
    (["gwalior"], [("What Gwalior Offers", "/about/gwalior")]),

    # Compliance / Accreditations / Rankings
    (["naac"], [("NAAC Policies", "/naac")]),
    (["nirf", "ranking"], [("NIRF Ranking", "/nirf")]),
    (["iqac"], [("IQAC", "/iqac")]),
    (["committee", "committees"], [("Committees", "/committees")]),
    (["mou", "collaboration"], [("MOUs & Collaborations", "/mous")]),
    (["appreciation", "recognition", "award"], [("Appreciation & Recognition", "/appreciation")]),
    (["careers", "job", "vacancy", "recruitment open"], [
        ("Careers", "/careers"),
        ("Open Positions", "/careers/open-positions"),
    ]),
    (["jrf", "junior research fellow"], [("Junior Research Fellow", "/jrf")]),
    (["anti-ragging", "ragging"], [("Anti-Ragging", "/anti-ragging")]),

    # Alumni
    (["alumni", "alumnus"], [
        ("Alumni Speaks", "/alumni/speaks"),
        ("Mentorship Program", "/alumni/mentorship"),
    ]),
    (["mentorship"], [("Mentorship Program", "/alumni/mentorship")]),
    (["membership"], [("Life Membership", "/alumni/membership")]),
    (["chapter", "chapters"], [("Alumni Chapters", "/alumni/chapters")]),

    # Gallery
    (["gallery", "photos", "pictures", "images"], [("Gallery", "/gallery")]),
    (["video", "videos"], [("Video Gallery", "/gallery/videos")]),

    # Contact / Misc
    (["contact", "phone", "email", "address", "location", "helpline"], [("Contact Us", "/contact")]),
]

# Default link per RAG category (the user's classified intent bucket).
# Used as a final fallback if no keyword matched.
_CATEGORY_DEFAULT: dict[str, list[tuple[str, str]]] = {
    "admissions": [("Admissions Overview", "/admissions"), ("How to Apply", "/admissions/how-to-apply")],
    "fees":       [("Admissions Overview", "/admissions")],
    "placements": [("Training & Placements", "/tap")],
    "training_cell": [("Training & Placements", "/tap")],
    "courses":    [("UG Courses", "/admissions/ug"), ("PG Courses", "/admissions/pg")],
    "syllabus":   [("Programmes Offered", "/about/programmes")],
    "hostel":     [("Infrastructure", "/about/infrastructure"), ("Contact Us", "/contact")],
    "library":    [("Central Library", "/library")],
    "events":     [("Gallery", "/gallery")],
    "notices":    [("Contact Us", "/contact")],
    "contact_info": [("Contact Us", "/contact")],
    "academic_calendar": [("About Institute", "/about")],
    "innovation_cell": [("Innovation Ecosystem", "/research/innovation-ecosystem")],
    "exam_updates": [("About Institute", "/about")],
    "general":    [("About Institute", "/about"), ("Admissions Overview", "/admissions")],
}


def _whole_word(text: str, keyword: str) -> bool:
    """Substring match that respects word boundaries for short keywords.

    `cs` / `it` / `me` / `ce` would over-match arbitrary text otherwise.
    Longer keywords (>=4 chars) use plain substring containment.
    """
    kw = keyword.strip()
    if len(kw) >= 4:
        return kw in text
    return bool(re.search(rf"(?<![a-z]){re.escape(kw)}(?![a-z])", text))


def suggest_links(
    question: str,
    category: str | None = None,
    *,
    limit: int = 4,
) -> list[tuple[str, str]]:
    """Return a deduplicated list of (label, path) tuples for ``question``.

    Always returns at least one link — either the category default or the
    "About Institute" fallback — so every assistant reply has something
    actionable.
    """
    q = f" {question.lower().strip()} "
    seen: "OrderedDict[str, str]" = OrderedDict()  # path -> label

    for keywords, links in _KEYWORD_LINKS:
        for kw in keywords:
            if _whole_word(q, kw):
                for label, path in links:
                    if path not in seen:
                        seen[path] = label
                break

    # Fold in the category-default last so question-specific links rank first.
    cat_defaults = _CATEGORY_DEFAULT.get((category or "general"), [])
    for label, path in cat_defaults:
        if path not in seen:
            seen[path] = label

    # Hard fallback — every reply gets a link to the home page.
    if not seen:
        seen["/"] = "ITM Gwalior Home"

    items = [(label, path) for path, label in seen.items()]
    return items[:limit]


def format_links_markdown(
    question: str,
    category: str | None = None,
    *,
    site_root: str = "",
    limit: int = 4,
) -> str:
    """Format suggested links as a Markdown bullet list.

    ``site_root`` is prepended to each path. Pass an empty string when the
    chatbot is embedded inside the SPA — React Router will handle the relative
    URL natively. Pass a full origin like ``https://www.itmgoi.in``
    when responses might be consumed outside the app.
    """
    links = suggest_links(question, category, limit=limit)
    if not links:
        return ""
    lines = ["", "---", "", "🔗 **Useful Pages**"]
    for label, path in links:
        href = f"{site_root.rstrip('/')}{path}" if site_root else path
        lines.append(f"- [{label}]({href})")
    return "\n".join(lines)
