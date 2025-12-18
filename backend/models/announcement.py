from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Announcement(BaseModel):
    id: Optional[str]
    parish_id: str
    title: str
    content: str
    created_by: str
    created_at: datetime = datetime.utcnow()