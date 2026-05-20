from pydantic import BaseModel


class PlacementOut(BaseModel):
    id: int
    image_url: str

    model_config = {"from_attributes": True}
