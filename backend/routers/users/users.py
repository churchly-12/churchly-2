from fastapi import APIRouter, Depends, HTTPException
from database import users_collection, parishes_collection
from auth import get_current_user
from utils.permissions import require_permission
from utils.security import hash_password, verify_password
from bson import ObjectId
from pydantic import BaseModel
from services.email_service import send_email

router = APIRouter(prefix="/users", tags=["Users"])

class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str

@router.get("/profile")
async def profile(user_id: str = Depends(get_current_user)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        return {"error": "User not found"}
    return {
        "id": user_id,
        "full_name": user["full_name"],
        "email": user["email"],
        "parish_id": str(user["parish_id"]) if user.get("parish_id") else None
    }

@router.get("/parishes")
async def get_parishes():
    parishes_cursor = parishes_collection.find({"is_deleted": {"$ne": True}})
    parishes = []
    async for p in parishes_cursor:
        parishes.append({
            "_id": str(p["_id"]),
            "name": p["name"]
        })
    return {"success": True, "data": parishes}

# Admin-only endpoint example
@router.get("/all-users")
async def all_users(user_id: str = Depends(get_current_user)):
    await require_permission(user_id, "manage_users")
    users_cursor = users_collection.find()
    users = []
    async for u in users_cursor:
        users.append({"full_name": u["full_name"], "email": u["email"]})
    return users

@router.put("/change-password")
async def change_password(data: ChangePasswordSchema, user_id: str = Depends(get_current_user)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    hashed_pw = hash_password(data.new_password)
    await users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password": hashed_pw}}
    )

    # Send password change alert email
    try:
        await send_email(
            to=user["email"],
            subject="Your password was changed",
            html="""
            <p>Your Churchly password was changed successfully.</p>
            <p>If this wasn't you, please reset your password immediately.</p>
            """
        )
    except Exception as e:
        print(f"Failed to send password change alert: {e}")

    return {"message": "Password changed successfully"}

@router.delete("/me")
async def delete_my_account(user_id: str = Depends(get_current_user)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if user:
        # Send deletion notice email
        try:
            await send_email(
                to=user["email"],
                subject="Your Churchly account was deleted",
                html="""
                <p>Your Churchly account has been permanently deleted.</p>
                <p>If you believe this was a mistake, contact support.</p>
                """
            )
        except Exception as e:
            print(f"Failed to send account deletion email: {e}")

    await users_collection.delete_one({"_id": ObjectId(user_id)})
    return {"message": "Your account has been deleted"}