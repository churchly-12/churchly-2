from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Literal

ReactionType = Literal["prayed", "amen", "peace"]

class PrayerReaction(BaseModel):
    id: Optional[str]
    prayer_id: str
    user_id: str
    reaction: ReactionType
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    created_at: datetime = datetime.utcnow()

class PrayerReactionCreate(BaseModel):
    reaction: ReactionType