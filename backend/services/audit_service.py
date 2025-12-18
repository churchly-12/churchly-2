from database import admin_audit_logs_collection
from models.admin_audit_log import AdminAuditLog
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import Request

async def log_admin_action(
    db,
    admin_user,
    action: str,
    entity_type: str,
    entity_id: str,
    metadata: Optional[Dict[str, Any]] = None,
    request: Optional[Request] = None
):
    """
    Log an admin action to the audit log.

    Args:
        db: Database session/connection
        admin_user: The admin user performing the action (dict with id)
        action: Action performed (e.g., "USER_DEACTIVATED")
        entity_type: Type of entity affected ("User", "Role", "Prayer", "Parish")
        entity_id: ID of the affected entity
        metadata: Optional additional data
        request: FastAPI request object for IP address
    """
    ip_address = None
    if request:
        # Get client IP address
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            ip_address = forwarded.split(",")[0].strip()
        else:
            ip_address = request.client.host if request.client else None

    audit_log = AdminAuditLog(
        admin_user_id=admin_user.get("id") or str(admin_user.get("_id")),
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        metadata=metadata or {},
        ip_address=ip_address,
        created_at=datetime.utcnow()
    )

    # Insert into MongoDB
    audit_doc = audit_log.dict(exclude_unset=True)
    await admin_audit_logs_collection.insert_one(audit_doc)