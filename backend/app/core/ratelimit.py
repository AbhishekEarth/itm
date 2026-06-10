from __future__ import annotations

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings


def _pick_storage_uri() -> str:
    """Use Redis if configured AND reachable; otherwise fall back to in-process memory."""
    uri = settings.REDIS_URL
    if not uri or uri.startswith("memory"):
        return "memory://"
    try:
        import redis

        client = redis.Redis.from_url(uri, socket_connect_timeout=0.25)
        client.ping()
        return uri
    except Exception:
        return "memory://"


limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[settings.RATE_LIMIT_DEFAULT],
    storage_uri=_pick_storage_uri(),
    strategy="fixed-window",
)
