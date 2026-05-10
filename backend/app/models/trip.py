from sqlalchemy import Column, String, Date, Boolean, ForeignKey, DateTime, text, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    owner_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    cover_image = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    status = Column(String, server_default="planning") # 'planning', 'active', 'completed', 'cancelled'
    is_public = Column(Boolean, server_default="false")
    budget_amount = Column(Numeric(10, 2), nullable=True)
    currency = Column(String, server_default="USD")
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

    # Relationships
    owner = relationship("Profile", back_populates="trips_owned")
    members = relationship("TripMember", back_populates="trip")
    invites = relationship("TripInvite", back_populates="trip")
    accommodations = relationship("Accommodation", back_populates="trip")
    activities = relationship("Activity", back_populates="trip")
    flights = relationship("Flight", back_populates="trip")
    transportation = relationship("Transportation", back_populates="trip")
    expenses = relationship("Expense", back_populates="trip")


class TripMember(Base):
    __tablename__ = "trip_members"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    role = Column(String, server_default="member") # 'owner', 'editor', 'viewer'
    joined_at = Column(DateTime(timezone=True), server_default=text("now()"))

    trip = relationship("Trip", back_populates="members")
    user = relationship("Profile", back_populates="trip_memberships")


class TripInvite(Base):
    __tablename__ = "trip_invites"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    email = Column(String, nullable=False)
    role = Column(String, server_default="editor") # 'editor', 'viewer'
    token = Column(String, unique=True)
    expires_at = Column(DateTime(timezone=True))
    accepted_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))

    trip = relationship("Trip", back_populates="invites")