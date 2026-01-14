from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PrayerResponse(BaseModel):
    id: Optional[str]
    prayer_id: str
    user_id: str
    message: str
    author_name: Optional[str] = None
    is_approved: bool = True
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    created_at: datetime = datetime.utcnow()

class PrayerResponseCreate(BaseModel):
    message: str