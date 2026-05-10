from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from datetime import datetime

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import Profile
from app.models.trip import Trip, TripMember
from app.schemas.user import ProfileResponse, ProfileUpdate
from app.schemas.trip import TripResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=ProfileResponse)
def get_me(current_user: Profile = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=ProfileResponse)
def update_me(profile_update: ProfileUpdate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    for key, value in profile_update.dict(exclude_unset=True).items():
        setattr(current_user, key, value)
    
    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/me/trips", response_model=Dict[str, List[TripResponse]])
def get_my_trips(current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    # Get all trips user is a member of
    memberships = db.query(TripMember).filter(TripMember.user_id == current_user.id).all()
    trip_ids = [m.trip_id for m in memberships]
    
    trips = db.query(Trip).filter(Trip.id.in_(trip_ids)).all()
    
    # Simple categorization based on dates
    today = datetime.utcnow().date()
    result = {
        "ongoing": [],
        "upcoming": [],
        "completed": []
    }
    
    for t in trips:
        if t.start_date and t.end_date:
            if t.end_date < today:
                result["completed"].append(t)
            elif t.start_date > today:
                result["upcoming"].append(t)
            else:
                result["ongoing"].append(t)
        else:
            # Without dates, put them in upcoming
            result["upcoming"].append(t)
            
    return result
