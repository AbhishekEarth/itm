"""LangChain tools for the ITM Gwalior AI Assistant.
Each tool performs semantic search on indexed institutional data.
Also includes direct database query tools for faculty/HOD info."""
from __future__ import annotations

from langchain_core.tools import tool

from app.ai_agent.database import vector_db
from app.core.database import SessionLocal
from app.models.academics import Department, HodProfile, Faculty


def _search(query: str, filter_meta: dict[str, str] | None = None, k: int = 8) -> str:
    """Execute a semantic search and format the results."""
    results = vector_db.similarity_search(query, k=k, filter_metadata=filter_meta)

    if not results:
        category = filter_meta.get("category", "general") if filter_meta else "general"
        return f"No indexed content found for '{query}' in category '{category}'. The information may not be available in the knowledge base."

    # Filter out very-low-relevance results (score < 0.05)
    # With small collections, scores are naturally lower — keep most results
    relevant = [r for r in results if r.get("score", 0) >= 0.05]
    if not relevant:
        # Fall back to top results even if scores are low
        relevant = results[:3]

    formatted = []
    for r in relevant:
        content = r["content"].strip()
        source = r["metadata"].get("source", "Unknown")
        score = r.get("score", 0)
        formatted.append(f"[Source: {source} | Relevance: {score:.2f}]\n{content[:800]}")

    return "\n\n---\n\n".join(formatted)


@tool
def query_database(query: str) -> str:
    """Query the INSTITUTIONAL DATABASE for information about departments, faculty members,
    HODs (Heads of Department), their profiles, qualifications, contact details, and
    specialization. Use this tool FIRST for any faculty, HOD, or department query.

    Examples: 'hod of cse', 'faculty in it department', 'head of mechanical department',
    'professor detail', 'HOD contact', 'department info', 'who is Dr. Shiv Kumar Sharma'
    Accepts natural language queries about faculty, staff, and departments."""
    q = query.lower()
    db = SessionLocal()
    try:
        # ── Name-based search first ──
        # If the query reads like "who is <Name>" or contains a Title + Name pattern,
        # do a fuzzy name lookup across HODs and Faculty before falling back to dept code.
        import re as _re
        name_match = None
        m = _re.search(r"who\s+is\s+(?:dr\.?\s+|prof\.?\s+|mr\.?\s+|mrs\.?\s+|ms\.?\s+)?([a-z][a-z\.\s]{2,60})", q)
        if m:
            name_match = m.group(1).strip().rstrip("?.,!")
        else:
            # Bare "Shiv Kumar Sharma" without a "who is" prefix — only treat as a name
            # if no department/role keyword is present.
            dept_words = {"department", "hod", "head", "faculty", "professor", "staff", "lecturer", "teacher", "course", "intake", "lab"}
            if not any(w in q for w in dept_words):
                stripped = _re.sub(r"^(dr\.?|prof\.?|mr\.?|mrs\.?|ms\.?)\s+", "", q).strip().rstrip("?.,!")
                if 4 < len(stripped) < 60 and " " in stripped:
                    name_match = stripped

        if name_match:
            name_lower = name_match.lower()
            results: list[str] = []

            # Search across all HODs
            for h in db.query(HodProfile).all():
                if h.name and name_lower in h.name.lower():
                    dept = h.department
                    block = [f"## {h.name}"]
                    if h.role:
                        block.append(f"- **Designation:** {h.role}")
                    if dept:
                        block.append(f"- **Department:** {dept.name} ({dept.code})")
                    if h.qualification:
                        block.append(f"- **Qualification:** {h.qualification}")
                    if h.email:
                        block.append(f"- **Email:** {h.email}")
                    if h.phone:
                        block.append(f"- **Phone:** {h.phone}")
                    if h.research_area:
                        block.append(f"- **Research Area:** {h.research_area}")
                    block.append("- **Role at ITM:** Head of Department")
                    results.append("\n".join(block))

            # Search across all Faculty
            for f in db.query(Faculty).filter(Faculty.is_active == True).all():
                if f.name and name_lower in f.name.lower():
                    dept = f.department
                    block = [f"## {f.name}"]
                    if f.role:
                        block.append(f"- **Designation:** {f.role}")
                    if dept:
                        block.append(f"- **Department:** {dept.name} ({dept.code})")
                    if f.qualification:
                        block.append(f"- **Qualification:** {f.qualification}")
                    if f.specialization:
                        block.append(f"- **Specialization:** {f.specialization}")
                    if f.email:
                        block.append(f"- **Email:** {f.email}")
                    if f.phone:
                        block.append(f"- **Phone:** {f.phone}")
                    if f.bio_md:
                        block.append("")
                        block.append(f.bio_md[:600])
                    results.append("\n".join(block))

            if results:
                return "\n\n---\n\n".join(results)

        # Try to find a department code in the query
        dept_codes = {
            "cse": "CSE", "computer science": "CSE", "computer science and engineering": "CSE",
            "it": "IT", "information technology": "IT",
            "ece": "ECE", "electronics": "ECE", "electronics and communication": "ECE",
            "me": "ME", "mechanical": "ME",
            "ce": "CE", "civil": "CE", "civil engineering": "CE",
            "mba": "MBA", "management": "MBA", "business administration": "MBA",
            "esh": "ESH", "environmental science": "ESH",
        }
        matched_code = None
        for key, code in dept_codes.items():
            if key in q:
                matched_code = code
                break

        lines = []

        if matched_code:
            dept = db.query(Department).filter(Department.code == matched_code).first()
            if not dept:
                # Try fuzzy match across all departments
                all_depts = db.query(Department).all()
                for d in all_depts:
                    if matched_code.lower() in d.code.lower() or matched_code.lower() in d.name.lower():
                        dept = d
                        break

            if dept:
                lines.append(f"## {dept.name} ({dept.code})")
                if dept.established_year:
                    lines.append(f"- Established: {dept.established_year}")
                if dept.intake:
                    lines.append(f"- Intake: {dept.intake}")
                if dept.faculty_count:
                    lines.append(f"- Faculty Count: {dept.faculty_count}")
                if dept.affiliation:
                    lines.append(f"- Affiliation: {dept.affiliation}")
                if dept.contact:
                    contact = dept.contact
                    if isinstance(contact, dict):
                        phone = contact.get("phone", "")
                        email = contact.get("email", "")
                        if phone:
                            lines.append(f"- Contact Phone: {phone}")
                        if email:
                            lines.append(f"- Contact Email: {email}")

                # HOD info
                hod = dept.hod
                if hod:
                    lines.append("")
                    lines.append("### Head of Department (HOD)")
                    lines.append(f"- **Name:** {hod.name}")
                    if hod.role:
                        lines.append(f"- **Designation:** {hod.role}")
                    if hod.qualification:
                        lines.append(f"- **Qualification:** {hod.qualification}")
                    if hod.email:
                        lines.append(f"- **Email:** {hod.email}")
                    if hod.phone:
                        lines.append(f"- **Phone:** {hod.phone}")
                    if hod.research_area:
                        lines.append(f"- **Research Area:** {hod.research_area}")
                else:
                    lines.append("")
                    lines.append("*No HOD profile is currently listed for this department.*")

                # Faculty list
                faculty = dept.faculty
                if faculty:
                    lines.append("")
                    lines.append(f"### Faculty Members ({len(faculty)})")
                    for f in faculty[:15]:
                        parts = [f"- **{f.name}**"]
                        if f.role:
                            parts.append(f" — {f.role}")
                        if f.qualification:
                            parts.append(f" ({f.qualification})")
                        lines.append("".join(parts))
                    if len(faculty) > 15:
                        lines.append(f"  *...and {len(faculty) - 15} more faculty members*")

                return "\n".join(lines)
            else:
                all_depts = db.query(Department).all()
                dept_list = ', '.join(f"{d.code} - {d.name}" for d in all_depts)
                return f"Department with code '{matched_code}' was not found in the database. Available departments: {dept_list}"

        # If no department matched, search all departments
        if any(word in q for word in ["hod", "head of", "head of department", "who is"]):
            all_depts = db.query(Department).all()
            for dept in all_depts:
                if dept.hod:
                    h = dept.hod
                    lines.append(f"- **{dept.name}**: {h.name}")
                    if h.role:
                        lines[-1] += f" ({h.role})"
            if lines:
                return "### HODs of All Departments\n" + "\n".join(lines)

        # Search faculty directly
        if any(word in q for word in ["faculty", "professor", "teacher", "staff", "lecturer"]):
            faculty_list = db.query(Faculty).filter(Faculty.is_active == True).order_by(Faculty.department_id, Faculty.sort_order).limit(25).all()
            if faculty_list:
                for f in faculty_list:
                    dept_name = f.department.name if f.department else ""
                    lines.append(f"- **{f.name}** — {dept_name}")
                    if f.role:
                        lines[-1] += f" — {f.role}"
                    if f.qualification:
                        lines[-1] += f" — {f.qualification}"
                if lines:
                    return "### Faculty Members\n" + "\n".join(lines)

        return f"No matching data found in the institutional database for query: '{query}'. Try searching with different terms or use a specific department code (CSE, IT, ECE, ME, CE, MBA, ESH)."
    finally:
        db.close()


@tool
def search_knowledge_base(query: str, category: str = "general") -> str:
    """Search the institutional knowledge base for information.
    Categories available: faculty, courses, departments, admissions, fees, hostel, 
    placements, notices, events, pdf, lms, erp, syllabus, timetable, exam_updates, 
    contact_info, library, training_cell, innovation_cell, academic_calendar, general.
    Use this tool for all general information queries."""
    filter_meta = {"category": category} if category != "general" else None
    return _search(query, filter_meta)

# Aggregate all tools for the agent
ALL_TOOLS = [
    query_database,
    search_knowledge_base,
]
