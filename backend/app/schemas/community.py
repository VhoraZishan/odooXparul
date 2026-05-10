from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class CommunityPostBase(BaseModel):
    trip_id: Optional[UUID] = None
    activity_id: Optional[UUID] = None
    content: str

class CommunityPostCreate(CommunityPostBase):
    pass

class CommunityPostResponse(CommunityPostBase):
    id: UUID
    user_id: UUID
    likes: int
    created_at: datetime

    class Config:
        from_attributes = True
