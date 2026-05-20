from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from control.config import settings

# SQLite needs check_same_thread=False; other DBs don't need this arg
_connect_args = {"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}

engine = create_engine(settings.DATABASE_URL, connect_args=_connect_args)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

# All ORM models inherit from this Base so SQLAlchemy can track them
Base = declarative_base()


def get_db() -> Session:
    """FastAPI dependency — yields a DB session and closes it when the request ends."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
