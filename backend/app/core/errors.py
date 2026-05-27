"""Unified error contract for the API."""
from __future__ import annotations

from typing import Any

from fastapi import HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.logging import log


class AppError(HTTPException):
    def __init__(self, code: str, message: str, status_code: int = 400, fields: dict | None = None):
        super().__init__(status_code=status_code, detail={"code": code, "message": message, "fields": fields or {}})


class NotFoundError(AppError):
    def __init__(self, message: str = "Resource not found"):
        super().__init__("NOT_FOUND", message, status_code=status.HTTP_404_NOT_FOUND)


class ForbiddenError(AppError):
    def __init__(self, message: str = "Forbidden"):
        super().__init__("FORBIDDEN", message, status_code=status.HTTP_403_FORBIDDEN)


class UnauthorizedError(AppError):
    def __init__(self, message: str = "Authentication required"):
        super().__init__("UNAUTHORIZED", message, status_code=status.HTTP_401_UNAUTHORIZED)


class ConflictError(AppError):
    def __init__(self, message: str = "Conflict"):
        super().__init__("CONFLICT", message, status_code=status.HTTP_409_CONFLICT)


def _envelope(code: str, message: str, fields: dict[str, Any] | None = None) -> dict:
    return {"error": {"code": code, "message": message, "fields": fields or {}}}


def register_exception_handlers(app) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exc_handler(request: Request, exc: StarletteHTTPException):
        detail = exc.detail
        if isinstance(detail, dict) and "code" in detail:
            payload = _envelope(detail.get("code", "HTTP_ERROR"), detail.get("message", ""), detail.get("fields"))
        else:
            payload = _envelope("HTTP_ERROR", str(detail))
        return JSONResponse(status_code=exc.status_code, content=payload)

    @app.exception_handler(RequestValidationError)
    async def validation_exc_handler(request: Request, exc: RequestValidationError):
        fields: dict[str, str] = {}
        for err in exc.errors():
            loc = ".".join(str(p) for p in err.get("loc", []) if p not in ("body", "query", "path"))
            fields[loc or "_"] = err.get("msg", "invalid")
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=_envelope("VALIDATION_ERROR", "One or more fields are invalid.", fields),
        )

    @app.exception_handler(Exception)
    async def fallback_exc_handler(request: Request, exc: Exception):
        log.exception("unhandled.exception", path=str(request.url))
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_envelope("INTERNAL_ERROR", "Something went wrong on our end."),
        )
