from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PasswordResetToken(BaseModel):
    id: Optional[str]
    user_id: str
    token: str
    expires_at: datetime
    created_at: datetime = datetime.utcnow()