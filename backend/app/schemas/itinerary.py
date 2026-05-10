from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime, date
from uuid import UUID

class ActivityBase(BaseModel):
    destination_id: Optional[UUID] = None
    name: str
    description: Optional[str] = None
    activity_type: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location_address: Optional[str] = None
    cost_amount: Optional[Decimal] = None
    cost_currency: Optional[str] = "USD"
    booking_url: Optional[str] = None
    notes: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: UUID
    trip_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AccommodationBase(BaseModel):
    destination_id: Optional[UUID] = None
    name: str
    address: Optional[str] = None
    check_in: Optional[date] = None
    check_out: Optional[date] = None
    confirmation_number: Optional[str] = None
    price_amount: Optional[Decimal] = None
    price_currency: Optional[str] = "USD"
    booking_url: Optional[str] = None
    notes: Optional[str] = None

class AccommodationCreate(AccommodationBase):
    pass

class AccommodationResponse(AccommodationBase):
    id: UUID
    trip_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FlightBase(BaseModel):
    origin_id: Optional[UUID] = None
    destination_id: Optional[UUID] = None
    airline: Optional[str] = None
    flight_number: Optional[str] = None
    departure_time: Optional[datetime] = None
    arrival_time: Optional[datetime] = None
    booking_reference: Optional[str] = None
    price_amount: Optional[Decimal] = None
    price_currency: Optional[str] = "USD"
    booking_url: Optional[str] = None
    notes: Optional[str] = None

class FlightCreate(FlightBase):
    pass

class FlightResponse(FlightBase):
    id: UUID
    trip_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class TransportationBase(BaseModel):
    type: str
    origin_address: Optional[str] = None
    destination_address: Optional[str] = None
    pickup_time: Optional[datetime] = None
    dropoff_time: Optional[datetime] = None
    provider: Optional[str] = None
    booking_reference: Optional[str] = None
    price_amount: Optional[Decimal] = None
    price_currency: Optional[str] = "USD"
    notes: Optional[str] = None

class TransportationCreate(TransportationBase):
    pass

class TransportationResponse(TransportationBase):
    id: UUID
    trip_id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
