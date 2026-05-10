from sqlalchemy import Column, String, Numeric, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String, nullable=False)
    type = Column(String, nullable=False) # 'city', 'airport', 'landmark', 'country'
    country = Column(String)
    state = Column(String)
    latitude = Column(Numeric)
    longitude = Column(Numeric)
    timezone = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))

    # Relationships
    # accommodations = relationship("Accommodation", back_populates="destination")
    # activities = relationship("Activity", back_populates="destination")
