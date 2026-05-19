import os
import shutil
import uuid
from datetime import date, datetime
from pathlib import Path
from typing import List

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from database import Base, engine, get_db
import models

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
PLACEMENTS_DIR = UPLOAD_DIR / "placements"
PAC_DIR = UPLOAD_DIR / "pac"
EVENTS_DIR = UPLOAD_DIR / "events"

for d in (PLACEMENTS_DIR, PAC_DIR, EVENTS_DIR):
    d.mkdir(parents=True, exist_ok=True)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ITM GOI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


def _save_upload(file: UploadFile, dest_dir: Path) -> str:
    suffix = Path(file.filename or "").suffix or ".jpg"
    name = f"{uuid.uuid4().hex}{suffix}"
    dest = dest_dir / name
    with dest.open("wb") as out:
        shutil.copyfileobj(file.file, out)
    rel = dest.relative_to(BASE_DIR).as_posix()
    return f"/{rel}"


def _parse_date(value: str) -> date:
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue
    raise HTTPException(status_code=400, detail=f"Invalid date: {value}")


@app.get("/")
def root():
    return {"status": "ok", "service": "ITM GOI Backend"}


# ─── Placements ──────────────────────────────────────────────────────────────
@app.get("/api/placements/all")
def list_placements(db: Session = Depends(get_db)):
    rows = db.query(models.Placement).order_by(models.Placement.id.desc()).all()
    return [{"id": r.id, "image_url": r.image_url} for r in rows]


@app.post("/api/placements/add")
def add_placement(file: UploadFile = File(...), db: Session = Depends(get_db)):
    image_url = _save_upload(file, PLACEMENTS_DIR)
    row = models.Placement(image_url=image_url)
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"status": "success", "id": row.id, "image_url": row.image_url}


@app.delete("/api/placements/delete/{placement_id}")
def delete_placement(placement_id: int, db: Session = Depends(get_db)):
    row = db.query(models.Placement).filter(models.Placement.id == placement_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    file_path = BASE_DIR / row.image_url.lstrip("/")
    if file_path.exists():
        try:
            file_path.unlink()
        except OSError:
            pass
    db.delete(row)
    db.commit()
    return {"status": "success"}


# ─── PAC Events ──────────────────────────────────────────────────────────────
def _serialize_pac(event: models.PACEvent) -> dict:
    return {
        "id": event.id,
        "title": event.title,
        "director": event.director,
        "event_date": event.event_date.isoformat(),
        "description": event.description,
        "images": [{"image_url": img.image_url} for img in event.images],
    }


@app.get("/api/pac/all")
def list_pac(db: Session = Depends(get_db)):
    rows = (
        db.query(models.PACEvent)
        .order_by(models.PACEvent.event_date.desc())
        .all()
    )
    return [_serialize_pac(r) for r in rows]


@app.post("/api/pac/add")
def add_pac(
    title: str = Form(...),
    director: str = Form(...),
    event_date_str: str = Form(...),
    description: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    if not files:
        raise HTTPException(status_code=400, detail="At least one file is required")

    event = models.PACEvent(
        title=title,
        director=director,
        event_date=_parse_date(event_date_str),
        description=description,
    )
    db.add(event)
    db.flush()

    event_dir = PAC_DIR / f"event_{event.id}"
    event_dir.mkdir(parents=True, exist_ok=True)

    for f in files:
        url = _save_upload(f, event_dir)
        db.add(models.PACImage(event_id=event.id, image_url=url))

    db.commit()
    db.refresh(event)
    return {"status": "success", "event": _serialize_pac(event)}


@app.delete("/api/pac/delete/{event_id}")
def delete_pac(event_id: int, db: Session = Depends(get_db)):
    event = db.query(models.PACEvent).filter(models.PACEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Not found")

    event_dir = PAC_DIR / f"event_{event.id}"
    if event_dir.exists():
        shutil.rmtree(event_dir, ignore_errors=True)

    db.delete(event)
    db.commit()
    return {"status": "success"}


# ─── TAP Events ──────────────────────────────────────────────────────────────
def _serialize_tap(event: models.TAPEvent) -> dict:
    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "icon": event.icon or "📅",
        "event_date": event.event_date.isoformat(),
        "image_url": event.image_url,
    }


@app.get("/api/events/all")
def list_events(db: Session = Depends(get_db)):
    today = date.today()
    rows = db.query(models.TAPEvent).order_by(models.TAPEvent.event_date.desc()).all()
    upcoming, past = [], []
    for r in rows:
        bucket = upcoming if r.event_date >= today else past
        bucket.append(_serialize_tap(r))
    upcoming.sort(key=lambda e: e["event_date"])
    return {"upcoming": upcoming, "past": past}


@app.post("/api/events/add")
def add_event(
    title: str = Form(...),
    description: str = Form(...),
    icon: str = Form("📅"),
    event_date: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    image_url = _save_upload(file, EVENTS_DIR)
    row = models.TAPEvent(
        title=title,
        description=description,
        icon=icon or "📅",
        event_date=_parse_date(event_date),
        image_url=image_url,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"status": "success", "event": _serialize_tap(row)}


@app.delete("/api/events/delete/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    row = db.query(models.TAPEvent).filter(models.TAPEvent.id == event_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    file_path = BASE_DIR / row.image_url.lstrip("/")
    if file_path.exists():
        try:
            file_path.unlink()
        except OSError:
            pass
    db.delete(row)
    db.commit()
    return {"status": "success"}
