from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel


class AuditEntry(BaseModel):
    id: int
    user_id: int | None
    action: str
    entity_type: str | None
    entity_id: str | None
    before: dict[str, Any] | None
    after: dict[str, Any] | None
    ip: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedAudit(BaseModel):
    total: int
    limit: int
    offset: int
    items: list[AuditEntry]
