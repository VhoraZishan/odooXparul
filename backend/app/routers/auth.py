from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.schemas.auth import UserSignup, UserLogin, AuthResponse
from app.supabase_client import supabase
from app.database import get_db
from app.models.user import Profile, UserPreference

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=AuthResponse)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not configured")

    try:
        # 1. Sign up the user in Supabase Auth
        response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password
        })

        if not response.user:
            raise HTTPException(status_code=400, detail="Signup failed")

        user_id = response.user.id

        # 2. Create the custom Profile in our database
        new_profile = Profile(
            id=user_id,
            full_name=user_data.full_name,
            phone=user_data.phone
        )
        db.add(new_profile)
        db.flush() # flush to get the profile ID context (optional here but good practice)

        # 3. Initialize default UserPreferences
        new_prefs = UserPreference(
            user_id=user_id,
            default_currency="USD",
        )
        db.add(new_prefs)
        
        db.commit()

        return AuthResponse(
            access_token=response.session.access_token,
            refresh_token=response.session.refresh_token,
            user_id=user_id
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=AuthResponse)
def login(user_data: UserLogin):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not configured")

    try:
        response = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password
        })

        if not response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return AuthResponse(
            access_token=response.session.access_token,
            refresh_token=response.session.refresh_token,
            user_id=response.user.id
        )

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
