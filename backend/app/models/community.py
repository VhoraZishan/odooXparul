from sqlalchemy import Column, String, DateTime, Integer, text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base

class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    trip_id = Column(UUID(as_uuid=True), ForeignKey("trips.id"))
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id"))
    content = Column(String, nullable=False)
    likes = Column(Integer, server_default="0")
    created_at = Column(DateTime(timezone=True), server_default=text("now()"))
