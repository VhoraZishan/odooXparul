from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.schemas.auth import UserSignup, UserLogin, AuthResponse
from app.database import get_db
from app.models.user import Profile, UserPreference
from app.auth_utils import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=AuthResponse)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    # 1. Check if user already exists
    existing_user = db.query(Profile).filter(Profile.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Hash password and create Profile
    hashed_pwd = get_password_hash(user_data.password)
    
    new_profile = Profile(
        email=user_data.email,
        hashed_password=hashed_pwd,
        full_name=user_data.full_name,
        phone=user_data.phone
    )
    db.add(new_profile)
    db.flush() # Get the new profile ID
    
    # 3. Initialize default UserPreferences
    new_prefs = UserPreference(
        user_id=new_profile.id,
        default_currency="USD",
    )
    db.add(new_prefs)
    db.commit()
    db.refresh(new_profile)

    # 4. Generate JWT
    access_token = create_access_token(data={"sub": str(new_profile.id)})

    return AuthResponse(
        access_token=access_token,
        refresh_token="local_refresh_tokens_not_implemented",
        user_id=str(new_profile.id)
    )

@router.post("/login", response_model=AuthResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # 1. Find user
    user = db.query(Profile).filter(Profile.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 2. Verify password
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # 3. Generate JWT
    access_token = create_access_token(data={"sub": str(user.id)})

    return AuthResponse(
        access_token=access_token,
        refresh_token="local_refresh_tokens_not_implemented",
        user_id=str(user.id)
    )
