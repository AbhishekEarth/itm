"""Redis-backed JSON cache with tag-based invalidation.

Falls back to a tiny process-local LRU when Redis is unreachable so the API stays
functional in dev / CI without redis.
"""
from __future__ import annotations

import json
import time
from collections import OrderedDict
from typing import Any

from app.core.config import settings
from app.core.logging import log

_TTL_DEFAULT = 300
_LOCAL_MAX = 512


class _LocalCache:
    """Tiny TTL + LRU. Used as fallback when Redis isn't available."""

    def __init__(self, capacity: int = _LOCAL_MAX) -> None:
        self.capacity = capacity
        self.store: OrderedDict[str, tuple[float, str]] = OrderedDict()
        self.tags: dict[str, set[str]] = {}

    def get(self, key: str) -> str | None:
        item = self.store.get(key)
        if not item:
            return None
        exp, val = item
        if exp < time.time():
            self.store.pop(key, None)
            return None
        self.store.move_to_end(key)
        return val

    def set(self, key: str, value: str, ttl: int, tags: list[str]) -> None:
        self.store[key] = (time.time() + ttl, value)
        self.store.move_to_end(key)
        while len(self.store) > self.capacity:
            self.store.popitem(last=False)
        for t in tags:
            self.tags.setdefault(t, set()).add(key)

    def invalidate(self, tags: list[str]) -> int:
        n = 0
        for t in tags:
            for k in self.tags.pop(t, set()):
                if self.store.pop(k, None) is not None:
                    n += 1
        return n


class CacheClient:
    def __init__(self) -> None:
        self._local = _LocalCache()
        self._redis = None
        url = settings.REDIS_URL
        if url and not url.startswith("memory"):
            try:
                import redis  # type: ignore

                self._redis = redis.Redis.from_url(url, socket_connect_timeout=0.25, decode_responses=True)
                self._redis.ping()
            except Exception as e:  # noqa: BLE001
                log.info("cache.no_redis", reason=str(e))
                self._redis = None

    def get(self, key: str) -> Any | None:
        try:
            raw = self._redis.get(key) if self._redis else self._local.get(key)
        except Exception:
            raw = self._local.get(key)
        if raw is None:
            return None
        try:
            return json.loads(raw)
        except Exception:
            return None

    def set(self, key: str, value: Any, ttl: int = _TTL_DEFAULT, tags: list[str] | None = None) -> None:
        tags = tags or []
        raw = json.dumps(value, default=str)
        if self._redis:
            try:
                pipe = self._redis.pipeline()
                pipe.set(key, raw, ex=ttl)
                for t in tags:
                    pipe.sadd(f"tag:{t}", key)
                    pipe.expire(f"tag:{t}", max(ttl * 2, 3600))
                pipe.execute()
                return
            except Exception:
                pass
        self._local.set(key, raw, ttl, tags)

    def invalidate_tags(self, *tags: str) -> int:
        n = 0
        if self._redis:
            try:
                pipe = self._redis.pipeline()
                for t in tags:
                    keys = self._redis.smembers(f"tag:{t}") or set()
                    if keys:
                        pipe.delete(*keys)
                        n += len(keys)
                    pipe.delete(f"tag:{t}")
                pipe.execute()
                return n
            except Exception:
                pass
        return self._local.invalidate(list(tags))


cache = CacheClient()


def cached_json(key: str, *, ttl: int = _TTL_DEFAULT, tags: list[str] | None = None):
    """Decorator-style helper for sync functions that return JSON-able dicts/lists.

    Usage:
        @cached_json("public-home", ttl=60, tags=["public", "pages"])
        def build_payload(db): ...
    """

    def wrap(fn):
        def inner(*args, **kwargs):
            hit = cache.get(key)
            if hit is not None:
                return hit
            value = fn(*args, **kwargs)
            cache.set(key, value, ttl=ttl, tags=tags or [])
            return value

        inner.__wrapped__ = fn  # type: ignore[attr-defined]
        return inner

    return wrap
