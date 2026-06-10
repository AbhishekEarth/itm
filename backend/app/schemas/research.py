from __future__ import annotations

from datetime import date

from pydantic import BaseModel, Field


# Focus areas
class FocusAreaIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    icon: str | None = None
    description: str | None = None
    departments: list[str] | None = None
    sort_order: int = 0


class FocusAreaOut(FocusAreaIn):
    id: int
    model_config = {"from_attributes": True}


# Publications
class PublicationIn(BaseModel):
    year: str = Field(..., min_length=1, max_length=16)
    count_label: str | None = None
    pdf_id: int | None = None
    pdf_url: str | None = None
    department_code: str | None = None
    summary: str | None = None
    sort_order: int = 0


class PublicationOut(PublicationIn):
    id: int
    resolved_pdf_url: str | None = None
    model_config = {"from_attributes": True}


# Books / chapters
class BookIn(BaseModel):
    year: str = Field(..., min_length=1, max_length=16)
    title: str | None = None
    pdf_id: int | None = None
    pdf_url: str | None = None
    contributors: list[str] | None = None
    sort_order: int = 0


class BookOut(BookIn):
    id: int
    resolved_pdf_url: str | None = None
    model_config = {"from_attributes": True}


# Patents
class PatentIn(BaseModel):
    title: str = Field(..., min_length=1, max_length=512)
    inventors: list[str] | None = None
    filed_on: date | None = None
    granted_on: date | None = None
    patent_no: str | None = None
    status: str = "filed"
    department_code: str | None = None
    pdf_id: int | None = None
    pdf_url: str | None = None
    sort_order: int = 0


class PatentOut(PatentIn):
    id: int
    resolved_pdf_url: str | None = None
    model_config = {"from_attributes": True}


# Journal
class JournalIssueIn(BaseModel):
    volume: str | None = None
    issue: str | None = None
    year: int
    theme: str | None = None
    cover_id: int | None = None
    cover_url: str | None = None
    pdf_id: int | None = None
    pdf_url: str | None = None
    is_published: bool = True
    sort_order: int = 0


class JournalIssueOut(JournalIssueIn):
    id: int
    resolved_cover_url: str | None = None
    resolved_pdf_url: str | None = None
    model_config = {"from_attributes": True}


# Conferences
class ConferencePaperIn(BaseModel):
    title: str = Field(..., min_length=1, max_length=512)
    authors: list[str] | None = None
    abstract_md: str | None = None
    pdf_id: int | None = None
    pdf_url: str | None = None
    sort_order: int = 0


class ConferencePaperOut(ConferencePaperIn):
    id: int
    conference_id: int
    resolved_pdf_url: str | None = None
    model_config = {"from_attributes": True}


class ConferenceIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=512)
    short_name: str | None = None
    year: int
    location: str | None = None
    theme: str | None = None
    description: str | None = None
    banner_id: int | None = None
    banner_url: str | None = None
    brochure_id: int | None = None
    brochure_url: str | None = None
    proceedings_id: int | None = None
    proceedings_url: str | None = None
    status: str = "upcoming"
    sort_order: int = 0


class ConferenceOut(ConferenceIn):
    id: int
    resolved_banner_url: str | None = None
    resolved_brochure_url: str | None = None
    resolved_proceedings_url: str | None = None
    papers: list[ConferencePaperOut] = []
    model_config = {"from_attributes": True}


# FDPs
class FdpSessionIn(BaseModel):
    day: int = 1
    time_slot: str | None = None
    speaker: str | None = None
    topic: str = Field(..., min_length=1, max_length=512)
    notes: str | None = None
    sort_order: int = 0


class FdpSessionOut(FdpSessionIn):
    id: int
    fdp_id: int
    model_config = {"from_attributes": True}


class FdpIn(BaseModel):
    title: str = Field(..., min_length=1, max_length=512)
    start_date: date | None = None
    end_date: date | None = None
    mode: str | None = None
    description: str | None = None
    banner_id: int | None = None
    banner_url: str | None = None
    brochure_id: int | None = None
    brochure_url: str | None = None
    status: str = "upcoming"
    sort_order: int = 0


class FdpOut(FdpIn):
    id: int
    resolved_banner_url: str | None = None
    resolved_brochure_url: str | None = None
    sessions: list[FdpSessionOut] = []
    model_config = {"from_attributes": True}


# Policy documents
class PolicyIn(BaseModel):
    owner: str = "research"
    title: str = Field(..., min_length=1, max_length=512)
    description: str | None = None
    icon: str | None = None
    pdf_id: int | None = None
    pdf_url: str | None = None
    version: str | None = None
    last_revised_on: date | None = None
    sort_order: int = 0


class PolicyOut(PolicyIn):
    id: int
    resolved_pdf_url: str | None = None
    model_config = {"from_attributes": True}
