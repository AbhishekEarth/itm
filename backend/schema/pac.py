from datetime import date
from typing import List
from pydantic import BaseModel


class PACImageOut(BaseModel):
    image_url: str
    model_config = {"from_attributes": True}


class PACEventOut(BaseModel):
    id: int
    title: str
    director: str
    event_date: date
    description: str
    images: List[PACImageOut] = []

    model_config = {"from_attributes": True}
