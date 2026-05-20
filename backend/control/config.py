from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/ is two levels up from control/config.py
BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "ITM GOI API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # SQLite by default; swap to postgresql+psycopg2://... in .env for production
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'itm.db'}"

    # Generate a strong key: python -c "import secrets; print(secrets.token_hex(32))"
    SECRET_KEY: str = "change-me-before-going-to-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours

    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    ALLOWED_EXTENSIONS: frozenset = frozenset({".jpg", ".jpeg", ".png", ".webp", ".gif"})

    # Origins that the browser is allowed to call from
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ]


# Single shared instance — import this everywhere
settings = Settings()
