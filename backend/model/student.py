import enum

from sqlalchemy import Boolean, Column, Enum as SAEnum, Integer, String

from control.database import Base


class Year(str, enum.Enum):
    FIRST  = "1st"
    SECOND = "2nd"
    THIRD  = "3rd"
    FOURTH = "4th"


class Student(Base):
    __tablename__ = "students"

    id            = Column(Integer, primary_key=True, index=True)
    enrollment_no = Column(String,  unique=True, nullable=False, index=True)
    name          = Column(String,  nullable=False)
    department    = Column(String,  nullable=False, index=True)  # "CS", "IT", …
    year          = Column(SAEnum(Year), nullable=False)
    batch         = Column(String,  nullable=False)              # e.g. "2022-2026"
    email         = Column(String,  nullable=True, unique=True)
    phone         = Column(String,  nullable=True)
    image_url     = Column(String,  nullable=True)
    is_active     = Column(Boolean, default=True, nullable=False)
