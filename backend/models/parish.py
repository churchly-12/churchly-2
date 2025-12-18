from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Parish(BaseModel):
    id: Optional[str]
    name: str
    zone: Optional[str]
    location: Optional[str]
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    created_at: datetime = datetime.utcnow()