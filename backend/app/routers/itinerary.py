from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import Profile
from app.models.trip import TripMember
from app.models.itinerary import Accommodation, Activity, Flight, Transportation

from app.schemas.itinerary import (
    AccommodationCreate, AccommodationResponse,
    ActivityCreate, ActivityResponse,
    FlightCreate, FlightResponse,
    TransportationCreate, TransportationResponse
)

router = APIRouter(prefix="/trips/{trip_id}/itinerary", tags=["Itinerary"])

def verify_trip_access(trip_id: str, user_id: str, db: Session, require_edit: bool = False):
    membership = db.query(TripMember).filter(TripMember.trip_id == trip_id, TripMember.user_id == user_id).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not authorized to access this trip")
    if require_edit and membership.role not in ["owner", "editor"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this trip")

@router.get("")
def get_full_itinerary(trip_id: str, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db)
    
    accommodations = db.query(Accommodation).filter(Accommodation.trip_id == trip_id).all()
    activities = db.query(Activity).filter(Activity.trip_id == trip_id).all()
    flights = db.query(Flight).filter(Flight.trip_id == trip_id).all()
    transportation = db.query(Transportation).filter(Transportation.trip_id == trip_id).all()
    
    # In a real app, you would group these by date here for the frontend Day 1, Day 2 view
    return {
        "accommodations": accommodations,
        "activities": activities,
        "flights": flights,
        "transportation": transportation
    }

@router.post("/accommodations", response_model=AccommodationResponse)
def add_accommodation(trip_id: str, item: AccommodationCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db, require_edit=True)
    db_item = Accommodation(**item.dict(), trip_id=trip_id, created_by=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.post("/activities", response_model=ActivityResponse)
def add_activity(trip_id: str, item: ActivityCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db, require_edit=True)
    db_item = Activity(**item.dict(), trip_id=trip_id, created_by=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.post("/flights", response_model=FlightResponse)
def add_flight(trip_id: str, item: FlightCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db, require_edit=True)
    db_item = Flight(**item.dict(), trip_id=trip_id, created_by=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.post("/transportation", response_model=TransportationResponse)
def add_transportation(trip_id: str, item: TransportationCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db, require_edit=True)
    db_item = Transportation(**item.dict(), trip_id=trip_id, created_by=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item
