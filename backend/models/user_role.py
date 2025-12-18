from pydantic import BaseModel
from typing import Optional

class UserRole(BaseModel):
    id: Optional[str]
    user_id: str
    role_id: str