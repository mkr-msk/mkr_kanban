from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.core.database import Base

class Card(Base):
    __tablename__ = "cards"

    title = Column(String(500), primary_key=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), nullable=False)
    priority = Column(String(2), nullable=False, default="P3")
    position = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("status IN ('todo', 'in_progress', 'done')", name='ck_card_status'),
        CheckConstraint("priority IN ('P0', 'P1', 'P2', 'P3')", name='ck_card_priority'),
        Index('idx_cards_project_status', 'project_id', 'status'),
        Index('idx_cards_user', 'user_id'),
    )