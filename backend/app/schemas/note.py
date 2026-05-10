from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class TripNoteBase(BaseModel):
    note_text: str
    day_reference: Optional[str] = None
    stop_reference: Optional[str] = None

class TripNoteCreate(TripNoteBase):
    pass

class TripNoteResponse(TripNoteBase):
    id: UUID
    trip_id: UUID
    created_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True
