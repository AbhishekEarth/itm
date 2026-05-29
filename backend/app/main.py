"""ITM Gwalior FastAPI application."""
from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import settings
from app.core.errors import register_exception_handlers
from app.core.logging import RequestContextMiddleware, configure_logging, log
from app.core.ratelimit import limiter
from app.routers import admin_pages as admin_pages_router
from app.routers import admissions as admissions_router
from app.routers import analytics as analytics_router
from app.routers import audit as audit_router
from app.routers import auth as auth_router
from app.routers import clubs as clubs_router
from app.routers import compliance as compliance_router
from app.routers import departments as departments_router
from app.routers import health as health_router
from app.routers import media as media_router
from app.routers import page_overrides as page_overrides_router
from app.routers import pages as pages_router
from app.routers import placements as placements_router
from app.routers import posts as posts_router
from app.routers import public as public_router
from app.routers import research as research_router
from app.routers import scope_presets as scope_presets_router
from app.routers import seo as seo_router
from app.routers import settings as settings_router
from app.routers import users as users_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_logging()
    log.info(
        "app.starting",
        env=settings.ENV,
        db=settings.DATABASE_URL.split("@")[-1],
        storage=settings.STORAGE_BACKEND,
    )
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    yield
    log.info("app.stopping")


app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc",
    openapi_url=f"{settings.API_PREFIX}/openapi.json",
    lifespan=lifespan,
)

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds OWASP-recommended response headers. CSP intentionally permissive on
    /uploads/* media. Tighten in nginx for HTTP/2 / HSTS in production."""

    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
        if settings.ENV == "production":
            response.headers.setdefault(
                "Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload"
            )
        return response


app.state.limiter = limiter
app.add_middleware(GZipMiddleware, minimum_size=512)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(RequestContextMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-Id"],
)


@app.exception_handler(RateLimitExceeded)
async def _rate_limit_handler(request, exc):
    from fastapi.responses import JSONResponse

    return JSONResponse(
        status_code=429,
        content={
            "error": {
                "code": "RATE_LIMITED",
                "message": "Too many requests. Please slow down.",
                "fields": {},
            }
        },
    )


register_exception_handlers(app)

app.include_router(health_router.router, prefix=settings.API_PREFIX)
app.include_router(auth_router.router, prefix=settings.API_PREFIX)
app.include_router(users_router.router, prefix=settings.API_PREFIX)
app.include_router(users_router.catalog_router, prefix=settings.API_PREFIX)
app.include_router(scope_presets_router.router, prefix=settings.API_PREFIX)
app.include_router(admin_pages_router.router, prefix=settings.API_PREFIX)
app.include_router(page_overrides_router.public_router, prefix=settings.API_PREFIX)
app.include_router(page_overrides_router.admin_router, prefix=settings.API_PREFIX)
app.include_router(posts_router.public_router, prefix=settings.API_PREFIX)
app.include_router(posts_router.admin_router, prefix=settings.API_PREFIX)
app.include_router(analytics_router.router, prefix=settings.API_PREFIX)
app.include_router(audit_router.router, prefix=settings.API_PREFIX)
app.include_router(media_router.router, prefix=settings.API_PREFIX)
app.include_router(settings_router.router, prefix=settings.API_PREFIX)
app.include_router(pages_router.router, prefix=settings.API_PREFIX)
app.include_router(departments_router.router, prefix=settings.API_PREFIX)
app.include_router(placements_router.router, prefix=settings.API_PREFIX)
app.include_router(research_router.router, prefix=settings.API_PREFIX)
app.include_router(clubs_router.router, prefix=settings.API_PREFIX)
app.include_router(admissions_router.router, prefix=settings.API_PREFIX)
app.include_router(compliance_router.router, prefix=settings.API_PREFIX)
app.include_router(public_router.router, prefix=settings.API_PREFIX)
app.include_router(seo_router.router, prefix=settings.API_PREFIX)

# Serve uploaded media in development; nginx handles this in production.
if settings.STORAGE_BACKEND == "local":
    upload_path = Path(settings.UPLOAD_DIR).resolve()
    upload_path.mkdir(parents=True, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=str(upload_path)), name="uploads")


@app.get("/")
def index():
    return {
        "name": settings.APP_NAME,
        "version": "0.1.0",
        "docs": f"{settings.API_PREFIX}/docs",
    }
