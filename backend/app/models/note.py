from sqlalchemy import Column, String, DateTime, text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class TripNote(Base):
    __tablename__ = "trip_notes"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    note_text = Column(String, nullable=False)
    day_reference = Column(String) # e.g., 'Day 3: June 14 2025'
    stop_reference = Column(String) # e.g., 'Rome stop'
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
