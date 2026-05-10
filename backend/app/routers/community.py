from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import Profile
from app.models.community import CommunityPost

from app.schemas.community import CommunityPostCreate, CommunityPostResponse

router = APIRouter(prefix="/community", tags=["Community"])

@router.get("/posts", response_model=List[CommunityPostResponse])
def get_posts(db: Session = Depends(get_db)):
    """Fetch public community posts"""
    return db.query(CommunityPost).order_by(CommunityPost.created_at.desc()).limit(50).all()

@router.post("/posts", response_model=CommunityPostResponse)
def create_post(post: CommunityPostCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    """Share a trip or activity to the community"""
    db_post = CommunityPost(**post.dict(), user_id=current_user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post
