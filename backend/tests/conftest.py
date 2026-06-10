from __future__ import annotations

import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_itm.db")
os.environ.setdefault("JWT_SECRET", "test-secret-do-not-use-in-prod")
os.environ.setdefault("ENV", "development")
os.environ.setdefault("REDIS_URL", "memory://")
# Loosen rate limit during tests
os.environ.setdefault("RATE_LIMIT_AUTH", "1000/minute")
os.environ.setdefault("RATE_LIMIT_DEFAULT", "10000/minute")
os.environ.setdefault("LOGIN_LOCKOUT_THRESHOLD", "3")

import pytest
from fastapi.testclient import TestClient

from app.core.database import SessionLocal, engine
from app.main import app
from app.models import Base, LoginAttempt
from scripts.seed import ensure_sample_users, ensure_super_admin, seed_scopes
from scripts.seed_cms import ensure_home_page, ensure_settings


def _seed_test_departments() -> None:
    """Insert a minimal CSE and ECE row so tests don't depend on Node + the JS file."""
    from app.core.database import SessionLocal
    from app.models import Department, Faculty, HodProfile, Laboratory

    db = SessionLocal()
    try:
        for code, scope, name in [
            ("CSE", "dept.cse", "Computer Science & Engineering"),
            ("ECE", "dept.ece", "Electronics & Communication Engineering"),
        ]:
            existing = db.query(Department).filter(Department.code == code).first()
            if existing:
                continue
            d = Department(
                code=code,
                name=name,
                short_name=code,
                page_path=f"/{code.lower()}",
                established_year=1997,
                intake=120,
                duration="4 Years",
                accent_solid="#800000",
                icon="💻",
                badge="Test Badge",
                subtitle="Test subtitle",
                intro_md="Test intro",
                vision="A vision.",
                mission=["m1", "m2"],
                peos=["peo1"],
                psos=["pso1"],
                scope_key=scope,
                slug=code.lower(),
                meta_title=f"{name} — ITM",
                meta_description="x",
                is_published=True,
            )
            db.add(d)
            db.flush()
            db.add(HodProfile(department_id=d.id, name=f"Dr. HoD {code}", message_md="welcome"))
            db.add(Faculty(department_id=d.id, name="Dr. Alpha", role="Professor", sort_order=0))
            db.add(Laboratory(department_id=d.id, name="Test Lab", icon="🧪", description="Test"))
        db.commit()
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def _bootstrap_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_scopes()
    ensure_super_admin()
    ensure_sample_users()
    ensure_settings()
    ensure_home_page()
    _seed_test_departments()
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client():
    return TestClient(app)


@pytest.fixture(autouse=True)
def _clear_login_attempts():
    """Stop lockout state leaking between tests."""
    s = SessionLocal()
    try:
        s.query(LoginAttempt).delete()
        s.commit()
    finally:
        s.close()


@pytest.fixture()
def db():
    s = SessionLocal()
    try:
        yield s
    finally:
        s.close()


def _login(client, username: str, password: str):
    r = client.post("/api/auth/login", data={"username": username, "password": password})
    assert r.status_code == 200, r.text
    return r.json()


@pytest.fixture()
def admin_token(client):
    return _login(client, "admin", "admin123")["access_token"]


@pytest.fixture()
def cs_editor_token(client):
    return _login(client, "cs_editor", "cs-editor@123")["access_token"]


@pytest.fixture()
def placement_editor_token(client):
    return _login(client, "placement_editor", "placement@123")["access_token"]


@pytest.fixture()
def auth_headers():
    def _make(token: str) -> dict:
        return {"Authorization": f"Bearer {token}"}

    return _make
