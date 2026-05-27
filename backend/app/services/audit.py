from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from app.core.cache import cache
from app.models import AuditLog

# Map entity_type → cache tags that should be invalidated when it changes.
_INVALIDATION_MAP: dict[str, list[str]] = {
    "page": ["public", "pages"],
    "page_section": ["public", "pages"],
    "setting": ["public", "settings"],
    "department": ["public", "departments"],
    "hod_profile": ["public", "departments"],
    "faculty": ["public", "departments"],
    "lab": ["public", "departments"],
    "partner": ["public", "departments"],
    "project": ["public", "departments"],
    "award": ["public", "departments"],
    "recruiter": ["public", "placements"],
    "recruiter_category": ["public", "placements"],
    "placement_record": ["public", "placements"],
    "placement_stat": ["public", "placements"],
    "tap_team_member": ["public", "placements"],
    "tap_service": ["public", "placements"],
    "mou": ["public", "placements", "compliance"],
    "testimonial": ["public", "placements"],
    "tap_event": ["public", "placements"],
    "focus_area": ["public", "research"],
    "publication": ["public", "research"],
    "book": ["public", "research"],
    "patent": ["public", "research"],
    "journal": ["public", "research"],
    "conference": ["public", "research"],
    "paper": ["public", "research"],
    "fdp": ["public", "research"],
    "fdp_session": ["public", "research"],
    "policy": ["public", "research", "compliance"],
    "club": ["public", "clubs", "events"],
    "event": ["public", "events"],
    "notice": ["public", "notices"],
    "announcement": ["public", "notices"],
    "gallery_category": ["public", "gallery"],
    "gallery_item": ["public", "gallery"],
    "video": ["public", "gallery"],
    "admission_step": ["public", "admissions"],
    "required_document": ["public", "admissions"],
    "admission_counsellor": ["public", "admissions"],
    "fee_component": ["public", "admissions"],
    "quota": ["public", "admissions"],
    "admission_faq": ["public", "admissions"],
    "admission_timeline": ["public", "admissions"],
    "open_position": ["public", "careers"],
    "jrf": ["public", "careers"],
    "naac_document": ["public", "compliance"],
    "nirf_record": ["public", "compliance"],
    "committee_member": ["public", "compliance"],
    "board_member": ["public", "people"],
    "official": ["public", "people"],
    "alumni_profile": ["public", "alumni"],
    "alumni_chapter": ["public", "alumni"],
    "alumni_mentorship": ["public", "alumni"],
}


def record(
    db: Session,
    *,
    user_id: int | None,
    action: str,
    entity_type: str | None = None,
    entity_id: str | int | None = None,
    before: dict[str, Any] | None = None,
    after: dict[str, Any] | None = None,
    ip: str | None = None,
) -> None:
    db.add(
        AuditLog(
            user_id=user_id,
            action=action,
            entity_type=entity_type,
            entity_id=str(entity_id) if entity_id is not None else None,
            before=before,
            after=after,
            ip=ip,
        )
    )
    db.commit()
    tags = _INVALIDATION_MAP.get(entity_type or "", [])
    if tags:
        try:
            cache.invalidate_tags(*tags)
        except Exception:
            pass
