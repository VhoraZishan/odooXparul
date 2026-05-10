from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID

class UserPreferenceBase(BaseModel):
    default_currency: Optional[str] = "USD"
    default_country: Optional[str] = None
    language: Optional[str] = "en"
    notifications_enabled: Optional[bool] = True

class ProfileBase(BaseModel):
    full_name: str
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None
    bio: Optional[str] = None

class ProfileUpdate(ProfileBase):
    full_name: Optional[str] = None

class ProfileResponse(ProfileBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    preferences: Optional[UserPreferenceBase] = None

    class Config:
        from_attributes = True
