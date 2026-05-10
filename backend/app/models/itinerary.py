from sqlalchemy import Column, String, Numeric, DateTime, Date, text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Accommodation(Base):
    __tablename__ = "accommodations"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id"))
    name = Column(String, nullable=False)
    address = Column(String)
    check_in = Column(Date)
    check_out = Column(Date)
    confirmation_number = Column(String)
    price_amount = Column(Numeric)
    price_currency = Column(String, server_default="USD")
    booking_url = Column(String)
    notes = Column(String)
    created_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

    trip = relationship("Trip", back_populates="accommodations")
    # destination = relationship("Destination", back_populates="accommodations")


class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id"))
    name = Column(String, nullable=False)
    description = Column(String)
    activity_type = Column(String)
    start_time = Column(DateTime(timezone=True))
    end_time = Column(DateTime(timezone=True))
    location_address = Column(String)
    latitude = Column(Numeric)
    longitude = Column(Numeric)
    cost_amount = Column(Numeric)
    cost_currency = Column(String, server_default="USD")
    booking_url = Column(String)
    notes = Column(String)
    created_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

    trip = relationship("Trip", back_populates="activities")


class Flight(Base):
    __tablename__ = "flights"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    origin_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id"))
    destination_id = Column(UUID(as_uuid=True), ForeignKey("destinations.id"))
    airline = Column(String)
    flight_number = Column(String)
    departure_time = Column(DateTime(timezone=True))
    arrival_time = Column(DateTime(timezone=True))
    booking_reference = Column(String)
    price_amount = Column(Numeric)
    price_currency = Column(String, server_default="USD")
    booking_url = Column(String)
    notes = Column(String)
    created_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

    trip = relationship("Trip", back_populates="flights")


class Transportation(Base):
    __tablename__ = "transportation"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    type = Column(String, nullable=False) # 'cab', 'train', 'bus', 'car_rental', 'other'
    origin_address = Column(String)
    origin_latitude = Column(Numeric)
    origin_longitude = Column(Numeric)
    destination_address = Column(String)
    destination_latitude = Column(Numeric)
    destination_longitude = Column(Numeric)
    pickup_time = Column(DateTime(timezone=True))
    dropoff_time = Column(DateTime(timezone=True))
    provider = Column(String)
    booking_reference = Column(String)
    price_amount = Column(Numeric)
    price_currency = Column(String, server_default="USD")
    notes = Column(String)
    created_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("now()"))

    trip = relationship("Trip", back_populates="transportation")
