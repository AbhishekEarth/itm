from datetime import date
from pydantic import BaseModel


class TAPEventOut(BaseModel):
    id: int
    title: str
    description: str
    icon: str
    event_date: date
    image_url: str

    model_config = {"from_attributes": True}
