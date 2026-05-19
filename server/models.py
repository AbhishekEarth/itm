from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class Placement(Base):
    __tablename__ = "placements"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String, nullable=False)


class PACEvent(Base):
    __tablename__ = "pac_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    director = Column(String, nullable=False)
    event_date = Column(Date, nullable=False)
    description = Column(Text, nullable=False)

    images = relationship(
        "PACImage",
        back_populates="event",
        cascade="all, delete-orphan",
    )


class PACImage(Base):
    __tablename__ = "pac_images"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("pac_events.id", ondelete="CASCADE"))
    image_url = Column(String, nullable=False)

    event = relationship("PACEvent", back_populates="images")


class TAPEvent(Base):
    __tablename__ = "tap_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, default="📅")
    event_date = Column(Date, nullable=False)
    image_url = Column(String, nullable=False)
