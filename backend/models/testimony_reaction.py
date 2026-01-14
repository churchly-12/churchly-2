from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal

ReactionType = Literal["praise", "amen", "thanks"]

class TestimonyReaction(BaseModel):
    id: Optional[str]
    testimony_id: str
    user_id: str
    reaction: ReactionType
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())

class TestimonyReactionCreate(BaseModel):
    reaction: ReactionType