import enum

from sqlalchemy import Boolean, Column, Enum as SAEnum, Integer, String, Text

from control.database import Base


class Department(str, enum.Enum):
    CS  = "CS"
    IT  = "IT"
    ECE = "ECE"
    CE  = "CE"
    ME  = "ME"
    MBA = "MBA"
    ESH = "ESH"


class Faculty(Base):
    __tablename__ = "faculty"

    id               = Column(Integer, primary_key=True, index=True)
    name             = Column(String,  nullable=False)
    designation      = Column(String,  nullable=False)   # e.g. "Assistant Professor"
    department       = Column(SAEnum(Department), nullable=False, index=True)
    qualification    = Column(String,  nullable=False)   # e.g. "Ph.D", "M.Tech"
    experience_years = Column(Integer, default=0)
    specialization   = Column(String,  nullable=True)
    email            = Column(String,  nullable=True, unique=True)
    phone            = Column(String,  nullable=True)
    image_url        = Column(String,  nullable=True)
    bio              = Column(Text,    nullable=True)
    is_active        = Column(Boolean, default=True, nullable=False)
