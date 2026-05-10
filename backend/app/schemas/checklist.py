from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID

class ChecklistItemBase(BaseModel):
    category: Optional[str] = None
    item_name: str
    is_packed: Optional[bool] = False

class ChecklistItemCreate(ChecklistItemBase):
    pass

class ChecklistItemResponse(ChecklistItemBase):
    id: UUID
    checklist_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ChecklistResponse(BaseModel):
    id: UUID
    trip_id: UUID
    created_at: datetime
    items: List[ChecklistItemResponse] = []

    class Config:
        from_attributes = True
