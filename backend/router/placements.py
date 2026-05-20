from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from control.database import get_db
from control.security import get_current_admin
from model.placement import Placement
from schema.placement import PlacementOut
from utilities.file_handler import delete_file, save_upload

router = APIRouter()


@router.get("/all", response_model=List[PlacementOut])
def list_placements(db: Session = Depends(get_db)):
    return db.query(Placement).order_by(Placement.id.desc()).all()


@router.post("/add", response_model=PlacementOut, status_code=status.HTTP_201_CREATED)
def add_placement(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    row = Placement(image_url=save_upload(file, "placements"))
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/delete/{placement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_placement(
    placement_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    row = db.query(Placement).filter(Placement.id == placement_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Placement not found")
    delete_file(row.image_url)
    db.delete(row)
    db.commit()
