from sqlalchemy import Column, String, Date, Boolean, ForeignKey, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True) # References auth.users(id) in Supabase
    full_name = Column(String, nullable=False)
    avatar_url = Column(String)
    phone = Column(String)
    date_of_birth = Column(Date)
    bio = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

    # Relationships
    preferences = relationship("UserPreference", back_populates="user", uselist=False)
    trips_owned = relationship("Trip", back_populates="owner", foreign_keys="[Trip.owner_id]")
    trip_memberships = relationship("TripMember", back_populates="user")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False, unique=True)
    default_currency = Column(String, server_default="USD")
    default_country = Column(String)
    language = Column(String, server_default="en")
    notifications_enabled = Column(Boolean, server_default="true")

    user = relationship("Profile", back_populates="preferences")
