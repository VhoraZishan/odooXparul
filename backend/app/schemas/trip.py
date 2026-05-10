from pydantic import BaseModel
from datetime import date
from uuid import UUID

class TripCreate(BaseModel):
    title: str
    description: str | None = None
    start_date: date | None = None
    end_date: date | None = None


class TripResponse(BaseModel):
    id: UUID
    title: str
    description: str | None
    start_date: date | None
    end_date: date | None
    is_public: bool

    class Config:
        from_attributes = True