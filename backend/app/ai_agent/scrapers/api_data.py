"""Scraper that fetches data from backend API endpoints.

Instead of scraping the React SPA (empty HTML shells) or the old PHP site (stale data),
this calls the FastAPI backend endpoints directly to get structured JSON data.
"""
from __future__ import annotations

import json
import logging
from typing import Any

import httpx

from app.ai_agent.scrapers.base import BaseScraper

logger = logging.getLogger("ai-agent.api-data")

# Backend API base URLs to try. The first entry hits the service on its own
# localhost (works inside Cloud Run where gunicorn binds 8080, and inside the
# Hugging Face Space which used 7860). Fall back to the well-known dev port.
BACKEND_URLS = [
    "http://localhost:8080",
    "http://localhost:7860",
    "http://localhost:8000",
]

# Public API endpoints to fetch data from. Tuned to match the actual public
# routes exposed by app/routers/public.py so the RAG sees real ITM content.
API_ENDPOINTS = [
    # About / Leadership
    {"path": "/api/public/about/officials", "category": "general", "label": "Officials"},
    {"path": "/api/public/about/board", "category": "general", "label": "Board of Governors"},
    {"path": "/api/public/home", "category": "general", "label": "Homepage Sections"},
    {"path": "/api/public/settings", "category": "general", "label": "Site Settings"},

    # Departments (all + per-dept detail loop in code below)
    {"path": "/api/public/departments", "category": "departments", "label": "Departments"},

    # Admissions / Fees / Timeline
    {"path": "/api/public/admissions", "category": "admissions", "label": "Admissions"},

    # Placements & Recruiters
    {"path": "/api/public/recruiters", "category": "placements", "label": "Recruiters"},
    {"path": "/api/public/tap", "category": "placements", "label": "Training & Placements"},

    # Research
    {"path": "/api/public/research/rdcell", "category": "general", "label": "R&D Cell"},
    {"path": "/api/public/research/journal", "category": "general", "label": "ITM Journal"},
    {"path": "/api/public/research/conferences", "category": "events", "label": "Conferences"},
    {"path": "/api/public/research/fdps", "category": "events", "label": "FDPs"},
    {"path": "/api/public/research/patents", "category": "general", "label": "Patents"},

    # Compliance / Rankings
    {"path": "/api/public/compliance/naac", "category": "general", "label": "NAAC"},
    {"path": "/api/public/compliance/nirf", "category": "general", "label": "NIRF Ranking"},
    {"path": "/api/public/compliance/committees", "category": "general", "label": "Committees"},

    # Campus Life / Events / Notices
    {"path": "/api/public/clubs", "category": "general", "label": "Clubs & Cells"},
    {"path": "/api/public/events", "category": "events", "label": "Events"},
    {"path": "/api/public/notices", "category": "notices", "label": "Notices"},
    {"path": "/api/public/announcements", "category": "notices", "label": "Announcements"},

    # Alumni
    {"path": "/api/public/alumni/speaks", "category": "general", "label": "Alumni Speaks"},
    {"path": "/api/public/alumni/chapters", "category": "general", "label": "Alumni Chapters"},

    # Careers
    {"path": "/api/public/careers/positions", "category": "general", "label": "Open Positions"},
    {"path": "/api/public/careers/jrf", "category": "general", "label": "JRF"},
]


class APIDataScraper(BaseScraper):
    """Fetches data from backend API endpoints and indexes it."""

    def __init__(self):
        super().__init__()

    async def _find_working_url(self) -> str | None:
        """Find a working backend URL."""
        async with httpx.AsyncClient(timeout=5) as client:
            for base_url in BACKEND_URLS:
                try:
                    resp = await client.get(f"{base_url}/")
                    if resp.status_code == 200:
                        logger.info(f"Backend found at {base_url}")
                        return base_url
                except Exception:
                    continue
        return None

    async def scrape(self) -> list[dict[str, Any]]:
        """Fetch data from backend API and return indexable chunks."""
        results = []

        base_url = await self._find_working_url()
        if not base_url:
            logger.warning("No backend URL reachable — skipping API data indexing")
            return results

        async with httpx.AsyncClient(timeout=20) as client:
            # ── 1. Fetch every listed top-level endpoint ───────────────
            for endpoint in API_ENDPOINTS:
                url = f"{base_url}{endpoint['path']}"
                try:
                    resp = await client.get(url)
                    if resp.status_code != 200:
                        logger.debug(f"SKIP {url} → {resp.status_code}")
                        continue

                    data = resp.json()
                    chunks = self._format_response(endpoint, data)
                    results.extend(chunks)
                    logger.info(f"Fetched {endpoint['label']}: {len(chunks)} chunks")

                except Exception as e:
                    logger.warning(f"Failed to fetch {url}: {e}")

            # ── 2. Per-department deep-dive — pulls HoD + faculty + labs ──
            # The list endpoint only returns thumbnails. To index Dr. Shiv Kumar
            # Sharma, Dr. Rishi Soni, etc. we need /api/public/department/{code}.
            try:
                list_resp = await client.get(f"{base_url}/api/public/departments")
                if list_resp.status_code == 200:
                    dept_list = list_resp.json()
                    if isinstance(dept_list, list):
                        for dept in dept_list:
                            code = dept.get("code")
                            if not code:
                                continue
                            try:
                                detail_resp = await client.get(f"{base_url}/api/public/department/{code}")
                                if detail_resp.status_code != 200:
                                    continue
                                detail = detail_resp.json()
                                chunks = self._department_to_chunks(detail)
                                results.extend(chunks)
                                logger.info(f"Fetched Department {code}: {len(chunks)} chunks")
                            except Exception as e:
                                logger.warning(f"Failed dept {code}: {e}")
            except Exception as e:
                logger.warning(f"Department enumeration failed: {e}")

        return results

    def _department_to_chunks(self, dept: dict) -> list[dict[str, Any]]:
        """Turn a single department detail payload into many indexable chunks.

        We emit one chunk per logical entity (HoD, faculty member, lab, etc.)
        so semantic search can return precise hits on a person's name.
        """
        chunks: list[dict[str, Any]] = []
        code = dept.get("code") or dept.get("short") or ""
        name = dept.get("name") or code
        sub_path = dept.get("subPath") or f"/{code.lower()}"
        site = "https://itm-gwalior.vercel.app"
        url = f"{site}{sub_path}"

        # Overview
        overview_parts = [f"## {name} ({code}) — Department Overview"]
        for key, label in [
            ("established", "Established"),
            ("intake", "B.Tech Intake"),
            ("duration", "Programme Duration"),
            ("facultyCount", "Faculty Count"),
            ("affiliation", "Affiliation"),
            ("badge", "Status"),
            ("subtitle", "Tagline"),
        ]:
            v = dept.get(key)
            if v:
                overview_parts.append(f"- **{label}:** {v}")
        if dept.get("intro"):
            overview_parts.append("")
            overview_parts.append(dept["intro"])
        chunks.append({
            "text": "\n".join(overview_parts),
            "metadata": {"category": "departments", "source": f"api:Department:{code}", "url": url, "department": code},
        })

        # HoD profile
        hod = dept.get("hod") or {}
        if hod and hod.get("name"):
            hod_parts = [
                f"## Head of Department — {name} ({code})",
                f"**Name:** {hod.get('name')}",
            ]
            for key, label in [
                ("role", "Designation"),
                ("qualification", "Qualification"),
                ("email", "Email"),
                ("phone", "Phone"),
            ]:
                v = hod.get(key)
                if v:
                    hod_parts.append(f"- **{label}:** {v}")
            if hod.get("message"):
                hod_parts.append("")
                hod_parts.append(f"_Message from HoD:_ {hod['message']}")
            chunks.append({
                "text": "\n".join(hod_parts),
                "metadata": {"category": "faculty", "source": f"api:HoD:{code}", "url": url, "department": code, "person": hod.get("name")},
            })

        # Faculty members — one chunk per person for precise name matching
        for f in (dept.get("facultyHighlights") or []):
            person_name = f.get("name")
            if not person_name:
                continue
            f_parts = [
                f"## Faculty — {name} ({code})",
                f"**Name:** {person_name}",
            ]
            if f.get("role"):
                f_parts.append(f"- **Designation:** {f['role']}")
            if f.get("qual"):
                f_parts.append(f"- **Qualification & Experience:** {f['qual']}")
            chunks.append({
                "text": "\n".join(f_parts),
                "metadata": {"category": "faculty", "source": f"api:Faculty:{code}:{person_name}", "url": url, "department": code, "person": person_name},
            })

        # Laboratories
        for lab in (dept.get("labs") or []):
            lab_name = lab.get("name")
            if not lab_name:
                continue
            text = f"## Laboratory — {name} ({code})\n**Lab:** {lab_name}"
            if lab.get("desc"):
                text += f"\n{lab['desc']}"
            chunks.append({
                "text": text,
                "metadata": {"category": "departments", "source": f"api:Lab:{code}:{lab_name}", "url": url, "department": code},
            })

        # Placement summary
        plc = dept.get("placement") or {}
        if plc:
            plc_parts = [f"## Placement — {name} ({code})"]
            if plc.get("desc"):
                plc_parts.append(plc["desc"])
            for stat in (plc.get("stats") or []):
                if stat.get("label") and stat.get("value"):
                    plc_parts.append(f"- **{stat['label']}:** {stat['value']}")
            recs = plc.get("recruiters") or []
            if recs:
                plc_parts.append(f"- **Top Recruiters:** {', '.join(recs)}")
            chunks.append({
                "text": "\n".join(plc_parts),
                "metadata": {"category": "placements", "source": f"api:Placement:{code}", "url": url, "department": code},
            })

        # Vision / Mission / Accreditations
        misc_parts = []
        if dept.get("vision"):
            misc_parts.append(f"### {code} Vision\n{dept['vision']}")
        if dept.get("mission"):
            misc_parts.append("### " + code + " Mission\n" + "\n".join(f"- {m}" for m in dept["mission"]))
        if dept.get("accreditations"):
            misc_parts.append("### " + code + " Accreditations\n" + ", ".join(dept["accreditations"]))
        if misc_parts:
            chunks.append({
                "text": "\n\n".join(misc_parts),
                "metadata": {"category": "departments", "source": f"api:Vision:{code}", "url": url, "department": code},
            })

        # Contact
        contact = dept.get("contact") or {}
        if contact:
            contact_text = f"## Contact — {name} ({code})"
            if contact.get("phone"):
                contact_text += f"\n- **Phone:** {contact['phone']}"
            if contact.get("email"):
                contact_text += f"\n- **Email:** {contact['email']}"
            chunks.append({
                "text": contact_text,
                "metadata": {"category": "contact_info", "source": f"api:Contact:{code}", "url": url, "department": code},
            })

        return chunks

    def _format_response(self, endpoint: dict, data: Any) -> list[dict[str, Any]]:
        """Convert API JSON response into indexable text chunks."""
        chunks = []
        label = endpoint["label"]
        category = endpoint["category"]

        if isinstance(data, list):
            # Array of items (officials, departments, etc.)
            for item in data:
                text = self._item_to_text(item, label)
                if text and len(text) > 20:
                    chunks.append({
                        "text": text,
                        "metadata": {"category": category, "source": f"api:{label}", "url": f"https://itm-gwalior.vercel.app"},
                    })
        elif isinstance(data, dict):
            # Single object or wrapped response
            items = data.get("items") or data.get("data") or data.get("results") or [data]
            if isinstance(items, list):
                for item in items:
                    text = self._item_to_text(item, label)
                    if text and len(text) > 20:
                        chunks.append({
                            "text": text,
                            "metadata": {"category": category, "source": f"api:{label}", "url": f"https://itm-gwalior.vercel.app"},
                        })
            else:
                text = self._item_to_text(items, label)
                if text and len(text) > 20:
                    chunks.append({
                        "text": text,
                        "metadata": {"category": category, "source": f"api:{label}", "url": f"https://itm-gwalior.vercel.app"},
                    })

        return chunks

    def _item_to_text(self, item: Any, label: str) -> str:
        """Convert a single API item into readable text."""
        if not isinstance(item, dict):
            return str(item) if item else ""

        parts = []

        # Common fields
        name = item.get("name") or item.get("title") or ""
        role = item.get("role") or item.get("designation") or item.get("position") or ""
        dept = item.get("department") or item.get("dept") or ""
        qual = item.get("qualification") or item.get("qual") or ""
        email = item.get("email") or ""
        phone = item.get("phone") or item.get("mobile") or ""
        bio = item.get("bio") or item.get("description") or item.get("about") or ""

        if name:
            line = f"**{name}**"
            if role:
                line += f" — {role}"
            if dept:
                line += f", {dept}"
            parts.append(line)

        if qual:
            parts.append(f"Qualification: {qual}")
        if email:
            parts.append(f"Email: {email}")
        if phone:
            parts.append(f"Phone: {phone}")
        if bio:
            parts.append(bio[:400])

        # Department-specific fields
        code = item.get("code") or ""
        if code and name:
            parts.insert(0, f"## {name} ({code})")

        intake = item.get("intake") or ""
        if intake:
            parts.append(f"Intake: {intake}")

        established = item.get("established_year") or item.get("established") or ""
        if established:
            parts.append(f"Established: {established}")

        # Placement fields
        avg_lpa = item.get("average_lpa") or item.get("avg_package") or ""
        high_lpa = item.get("highest_lpa") or item.get("highest_package") or ""
        if avg_lpa:
            parts.append(f"Average Package: {avg_lpa} LPA")
        if high_lpa:
            parts.append(f"Highest Package: {high_lpa} LPA")

        return "\n".join(parts) if parts else ""
