from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.trip import TripCreate, TripResponse
from app.database import get_db
from app.models.trip import Trip
from uuid import UUID

router = APIRouter()

@router.post("/trips/", response_model=TripResponse)
def create_trip(trip: TripCreate, db: Session = Depends(get_db)):
    
    new_trip = Trip(
        owner_id=UUID("edb2fb45-32a9-4bbc-b3cd-47efd0889ed5"),
        title=trip.title,
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date
    )

    db.add(new_trip) 
    db.commit()
    db.refresh(new_trip)

    return new_trip