from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Event(BaseModel):
    id: Optional[str]
    parish_id: str
    title: str
    description: str
    event_date: datetime
    location: Optional[str]
    created_at: datetime = datetime.utcnow()