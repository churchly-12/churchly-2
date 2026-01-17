from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Literal

NotificationType = Literal["prayer_reaction", "prayer_response", "announcement", "testimony_reaction"]

class Notification(BaseModel):
    id: Optional[str]
    user_id: str
    type: NotificationType
    message: str
    is_read: bool = False
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    related_id: Optional[str] = None  # e.g., prayer_id

class NotificationCreate(BaseModel):
    type: NotificationType
    message: str
    related_id: Optional[str] = None