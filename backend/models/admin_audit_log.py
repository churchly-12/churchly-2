from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from bson import ObjectId

class AdminAuditLog(BaseModel):
    id: Optional[str]
    admin_user_id: str
    action: str  # e.g., "USER_DEACTIVATED", "ROLE_CREATED", etc.
    entity_type: str  # "User", "Role", "Prayer", "Parish"
    entity_id: str
    metadata: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    created_at: datetime = datetime.utcnow()