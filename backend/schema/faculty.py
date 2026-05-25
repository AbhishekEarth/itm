from typing import Optional
from pydantic import BaseModel
from model.faculty import Department


# ── Incoming (request) ────────────────────────────────────────────────────────

class FacultyCreate(BaseModel):
    name: str
    designation: str
    department: Department
    qualification: str
    experience_years: int = 0
    specialization: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None


class FacultyUpdate(BaseModel):
    """All fields optional — only send what you want to change."""
    name: Optional[str] = None
    designation: Optional[str] = None
    department: Optional[Department] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    specialization: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    is_active: Optional[bool] = None


# ── Outgoing (response) ───────────────────────────────────────────────────────

class FacultyOut(BaseModel):
    id: int
    name: str
    designation: str
    department: Department
    qualification: str
    experience_years: int
    specialization: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    image_url: Optional[str]
    bio: Optional[str]
    is_active: bool

    model_config = {"from_attributes": True}
