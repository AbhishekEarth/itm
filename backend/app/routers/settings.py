from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import NotFoundError
from app.deps import get_current_user, require
from app.models import Setting, User
from app.schemas.cms import SettingIn, SettingOut
from app.services import audit

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=list[SettingOut], dependencies=[Depends(get_current_user)])
def list_settings(group: str | None = Query(None), db: Session = Depends(get_db)):
    stmt = select(Setting)
    if group:
        stmt = stmt.where(Setting.group == group)
    return [SettingOut.model_validate(s) for s in db.scalars(stmt.order_by(Setting.key)).all()]


@router.get("/{key:path}", response_model=SettingOut, dependencies=[Depends(get_current_user)])
def get_setting(key: str, db: Session = Depends(get_db)):
    s = db.get(Setting, key)
    if not s:
        raise NotFoundError("Setting not found")
    return SettingOut.model_validate(s)


@router.put("/{key:path}", response_model=SettingOut, dependencies=[Depends(require("site.settings"))])
def upsert_setting(
    key: str,
    body: SettingIn,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    existing = db.get(Setting, key)
    before = existing.value if existing else None
    if existing:
        existing.value = body.value
        if body.group is not None:
            existing.group = body.group
        if body.description is not None:
            existing.description = body.description
        existing.updated_by_user_id = actor.id
    else:
        existing = Setting(
            key=key,
            value=body.value,
            group=body.group,
            description=body.description,
            updated_by_user_id=actor.id,
        )
        db.add(existing)
    db.commit()
    db.refresh(existing)
    audit.record(
        db,
        user_id=actor.id,
        action="setting.update",
        entity_type="setting",
        entity_id=key,
        before={"value": before},
        after={"value": body.value},
        ip=request.client.host if request.client else None,
    )
    return SettingOut.model_validate(existing)


@router.delete("/{key:path}", status_code=204, dependencies=[Depends(require("site.settings"))])
def delete_setting(
    key: str,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    s = db.get(Setting, key)
    if not s:
        raise NotFoundError("Setting not found")
    before = s.value
    db.delete(s)
    db.commit()
    audit.record(
        db,
        user_id=actor.id,
        action="setting.delete",
        entity_type="setting",
        entity_id=key,
        before={"value": before},
        ip=request.client.host if request.client else None,
    )
