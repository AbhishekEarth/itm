from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from control.database import get_db
from control.security import create_access_token, hash_password, verify_password
from model.admin import AdminUser
from model.faculty import Faculty
from model.student import Student

router = APIRouter()


@router.post("/login")
def admin_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Admin login — returns JWT with role=admin."""
    user = db.query(AdminUser).filter(AdminUser.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": user.username, "role": "admin"})
    return {"access_token": token, "token_type": "bearer", "role": "admin"}


@router.post("/student-login")
def student_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Student login — username = enrollment_no, default password = enrollment_no."""
    student = db.query(Student).filter(
        Student.enrollment_no == form_data.username,
        Student.is_active.is_(True),
    ).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Student not found")

    # If no password set yet, default is the enrollment number itself
    if student.password_hash:
        ok = verify_password(form_data.password, student.password_hash)
    else:
        ok = form_data.password == student.enrollment_no
        if ok:
            # Auto-hash on first successful login
            student.password_hash = hash_password(form_data.password)
            db.commit()

    if not ok:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    token = create_access_token({
        "sub": student.enrollment_no,
        "role": "student",
        "id": student.id,
        "name": student.name,
        "department": student.department,
        "year": student.year,
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": "student",
        "user": {
            "id": student.id,
            "name": student.name,
            "enrollment_no": student.enrollment_no,
            "department": student.department,
            "year": student.year,
            "batch": student.batch,
            "email": student.email,
            "phone": student.phone,
            "image_url": student.image_url,
        },
    }


@router.post("/faculty-login")
def faculty_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """Faculty login — username = email, default password = faculty@123."""
    DEFAULT_PW = "faculty@123"
    faculty = db.query(Faculty).filter(
        Faculty.email == form_data.username,
        Faculty.is_active.is_(True),
    ).first()
    if not faculty:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Faculty not found")

    if faculty.password_hash:
        ok = verify_password(form_data.password, faculty.password_hash)
    else:
        ok = form_data.password == DEFAULT_PW
        if ok:
            faculty.password_hash = hash_password(form_data.password)
            db.commit()

    if not ok:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    token = create_access_token({
        "sub": faculty.email,
        "role": "faculty",
        "id": faculty.id,
        "name": faculty.name,
        "department": faculty.department,
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": "faculty",
        "user": {
            "id": faculty.id,
            "name": faculty.name,
            "designation": faculty.designation,
            "department": faculty.department,
            "qualification": faculty.qualification,
            "experience_years": faculty.experience_years,
            "specialization": faculty.specialization,
            "email": faculty.email,
            "phone": faculty.phone,
            "image_url": faculty.image_url,
            "bio": faculty.bio,
        },
    }
