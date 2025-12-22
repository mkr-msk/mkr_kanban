from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class CardBase(BaseModel):
    title: str = Field(..., max_length=500)
    description: Optional[str] = None
    status: str = Field(default="todo", pattern="^(todo|in_progress|done)$")
    priority: str = Field(default="P3", pattern="^(P0|P1|P2|P3)$")
    position: int = Field(default=0, ge=0)

class CardCreate(CardBase):
    pass

class CardUpdate(BaseModel):
    description: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(todo|in_progress|done)$")
    priority: Optional[str] = Field(None, pattern="^(P0|P1|P2|P3)$")
    position: Optional[int] = Field(None, ge=0)

class CardResponse(CardBase):
    project_id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True