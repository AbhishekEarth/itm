from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from control.database import get_db
from control.security import get_current_admin
from model.faculty import Department, Faculty
from schema.faculty import FacultyOut, FacultyUpdate
from utilities.file_handler import delete_file, save_upload

router = APIRouter()


@router.get("/", response_model=List[FacultyOut])
def list_faculty(
    department: Optional[Department] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """Public — list active faculty, optionally filtered by department."""
    q = db.query(Faculty).filter(Faculty.is_active.is_(True))
    if department:
        q = q.filter(Faculty.department == department)
    return q.order_by(Faculty.name).offset(skip).limit(limit).all()


@router.get("/{faculty_id}", response_model=FacultyOut)
def get_faculty(faculty_id: int, db: Session = Depends(get_db)):
    row = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Faculty member not found")
    return row


@router.post("/", response_model=FacultyOut, status_code=status.HTTP_201_CREATED)
def create_faculty(
    name: str = Form(...),
    designation: str = Form(...),
    department: Department = Form(...),
    qualification: str = Form(...),
    experience_years: int = Form(0),
    specialization: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),      # admin-only
):
    image_url = save_upload(image, "faculty") if image and image.filename else None
    row = Faculty(
        name=name, designation=designation, department=department,
        qualification=qualification, experience_years=experience_years,
        specialization=specialization or None, email=email or None,
        phone=phone or None, bio=bio or None, image_url=image_url,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.patch("/{faculty_id}", response_model=FacultyOut)
def update_faculty(
    faculty_id: int,
    data: FacultyUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    row = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Faculty member not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{faculty_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faculty(
    faculty_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    row = db.query(Faculty).filter(Faculty.id == faculty_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Faculty member not found")
    if row.image_url:
        delete_file(row.image_url)
    db.delete(row)
    db.commit()
