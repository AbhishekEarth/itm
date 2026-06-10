# Hugging Face Spaces — Docker SDK image for ITM Gwalior FastAPI backend.
# HF Spaces require: app listens on port 7860, no privileged ops, no daemonisation.
#
# Persistent storage on the free tier is NOT guaranteed — the SQLite DB is
# wiped whenever the Space sleeps and restarts. We therefore re-migrate +
# re-seed on every container boot so the demo is always populated.
#
# Build context: the repo's `backend/` folder (set via the `Subpath` field
# in the Space settings OR via the README's `app_file`/`build_context`).

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    # HF Spaces conventions
    HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# System deps for psycopg + python-magic + Pillow + node (for the
# departments_v2.js importer on first boot).
RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential libpq-dev libmagic1 curl ca-certificates gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Non-root user (HF Spaces hard-requirement)
RUN useradd -m -u 1000 user
WORKDIR /home/user/app

COPY --chown=user:user requirements.txt .
RUN pip install --user -r requirements.txt

COPY --chown=user:user . .

# The frontend folder is needed only if we want to re-run the JS-based
# departments importer. On HF we ship the backend alone, so the importer
# will be skipped (it's best-effort and logs a friendly skip message).

USER user

# Writable upload + DB dirs inside HOME (the only writable mount on HF)
RUN mkdir -p /home/user/data/uploads /home/user/data/db

ENV DATABASE_URL=sqlite:////home/user/data/db/itmgoi.db \
    UPLOAD_DIR=/home/user/data/uploads \
    PUBLIC_MEDIA_BASE_URL=/uploads \
    STORAGE_BACKEND=local \
    REDIS_URL=memory:// \
    ENV=production \
    DEBUG=false \
    LOG_LEVEL=INFO \
    API_PREFIX=/api

EXPOSE 7860

# On every boot: run pending migrations + idempotent seed, then start uvicorn.
CMD ["sh", "-c", "alembic upgrade head && python -m scripts.seed || true; exec uvicorn app.main:app --host 0.0.0.0 --port 7860 --workers 1"]
