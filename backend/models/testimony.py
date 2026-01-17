from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import Optional

class TestimonyCreate(BaseModel):
    content: str
    is_anonymous: bool = False

class Testimony(BaseModel):
    id: Optional[str]
    user_id: str
    content: str
    is_anonymous: bool = False
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.utcnow())
    expires_at: datetime = Field(default_factory=lambda: datetime.utcnow() + timedelta(hours=24))