from sqlalchemy import Column, String, Numeric, DateTime, Date, Boolean, text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    paid_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    title = Column(String, nullable=False)
    amount = Column(Numeric, nullable=False)
    currency = Column(String, server_default="USD")
    category = Column(String) # 'accommodation', 'flight', 'transport', 'food', 'activity', 'shopping', 'other'
    receipt_url = Column(String)
    date = Column(Date, server_default=text("CURRENT_DATE"))
    notes = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))

    trip = relationship("Trip", back_populates="expenses")
    splits = relationship("ExpenseSplit", back_populates="expense")

class ExpenseSplit(Base):
    __tablename__ = "expense_splits"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    expense_id = Column(UUID(as_uuid=True), ForeignKey("expenses.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    amount = Column(Numeric, nullable=False)
    is_settled = Column(Boolean, server_default="false")
    settled_at = Column(DateTime(timezone=True))

    expense = relationship("Expense", back_populates="splits")

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    invoice_number = Column(String, unique=True, nullable=False)
    subtotal = Column(Numeric, nullable=False)
    tax = Column(Numeric, default=0.0)
    discount = Column(Numeric, default=0.0)
    total = Column(Numeric, nullable=False)
    status = Column(String, server_default="pending") # 'pending', 'paid'
    generated_date = Column(Date, server_default=text("CURRENT_DATE"))
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
