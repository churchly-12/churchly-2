from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class Prayer(BaseModel):
    id: Optional[str]
    user_id: str
    parish_id: Optional[str] = None
    title: str
    content: str
    is_anonymous: bool = False
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()

class PrayerCreate(BaseModel):
    title: str
    content: str
    is_anonymous: bool = False
    parish_id: Optional[str] = None