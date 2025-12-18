from fastapi import HTTPException, status
from bson import ObjectId
from database import db

async def user_has_permission(user_id: str, permission: str) -> bool:
    roles_cursor = db.user_roles.find({"user_id": ObjectId(user_id)})
    async for ur in roles_cursor:
        role = await db.roles.find_one({"_id": ur["role_id"]})
        if role and permission in role.get("permissions", []):
            return True
    return False

async def require_permission(user_id: str, permission: str):
    if not await user_has_permission(user_id, permission):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to perform this action"
        )