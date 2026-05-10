from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import Profile
from app.models.trip import TripMember
from app.models.note import TripNote

from app.schemas.note import TripNoteCreate, TripNoteResponse

router = APIRouter(prefix="/trips/{trip_id}/notes", tags=["Notes & Journals"])

def verify_trip_access(trip_id: str, user_id: str, db: Session, require_edit: bool = False):
    membership = db.query(TripMember).filter(TripMember.trip_id == trip_id, TripMember.user_id == user_id).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not authorized to access this trip")
    if require_edit and membership.role not in ["owner", "editor"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this trip")

@router.get("", response_model=List[TripNoteResponse])
def get_notes(trip_id: str, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db)
    return db.query(TripNote).filter(TripNote.trip_id == trip_id).order_by(TripNote.created_at.desc()).all()

@router.post("", response_model=TripNoteResponse)
def create_note(trip_id: str, note: TripNoteCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db, require_edit=True)
    db_note = TripNote(**note.dict(), trip_id=trip_id, created_by=current_user.id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note
