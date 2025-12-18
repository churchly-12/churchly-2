from fastapi import APIRouter, Depends
from database import users_collection
from dependencies.auth import get_current_user
from utils.permissions import require_permission
from bson import ObjectId

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/profile")
async def profile(user_id: str = Depends(get_current_user)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return {"error": "User not found"}
    return {"full_name": user["full_name"], "email": user["email"]}

# Admin-only endpoint example
@router.get("/all-users")
async def all_users(user_id: str = Depends(get_current_user)):
    await require_permission(user_id, "manage_users")
    users_cursor = users_collection.find()
    users = []
    async for u in users_cursor:
        users.append({"full_name": u["full_name"], "email": u["email"]})
    return users