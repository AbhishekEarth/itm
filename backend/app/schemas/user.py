from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

Role = Literal["super_admin", "editor", "faculty", "student"]


class ScopeOut(BaseModel):
    id: int
    key: str
    label: str
    description: str | None = None

    model_config = {"from_attributes": True}


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: str | None = None
    phone: str | None = None
    role: Role
    is_active: bool
    must_change_password: bool
    last_login_at: datetime | None = None
    created_at: datetime
    scopes: list[str] = []

    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=64, pattern=r"^[A-Za-z0-9._-]+$")
    email: EmailStr
    full_name: str | None = Field(None, max_length=255)
    phone: str | None = Field(None, max_length=32)
    role: Role = "editor"
    password: str = Field(..., min_length=8, max_length=255)
    is_active: bool = True
    must_change_password: bool = True
    scopes: list[str] = Field(default_factory=list)


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    full_name: str | None = Field(None, max_length=255)
    phone: str | None = Field(None, max_length=32)
    role: Role | None = None
    is_active: bool | None = None


class PasswordResetRequest(BaseModel):
    new_password: str = Field(..., min_length=8, max_length=255)
    must_change_password: bool = True


class ScopeAssignment(BaseModel):
    add: list[str] = Field(default_factory=list)
    remove: list[str] = Field(default_factory=list)
