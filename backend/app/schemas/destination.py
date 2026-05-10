from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime
from uuid import UUID

class DestinationBase(BaseModel):
    name: str
    type: str # 'city', 'airport', 'landmark', 'country'
    country: Optional[str] = None
    state: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    timezone: Optional[str] = None

class DestinationCreate(DestinationBase):
    pass

class DestinationResponse(DestinationBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
