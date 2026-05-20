from typing import Optional
from pydantic import BaseModel
from model.student import Year


# ── Incoming (request) ────────────────────────────────────────────────────────

class StudentCreate(BaseModel):
    enrollment_no: str
    name: str
    department: str
    year: Year
    batch: str                   # e.g. "2022-2026"
    email: Optional[str] = None
    phone: Optional[str] = None


class StudentUpdate(BaseModel):
    """All fields optional — only send what you want to change."""
    name: Optional[str] = None
    department: Optional[str] = None
    year: Optional[Year] = None
    batch: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None


# ── Outgoing (response) ───────────────────────────────────────────────────────

class StudentOut(BaseModel):
    id: int
    enrollment_no: str
    name: str
    department: str
    year: Year
    batch: str
    email: Optional[str]
    phone: Optional[str]
    image_url: Optional[str]
    is_active: bool

    model_config = {"from_attributes": True}
