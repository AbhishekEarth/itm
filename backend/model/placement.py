from sqlalchemy import Column, Integer, String

from control.database import Base


class Placement(Base):
    __tablename__ = "placements"

    id        = Column(Integer, primary_key=True, index=True)
    image_url = Column(String,  nullable=False)
