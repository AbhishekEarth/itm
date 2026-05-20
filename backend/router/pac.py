from datetime import date, datetime
from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from control.database import get_db
from control.security import get_current_admin
from model.pac import PACEvent, PACImage
from schema.pac import PACEventOut
from utilities.file_handler import delete_directory, save_upload

router = APIRouter()


def _parse_date(value: str) -> date:
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(value, fmt).date()
        except ValueError:
            continue
    raise HTTPException(status_code=400, detail=f"Unrecognised date format: '{value}'")


@router.get("/all", response_model=List[PACEventOut])
def list_pac(db: Session = Depends(get_db)):
    return db.query(PACEvent).order_by(PACEvent.event_date.desc()).all()


@router.post("/add", response_model=PACEventOut, status_code=status.HTTP_201_CREATED)
def add_pac(
    title: str = Form(...),
    director: str = Form(...),
    event_date_str: str = Form(...),
    description: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    if not files:
        raise HTTPException(status_code=400, detail="At least one image is required")

    event = PACEvent(
        title=title, director=director,
        event_date=_parse_date(event_date_str), description=description,
    )
    db.add(event)
    db.flush()  # resolve event.id before saving images

    subdir = f"pac/event_{event.id}"
    for f in files:
        db.add(PACImage(event_id=event.id, image_url=save_upload(f, subdir)))

    db.commit()
    db.refresh(event)
    return event


@router.delete("/delete/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pac(
    event_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    event = db.query(PACEvent).filter(PACEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    delete_directory(f"/uploads/pac/event_{event.id}")
    db.delete(event)
    db.commit()
