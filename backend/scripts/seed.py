"""Idempotent seed:
- inserts all scopes from app.core.rbac.SCOPES
- creates the default super-admin if no super-admin exists
- creates a sample faculty + student + scoped editor for end-to-end Login.jsx testing

Run: `python -m scripts.seed`  (from inside backend/)
"""
from __future__ import annotations

from sqlalchemy import select

from app.core.config import settings
from app.core.database import SessionLocal
from app.core.rbac import SCOPES
from app.core.security import hash_password
from app.models import Scope, User, UserScope


def seed_scopes() -> int:
    db = SessionLocal()
    inserted = 0
    try:
        existing = {s for s in db.scalars(select(Scope.key))}
        for sd in SCOPES:
            if sd.key in existing:
                continue
            db.add(Scope(key=sd.key, label=sd.label, description=sd.description))
            inserted += 1
        if inserted:
            db.commit()
        return inserted
    finally:
        db.close()


def ensure_super_admin() -> bool:
    db = SessionLocal()
    try:
        if db.scalar(select(User).where(User.role == "super_admin")):
            return False
        user = User(
            username=settings.DEFAULT_ADMIN_USERNAME,
            email=settings.DEFAULT_ADMIN_EMAIL,
            full_name="Default Super Admin",
            role="super_admin",
            password_hash=hash_password(settings.DEFAULT_ADMIN_PASSWORD),
            is_active=True,
            must_change_password=True,
        )
        db.add(user)
        db.commit()
        return True
    finally:
        db.close()


SAMPLE_USERS = [
    {
        "username": "ITM2022CS001",
        "email": "ITM2022CS001@itmgoi.in",
        "full_name": "Sample Student",
        "role": "student",
        "password": "ITM2022CS001",
        "must_change_password": False,
    },
    {
        "username": "faculty@itmgoi.in",
        "email": "faculty@itmgoi.in",
        "full_name": "Sample Faculty",
        "role": "faculty",
        "password": "faculty@123",
        "must_change_password": False,
    },
    {
        "username": "cs_editor",
        "email": "cs-editor@itmgoi.in",
        "full_name": "CS Department Editor",
        "role": "editor",
        "password": "cs-editor@123",
        "must_change_password": True,
        "scopes": ["dept.cse"],
    },
    {
        "username": "placement_editor",
        "email": "placement-editor@itmgoi.in",
        "full_name": "Placement Cell Editor",
        "role": "editor",
        "password": "placement@123",
        "must_change_password": True,
        "scopes": ["placements.tap"],
    },
]


def ensure_sample_users() -> int:
    db = SessionLocal()
    created = 0
    try:
        for u in SAMPLE_USERS:
            if db.scalar(select(User).where(User.username == u["username"])):
                continue
            user = User(
                username=u["username"],
                email=u["email"],
                full_name=u["full_name"],
                role=u["role"],
                password_hash=hash_password(u["password"]),
                is_active=True,
                must_change_password=u.get("must_change_password", False),
            )
            db.add(user)
            db.flush()
            for key in u.get("scopes", []):
                s = db.scalar(select(Scope).where(Scope.key == key))
                if s:
                    db.add(UserScope(user_id=user.id, scope_id=s.id))
            created += 1
        if created:
            db.commit()
        return created
    finally:
        db.close()


def main() -> None:
    from scripts import (
        seed_admissions,
        seed_cms,
        seed_compliance,
        seed_events,
        seed_placements,
        seed_research,
    )

    n = seed_scopes()
    created_admin = ensure_super_admin()
    sample = ensure_sample_users()
    print(f"[seed] scopes inserted: {n}")
    if created_admin:
        print(
            f"[seed] super-admin created  username={settings.DEFAULT_ADMIN_USERNAME}  "
            f"password={settings.DEFAULT_ADMIN_PASSWORD}  -- CHANGE on first login"
        )
    else:
        print("[seed] super-admin already exists")
    print(f"[seed] sample users inserted: {sample}")
    seed_cms.main()
    # Import departments from the JS data source (best-effort: needs Node).
    try:
        from scripts import import_departments

        import_departments.main()
    except SystemExit as e:
        print(f"[seed] department import skipped: {e}")
    except Exception as e:  # noqa: BLE001 - we want broad fallback in seed
        print(f"[seed] department import failed: {e}")
    seed_placements.main()
    seed_research.main()
    seed_events.main()
    seed_admissions.main()
    seed_compliance.main()


if __name__ == "__main__":
    main()
