from __future__ import annotations

from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

_engine_kwargs: dict = {"pool_pre_ping": True, "future": True}

if settings.is_postgres:
    _engine_kwargs.update(
        pool_size=settings.DB_POOL_SIZE,
        max_overflow=settings.DB_MAX_OVERFLOW,
    )
    # Supabase's transaction-mode pooler (port 6543, host contains "pooler")
    # multiplexes statements across backends and rejects PREPARE. psycopg3
    # auto-prepares after the 5th identical query — disable that.
    if "pooler" in settings.DATABASE_URL:
        _engine_kwargs["connect_args"] = {"prepare_threshold": None}
elif settings.is_sqlite:
    _engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, **_engine_kwargs)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
