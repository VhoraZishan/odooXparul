from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime, date
from uuid import UUID

class ExpenseBase(BaseModel):
    title: str
    amount: Decimal
    currency: Optional[str] = "USD"
    category: Optional[str] = None
    receipt_url: Optional[str] = None
    date: Optional[date] = None
    notes: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseResponse(ExpenseBase):
    id: UUID
    trip_id: UUID
    paid_by: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class InvoiceResponse(BaseModel):
    id: UUID
    trip_id: UUID
    invoice_number: str
    subtotal: Decimal
    tax: Decimal
    discount: Decimal
    total: Decimal
    status: str
    generated_date: date
    created_at: datetime

    class Config:
        from_attributes = True

class BudgetInsightsResponse(BaseModel):
    total_budget: Decimal
    total_spent: Decimal
    remaining: Decimal
