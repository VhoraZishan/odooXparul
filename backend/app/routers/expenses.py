from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from decimal import Decimal

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import Profile
from app.models.trip import TripMember
from app.models.expense import Expense, Invoice

from app.schemas.expense import ExpenseCreate, ExpenseResponse, InvoiceResponse, BudgetInsightsResponse

router = APIRouter(prefix="/trips/{trip_id}/billing", tags=["Billing & Expenses"])

def verify_trip_access(trip_id: str, user_id: str, db: Session, require_edit: bool = False):
    membership = db.query(TripMember).filter(TripMember.trip_id == trip_id, TripMember.user_id == user_id).first()
    if not membership:
        raise HTTPException(status_code=403, detail="Not authorized to access this trip")
    if require_edit and membership.role not in ["owner", "editor"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this trip")

@router.get("/expenses", response_model=List[ExpenseResponse])
def get_expenses(trip_id: str, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db)
    return db.query(Expense).filter(Expense.trip_id == trip_id).all()

@router.post("/expenses", response_model=ExpenseResponse)
def add_expense(trip_id: str, item: ExpenseCreate, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db, require_edit=True)
    db_item = Expense(**item.dict(), trip_id=trip_id, paid_by=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/budget-insights", response_model=BudgetInsightsResponse)
def get_budget_insights(trip_id: str, current_user: Profile = Depends(get_current_user), db: Session = Depends(get_db)):
    verify_trip_access(trip_id, current_user.id, db)
    
    total_spent = db.query(func.sum(Expense.amount)).filter(Expense.trip_id == trip_id).scalar() or Decimal('0.0')
    
    # In a full app, total budget might be set on the Trip or calculated.
    # For now, we mock a total budget or assume it is 0 if not set.
    total_budget = Decimal('20000.0') # Example placeholder
    remaining = total_budget - total_spent
    
    return {
        "total_budget": total_budget,
        "total_spent": total_spent,
        "remaining": remaining
    }
