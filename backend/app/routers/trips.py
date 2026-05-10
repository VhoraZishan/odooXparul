from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import Profile
from app.models.trip import Trip, TripMember
from app.schemas.trip import TripCreate, TripUpdate, TripResponse

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.post("", response_model=TripResponse)
def create_trip(trip_in: TripCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    new_trip = Trip(**trip_in.dict(), owner_id=current_user.id)
    db.add(new_trip)
    db.flush()
    
    # Automatically add owner as a member
    member = TripMember(trip_id=new_trip.id, user_id=current_user.id, role="owner")
    db.add(member)
    
    db.commit()
    db.refresh(new_trip)
    return new_trip

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: str, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    # Verify membership
    membership = db.query(TripMember).filter(TripMember.trip_id == trip_id, TripMember.user_id == current_user.id).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not authorized to access this trip")
        
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    return trip

@router.put("/{trip_id}", response_model=TripResponse)
def update_trip(trip_id: str, trip_update: TripUpdate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    membership = db.query(TripMember).filter(TripMember.trip_id == trip_id, TripMember.user_id == current_user.id).first()
    if not membership or membership.role not in ["owner", "editor"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this trip")
        
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    for key, value in trip_update.dict(exclude_unset=True).items():
        setattr(trip, key, value)
        
    db.commit()
    db.refresh(trip)
    return trip