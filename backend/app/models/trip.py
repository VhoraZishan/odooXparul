from sqlalchemy import Column, String, Date, Boolean
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import uuid

class Trip(Base):
    __tablename__ = "trips"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    owner_id = Column(UUID(as_uuid=True), nullable=False)

    title = Column(String, nullable=False)

    description = Column(String)

    start_date = Column(Date)

    end_date = Column(Date)

    is_public = Column(Boolean, default=False)