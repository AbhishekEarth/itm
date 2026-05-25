from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from control.database import get_db
from control.security import get_current_admin
from model.student import Student, Year
from schema.student import StudentOut, StudentUpdate
from utilities.file_handler import delete_file, save_upload

router = APIRouter()


@router.get("/", response_model=List[StudentOut])
def list_students(
    department: Optional[str] = None,
    year: Optional[Year] = None,
    batch: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    """Public — list active students with optional filters."""
    q = db.query(Student).filter(Student.is_active.is_(True))
    if department:
        q = q.filter(Student.department == department)
    if year:
        q = q.filter(Student.year == year)
    if batch:
        q = q.filter(Student.batch == batch)
    return q.order_by(Student.name).offset(skip).limit(limit).all()


@router.get("/{student_id}", response_model=StudentOut)
def get_student(student_id: int, db: Session = Depends(get_db)):
    row = db.query(Student).filter(Student.id == student_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Student not found")
    return row


@router.post("/", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def create_student(
    enrollment_no: str = Form(...),
    name: str = Form(...),
    department: str = Form(...),
    year: Year = Form(...),
    batch: str = Form(...),
    email: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),      # admin-only
):
    if db.query(Student).filter(Student.enrollment_no == enrollment_no).first():
        raise HTTPException(status_code=409, detail="Enrollment number already registered")
    image_url = save_upload(image, "students") if image and image.filename else None
    row = Student(
        enrollment_no=enrollment_no, name=name, department=department,
        year=year, batch=batch, email=email or None,
        phone=phone or None, image_url=image_url,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@router.patch("/{student_id}", response_model=StudentOut)
def update_student(
    student_id: int,
    data: StudentUpdate,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    row = db.query(Student).filter(Student.id == student_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Student not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(row, field, value)
    db.commit()
    db.refresh(row)
    return row


@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    _=Depends(get_current_admin),
):
    row = db.query(Student).filter(Student.id == student_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Student not found")
    if row.image_url:
        delete_file(row.image_url)
    db.delete(row)
    db.commit()
