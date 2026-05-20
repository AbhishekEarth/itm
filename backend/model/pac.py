from sqlalchemy import Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from control.database import Base


class PACEvent(Base):
    __tablename__ = "pac_events"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    director    = Column(String, nullable=False)
    event_date  = Column(Date,   nullable=False)
    description = Column(Text,   nullable=False)

    images = relationship("PACImage", back_populates="event", cascade="all, delete-orphan")


class PACImage(Base):
    __tablename__ = "pac_images"

    id        = Column(Integer, primary_key=True, index=True)
    event_id  = Column(Integer, ForeignKey("pac_events.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)

    event = relationship("PACEvent", back_populates="images")
