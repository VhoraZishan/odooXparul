from sqlalchemy import Column, String, DateTime, Boolean, text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Checklist(Base):
    __tablename__ = "checklists"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))

    items = relationship("ChecklistItem", back_populates="checklist", cascade="all, delete-orphan")

class ChecklistItem(Base):
    __tablename__ = "checklist_items"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    checklist_id = Column(UUID(as_uuid=True), ForeignKey("checklists.id"), nullable=False)
    category = Column(String) # e.g., 'Documents', 'Clothing', 'Electronics'
    item_name = Column(String, nullable=False)
    is_packed = Column(Boolean, server_default="false")
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))

    checklist = relationship("Checklist", back_populates="items")
