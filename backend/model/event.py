from sqlalchemy import Column, Date, Integer, String, Text

from control.database import Base


class TAPEvent(Base):
    __tablename__ = "tap_events"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    description = Column(Text,   nullable=False)
    icon        = Column(String, default="📅")
    event_date  = Column(Date,   nullable=False)
    image_url   = Column(String, nullable=False)
