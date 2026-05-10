from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID

class TripBase(BaseModel):
    title: str
    description: Optional[str] = None
    cover_image: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_public: Optional[bool] = False
    currency: Optional[str] = "USD"

class TripCreate(TripBase):
    pass

class TripUpdate(TripBase):
    title: Optional[str] = None

class TripResponse(TripBase):
    id: UUID
    owner_id: UUID
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
