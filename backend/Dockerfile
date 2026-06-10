# ──────────────────────────────────────────────────────────────────
#  ITM Gwalior backend — Cloud Run image
#
#  Build:   docker build -t itmgoi-backend .
#  Run:     docker run --rm -p 8080:8080 --env-file .env.production itmgoi-backend
#  Deploy:  see cloudbuild.yaml (or run gcloud manually)
# ──────────────────────────────────────────────────────────────────
FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PORT=8080

RUN apt-get update && apt-get install -y --no-install-recommends \
        build-essential libpq-dev libmagic1 curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install deps first (better layer caching).
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Cloud Run injects $PORT (default 8080). Bind to it.
EXPOSE 8080

# - exec replaces the shell so SIGTERM reaches gunicorn (graceful shutdown).
# - 1 worker because Cloud Run scales by replicas, not in-process workers.
# - --timeout 0 lets Cloud Run's own request timeout (default 300s) win;
#   without it, gunicorn kills long uploads at 30s.
CMD exec gunicorn app.main:app \
    -k uvicorn.workers.UvicornWorker \
    -w 1 \
    -b 0.0.0.0:${PORT} \
    --timeout 0 \
    --graceful-timeout 30 \
    --access-logfile - \
    --error-logfile -
