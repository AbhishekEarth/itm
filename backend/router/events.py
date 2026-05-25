from datetime import date, datetime
from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from control.database import get_db
from control.security import get_current_admin
from model.event import TAPEvent
from schema.event import TAPEventOut
from utilities.file_handler import delete_file, save_upload

router = APIRouter()


def _parse_date(value: str) -> date:
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue
    raise HTTPException(status_code=400, detail=f"Unrecognised date format: '{value}'")


@router.get("/all")
def list_events(db: Session = Depends(get_db)):
    today = date.today()
    rows = db.query(TAPEvent).order_by(TAPEvent.event_date.desc()).all()
    upcoming, past = [], []
    for r in rows:
        obj = TAPEventOut.model_validate(r)
        (upcoming if r.event_date >= today else past).append(obj)
    upcoming.sort(key=lambda e: e.event_date)
    return {"upcoming": upcoming, "past": past}


@router.post("/add", response_model=TAPEventOut, status_code=status.HTTP_201_CREATED)
def add_event(
    title: str = Form(...),
    description: str = Form(...),
    icon: str = Form("📅"),
    event_date: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    row = TAPEvent(
        title=title, description=description, icon=icon or "📅",
        event_date=_parse_date(event_date),
        image_url=save_upload(file, "events"),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/delete/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    row = db.query(TAPEvent).filter(TAPEvent.id == event_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Event not found")
    delete_file(row.image_url)
    db.delete(row)
    db.commit()
