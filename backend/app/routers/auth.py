from __future__ import annotations

from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.errors import ForbiddenError, UnauthorizedError
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    safe_decode,
    token_hash,
    verify_password,
)
from app.deps import get_current_user
from app.models import LoginAttempt, RefreshToken, User
from app.schemas.auth import (
    PasswordChangeRequest,
    RefreshRequest,
    TokenResponse,
    UserPublic,
)
from app.services import audit

router = APIRouter(prefix="/auth", tags=["auth"])


def _user_public(user: User) -> UserPublic:
    return UserPublic(
        id=user.id,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        scopes=[s.key for s in user.scopes],
        must_change_password=user.must_change_password,
    )


def _build_token_response(db: Session, user: User, request: Request) -> TokenResponse:
    scopes = [s.key for s in user.scopes]
    access = create_access_token(
        subject=str(user.id),
        scopes=scopes,
        extra={"role": user.role, "username": user.username},
    )
    refresh, refresh_exp = create_refresh_token(subject=str(user.id))
    db.add(
        RefreshToken(
            user_id=user.id,
            token_hash=token_hash(refresh),
            expires_at=refresh_exp,
            user_agent=request.headers.get("User-Agent", "")[:255],
            ip=request.client.host if request.client else None,
        )
    )
    user.last_login_at = datetime.now(UTC)
    db.commit()
    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        expires_in=settings.ACCESS_TOKEN_TTL_MIN * 60,
        role=user.role,
        scopes=scopes,
        user=_user_public(user),
    )


def _check_lockout(db: Session, username: str) -> None:
    window_start = datetime.now(UTC) - timedelta(minutes=settings.LOGIN_LOCKOUT_WINDOW_MIN)
    recent_fails = db.scalar(
        select(__import__("sqlalchemy").func.count(LoginAttempt.id)).where(
            and_(
                LoginAttempt.username == username,
                LoginAttempt.ok.is_(False),
                LoginAttempt.created_at >= window_start,
            )
        )
    ) or 0
    if recent_fails >= settings.LOGIN_LOCKOUT_THRESHOLD:
        raise ForbiddenError("Too many failed attempts. Try again later.")


def _record_attempt(db: Session, username: str, ip: str | None, ok: bool) -> None:
    db.add(LoginAttempt(username=username, ip=ip, ok=ok))
    db.commit()


def _resolve_user(db: Session, username_or_email: str) -> User | None:
    return db.scalar(
        select(User).where((User.username == username_or_email) | (User.email == username_or_email))
    )


@router.post("/login", response_model=TokenResponse)
def login(
    request: Request,
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Unified login for admin / editor / faculty / student. Server picks role."""
    ip = request.client.host if request.client else None
    _check_lockout(db, form.username)

    user = _resolve_user(db, form.username)
    if not user or not user.is_active or not verify_password(form.password, user.password_hash):
        _record_attempt(db, form.username, ip, ok=False)
        raise UnauthorizedError("Invalid credentials")

    _record_attempt(db, form.username, ip, ok=True)
    audit.record(db, user_id=user.id, action="auth.login", entity_type="user", entity_id=user.id, ip=ip)
    return _build_token_response(db, user, request)


@router.post("/student-login", response_model=TokenResponse)
def student_login(
    request: Request,
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Backwards-compat path used by Login.jsx student tab."""
    return login(request, form, db)


@router.post("/faculty-login", response_model=TokenResponse)
def faculty_login(
    request: Request,
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    return login(request, form, db)


@router.post("/refresh", response_model=TokenResponse)
def refresh_tokens(body: RefreshRequest, request: Request, db: Session = Depends(get_db)):
    payload = safe_decode(body.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise UnauthorizedError("Invalid refresh token")

    th = token_hash(body.refresh_token)
    rt = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == th))
    if not rt or rt.revoked_at is not None:
        raise UnauthorizedError("Refresh token expired or revoked")
    expires_at = rt.expires_at if rt.expires_at.tzinfo else rt.expires_at.replace(tzinfo=UTC)
    if expires_at < datetime.now(UTC):
        raise UnauthorizedError("Refresh token expired or revoked")

    user = db.get(User, rt.user_id)
    if not user or not user.is_active:
        raise UnauthorizedError("Account disabled")

    rt.revoked_at = datetime.now(UTC)
    db.commit()
    return _build_token_response(db, user, request)


@router.post("/logout", status_code=204)
def logout(body: RefreshRequest, db: Session = Depends(get_db)):
    th = token_hash(body.refresh_token)
    rt = db.scalar(select(RefreshToken).where(RefreshToken.token_hash == th))
    if rt and rt.revoked_at is None:
        rt.revoked_at = datetime.now(UTC)
        db.commit()


@router.get("/me", response_model=UserPublic)
def me(user: User = Depends(get_current_user)):
    return _user_public(user)


@router.post("/password", status_code=204)
def change_password(
    body: PasswordChangeRequest,
    request: Request,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(body.current_password, user.password_hash):
        raise UnauthorizedError("Current password is incorrect")
    user.password_hash = hash_password(body.new_password)
    user.must_change_password = False
    db.commit()
    audit.record(
        db,
        user_id=user.id,
        action="auth.password_change",
        entity_type="user",
        entity_id=user.id,
        ip=request.client.host if request.client else None,
    )
