"""
ITM GOI – FastAPI backend
Run from the backend/ directory:
    uvicorn main:app --reload --port 8000
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from control.config import settings
from control.database import Base, SessionLocal, engine
from control.security import hash_password
from middleware.logging import RequestLoggingMiddleware

# ── 1. Import every model so SQLAlchemy registers it with Base ─────────────────
from model.admin import AdminUser          # noqa: F401
from model.event import TAPEvent           # noqa: F401
from model.faculty import Faculty          # noqa: F401
from model.pac import PACEvent, PACImage   # noqa: F401
from model.placement import Placement      # noqa: F401
from model.student import Student          # noqa: F401

# ── 2. Import routers ──────────────────────────────────────────────────────────
from router import auth, events, faculty, pac, placements, student

# ── 3. Logging setup ──────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
)
_log = logging.getLogger("itm.startup")

# ── 4. Create DB tables ────────────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)


def _seed_default_admin() -> None:
    """Creates admin/admin123 on first run if no admin exists. Change via API."""
    db = SessionLocal()
    try:
        if not db.query(AdminUser).first():
            db.add(AdminUser(username="admin", hashed_password=hash_password("admin123")))
            db.commit()
            _log.warning(
                "Default admin created  ➜  username: admin | password: admin123  "
                "— CHANGE THIS before going to production!"
            )
    finally:
        db.close()


_seed_default_admin()

# ── 5. App ─────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    docs_url="/api/docs",        # Swagger UI
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# ── 6. Middleware ──────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggingMiddleware)

# ── 7. Static file serving (uploaded images) ───────────────────────────────────
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

# ── 8. Routes ──────────────────────────────────────────────────────────────────
app.include_router(auth.router,        prefix="/api/auth",       tags=["Auth"])
app.include_router(faculty.router,     prefix="/api/faculty",    tags=["Faculty"])
app.include_router(student.router,     prefix="/api/students",   tags=["Students"])
app.include_router(placements.router,  prefix="/api/placements", tags=["Placements"])
app.include_router(pac.router,         prefix="/api/pac",        tags=["PAC Events"])
app.include_router(events.router,      prefix="/api/events",     tags=["TAP Events"])


@app.get("/", tags=["Health"])
def health():
    return {"status": "ok", "service": settings.APP_NAME, "version": settings.APP_VERSION}
