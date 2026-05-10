from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.destination import Destination
from app.models.itinerary import Activity
from app.schemas.destination import DestinationResponse
from app.schemas.itinerary import ActivityResponse

router = APIRouter(prefix="/explore", tags=["Explore"])

@router.get("/destinations", response_model=List[DestinationResponse])
def search_destinations(query: Optional[str] = None, db: Session = Depends(get_db)):
    """Search for cities, countries, or landmarks"""
    db_query = db.query(Destination)
    if query:
        db_query = db_query.filter(Destination.name.ilike(f"%{query}%"))
    return db_query.limit(20).all()

@router.get("/activities", response_model=List[ActivityResponse])
def explore_activities(destination_id: Optional[str] = None, category: Optional[str] = None, db: Session = Depends(get_db)):
    """Search for popular activities globally or by destination"""
    db_query = db.query(Activity).filter(Activity.trip_id == None) # Assuming global activities have no trip_id
    
    if destination_id:
        db_query = db_query.filter(Activity.destination_id == destination_id)
    if category:
        db_query = db_query.filter(Activity.activity_type == category)
        
    return db_query.limit(20).all()
