from __future__ import annotations

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.errors import ConflictError, ForbiddenError, NotFoundError
from app.deps import get_current_user, has_any_scope, require
from app.models import MediaAsset, Page, PageSection, User
from app.schemas.cms import (
    PageCreate,
    PageOut,
    PageSectionCreate,
    PageSectionOut,
    PageSectionUpdate,
    PageUpdate,
)
from app.services import audit

router = APIRouter(prefix="/pages", tags=["pages"])


def _media_url(db: Session, media_id: int | None) -> str | None:
    if not media_id:
        return None
    asset = db.get(MediaAsset, media_id)
    return asset.public_url if asset and asset.is_active else None


def _page_to_out(db: Session, page: Page) -> PageOut:
    return PageOut(
        id=page.id,
        key=page.key,
        path=page.path,
        title=page.title,
        intro_md=page.intro_md,
        hero_image_id=page.hero_image_id,
        hero_image_url=_media_url(db, page.hero_image_id),
        status=page.status,
        scope_key=page.scope_key,
        slug=page.slug,
        meta_title=page.meta_title,
        meta_description=page.meta_description,
        meta_keywords=page.meta_keywords,
        og_image_id=page.og_image_id,
        og_image_url=_media_url(db, page.og_image_id),
        canonical_url=page.canonical_url,
        robots=page.robots,
        is_published=page.is_published,
        sections=[PageSectionOut.model_validate(s) for s in page.sections if s.is_active],
    )


def _enforce_page_scope(page: Page, actor: User) -> None:
    """Owner of `site.pages` can edit any page; otherwise the page's own scope_key is required."""
    if has_any_scope(actor, ["site.pages"]):
        return
    if page.scope_key and has_any_scope(actor, [page.scope_key]):
        return
    raise ForbiddenError(
        f"Requires scope: site.pages{' or ' + page.scope_key if page.scope_key else ''}"
    )


@router.get("", response_model=list[PageOut], dependencies=[Depends(get_current_user)])
def list_pages(db: Session = Depends(get_db)):
    rows = db.scalars(select(Page).order_by(Page.path)).all()
    return [_page_to_out(db, p) for p in rows]


@router.get("/{page_id}", response_model=PageOut, dependencies=[Depends(get_current_user)])
def get_page(page_id: int, db: Session = Depends(get_db)):
    page = db.get(Page, page_id)
    if not page:
        raise NotFoundError("Page not found")
    return _page_to_out(db, page)


@router.post(
    "",
    response_model=PageOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require("site.pages"))],
)
def create_page(
    body: PageCreate,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    page = Page(
        key=body.key,
        path=body.path,
        title=body.title,
        intro_md=body.intro_md,
        status=body.status,
        scope_key=body.scope_key,
        slug=body.slug,
        meta_title=body.meta_title,
        meta_description=body.meta_description,
        meta_keywords=body.meta_keywords,
        canonical_url=body.canonical_url,
        robots=body.robots,
        is_published=body.is_published,
        created_by_user_id=actor.id,
        updated_by_user_id=actor.id,
    )
    db.add(page)
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise ConflictError("Page with that key/path/slug already exists") from e
    db.refresh(page)
    audit.record(
        db, user_id=actor.id, action="page.create", entity_type="page", entity_id=page.id,
        after={"key": page.key, "path": page.path, "title": page.title},
        ip=request.client.host if request.client else None,
    )
    return _page_to_out(db, page)


@router.patch("/{page_id}", response_model=PageOut)
def update_page(
    page_id: int,
    body: PageUpdate,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    page = db.get(Page, page_id)
    if not page:
        raise NotFoundError("Page not found")
    _enforce_page_scope(page, actor)

    before = {"title": page.title, "meta_title": page.meta_title}
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(page, field, value)
    page.updated_by_user_id = actor.id
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise ConflictError("Slug already used by another page") from e
    db.refresh(page)
    audit.record(
        db, user_id=actor.id, action="page.update", entity_type="page", entity_id=page.id,
        before=before,
        after={"title": page.title, "meta_title": page.meta_title},
        ip=request.client.host if request.client else None,
    )
    return _page_to_out(db, page)


@router.delete("/{page_id}", status_code=204, dependencies=[Depends(require("site.pages"))])
def delete_page(
    page_id: int,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    page = db.get(Page, page_id)
    if not page:
        raise NotFoundError("Page not found")
    db.delete(page)
    db.commit()
    audit.record(
        db, user_id=actor.id, action="page.delete", entity_type="page", entity_id=page_id,
        ip=request.client.host if request.client else None,
    )


# ── Sections ────────────────────────────────────────────────────────────


@router.get("/{page_id}/sections", response_model=list[PageSectionOut], dependencies=[Depends(get_current_user)])
def list_sections(page_id: int, db: Session = Depends(get_db)):
    page = db.get(Page, page_id)
    if not page:
        raise NotFoundError("Page not found")
    return [PageSectionOut.model_validate(s) for s in page.sections]


@router.post(
    "/{page_id}/sections",
    response_model=PageSectionOut,
    status_code=status.HTTP_201_CREATED,
)
def create_section(
    page_id: int,
    body: PageSectionCreate,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    page = db.get(Page, page_id)
    if not page:
        raise NotFoundError("Page not found")
    _enforce_page_scope(page, actor)

    section = PageSection(
        page_id=page.id,
        section_key=body.section_key,
        label=body.label,
        kind=body.kind,
        position=body.position,
        is_active=body.is_active,
        payload=body.payload,
        created_by_user_id=actor.id,
        updated_by_user_id=actor.id,
    )
    db.add(section)
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise ConflictError("section_key already used on this page") from e
    db.refresh(section)
    audit.record(
        db,
        user_id=actor.id,
        action="section.create",
        entity_type="page_section",
        entity_id=section.id,
        after={"page_id": page.id, "section_key": section.section_key, "kind": section.kind},
        ip=request.client.host if request.client else None,
    )
    return PageSectionOut.model_validate(section)


@router.patch("/{page_id}/sections/{section_key}", response_model=PageSectionOut)
def update_section(
    page_id: int,
    section_key: str,
    body: PageSectionUpdate,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    page = db.get(Page, page_id)
    if not page:
        raise NotFoundError("Page not found")
    _enforce_page_scope(page, actor)

    section = db.scalar(
        select(PageSection).where(
            PageSection.page_id == page.id, PageSection.section_key == section_key
        )
    )
    if not section:
        raise NotFoundError("Section not found")

    before = {"payload": section.payload, "kind": section.kind, "is_active": section.is_active}
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(section, field, value)
    section.updated_by_user_id = actor.id
    db.commit()
    db.refresh(section)
    audit.record(
        db,
        user_id=actor.id,
        action="section.update",
        entity_type="page_section",
        entity_id=section.id,
        before=before,
        after={"payload": section.payload, "is_active": section.is_active},
        ip=request.client.host if request.client else None,
    )
    return PageSectionOut.model_validate(section)


@router.delete("/{page_id}/sections/{section_key}", status_code=204)
def delete_section(
    page_id: int,
    section_key: str,
    request: Request,
    db: Session = Depends(get_db),
    actor: User = Depends(get_current_user),
):
    page = db.get(Page, page_id)
    if not page:
        raise NotFoundError("Page not found")
    _enforce_page_scope(page, actor)
    section = db.scalar(
        select(PageSection).where(
            PageSection.page_id == page.id, PageSection.section_key == section_key
        )
    )
    if not section:
        raise NotFoundError("Section not found")
    db.delete(section)
    db.commit()
    audit.record(
        db,
        user_id=actor.id,
        action="section.delete",
        entity_type="page_section",
        entity_id=section.id,
        ip=request.client.host if request.client else None,
    )
