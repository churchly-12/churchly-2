from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from bson import ObjectId

class User(BaseModel):
    id: Optional[str]
    full_name: str
    email: EmailStr
    password: str
    mobile: Optional[str]
    parish_id: Optional[str]
    role: str = "user"
    is_active: bool = True
    is_verified: bool = False
    is_deleted: bool = False
    deleted_at: Optional[datetime] = None
    email_verification_token: Optional[str] = None
    email_verification_expires: Optional[datetime] = None
    password_reset_token: Optional[str] = None
    password_reset_expires: Optional[datetime] = None
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()