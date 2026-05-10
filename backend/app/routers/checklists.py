from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import Profile
from app.models.trip import TripMember
from app.models.checklist import Checklist, ChecklistItem

from app.schemas.checklist import ChecklistItemCreate, ChecklistItemResponse, ChecklistResponse

router = APIRouter(prefix="/trips/{trip_id}/checklist", tags=["Checklists"])

def verify_trip_access(trip_id: str, user_id: str, db: Session, require_edit: bool = False):
    membership = db.query(TripMember).filter(TripMember.trip_id == trip_id, TripMember.user_id == user_id).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not authorized to access this trip")
    if require_edit and membership.role not in ["owner", "editor"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this trip")

def get_or_create_checklist(trip_id: str, db: Session):
    checklist = db.query(Checklist).filter(Checklist.trip_id == trip_id).first()
    if not checklist:
        checklist = Checklist(trip_id=trip_id)
        db.add(checklist)
        db.commit()
        db.refresh(checklist)
    return checklist

@router.get("", response_model=ChecklistResponse)
def get_checklist(trip_id: str, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db)
    checklist = get_or_create_checklist(trip_id, db)
    return checklist

@router.post("/items", response_model=ChecklistItemResponse)
def add_checklist_item(trip_id: str, item: ChecklistItemCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db, require_edit=True)
    checklist = get_or_create_checklist(trip_id, db)
    
    db_item = ChecklistItem(**item.dict(), checklist_id=checklist.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.patch("/items/{item_id}", response_model=ChecklistItemResponse)
def toggle_item(trip_id: str, item_id: str, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db, require_edit=True)
    
    db_item = db.query(ChecklistItem).filter(ChecklistItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
        
    db_item.is_packed = not db_item.is_packed
    db.commit()
    db.refresh(db_item)
    return db_item
