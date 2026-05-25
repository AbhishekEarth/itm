from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from control.config import settings

engine = create_engine(settings.DATABASE_URL)

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
