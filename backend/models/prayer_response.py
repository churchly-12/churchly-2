from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PrayerResponse(BaseModel):
    id: Optional[str]
    prayer_id: str
    user_id: str
    message: str
    created_at: datetime = datetime.utcnow()

class PrayerResponseCreate(BaseModel):
    message: str