from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.supabase_client import supabase
from app.database import get_db
from app.models.user import Profile

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not configured")

    try:
        # Get user from Supabase using the token
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user_id = user_response.user.id
        
        # Verify user exists in our local profiles table
        profile = db.query(Profile).filter(Profile.id == user_id).first()
        if not profile:
            raise HTTPException(status_code=404, detail="User profile not found")
            
        return profile
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
