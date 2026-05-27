from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import require
from app.models import AuditLog
from app.schemas.audit import AuditEntry, PaginatedAudit

router = APIRouter(prefix="/audit", tags=["audit"])


@router.get("", response_model=PaginatedAudit, dependencies=[Depends(require("audit.read"))])
def list_audit(
    db: Session = Depends(get_db),
    user_id: int | None = Query(None),
    entity_type: str | None = Query(None),
    entity_id: str | None = Query(None),
    action: str | None = Query(None),
    since: datetime | None = Query(None),
    until: datetime | None = Query(None),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    stmt = select(AuditLog)
    if user_id is not None:
        stmt = stmt.where(AuditLog.user_id == user_id)
    if entity_type:
        stmt = stmt.where(AuditLog.entity_type == entity_type)
    if entity_id:
        stmt = stmt.where(AuditLog.entity_id == entity_id)
    if action:
        stmt = stmt.where(AuditLog.action == action)
    if since:
        stmt = stmt.where(AuditLog.created_at >= since)
    if until:
        stmt = stmt.where(AuditLog.created_at <= until)

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = db.scalars(
        stmt.order_by(AuditLog.created_at.desc()).limit(limit).offset(offset)
    ).all()
    return PaginatedAudit(
        total=total,
        limit=limit,
        offset=offset,
        items=[AuditEntry.model_validate(r) for r in rows],
    )
