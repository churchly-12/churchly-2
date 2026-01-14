from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from database import users_collection, prayers_collection, parishes_collection
from auth import get_current_user
from utils.permissions import require_permission
import csv
import io
from bson import ObjectId
from fastapi import Depends

router = APIRouter(prefix="/export", tags=["Admin Export"])

# Helper function to check admin access
async def require_admin(user_id: str = Depends(get_current_user)):
    has_admin = await require_permission(user_id, "admin_access")
    if not has_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

@router.get("/users")
async def export_users(user_id: str = Depends(get_current_user)):
    await require_admin(user_id)

    # Fetch all non-deleted users
    users_cursor = users_collection.find({"is_deleted": {"$ne": True}})
    users = []
    async for user in users_cursor:
        user["id"] = str(user["_id"])
        del user["_id"]
        # Remove sensitive fields
        user.pop("password", None)
        users.append(user)

    # Create CSV
    output = io.StringIO()
    fieldnames = ["id", "full_name", "email", "mobile", "parish_id", "is_active", "is_verified", "created_at", "updated_at"]
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    for user in users:
        writer.writerow(user)

    output.seek(0)
    return StreamingResponse(
        io.StringIO(output.getvalue()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=users.csv"}
    )

@router.get("/prayers")
async def export_prayers(user_id: str = Depends(get_current_user)):
    await require_admin(user_id)

    # Fetch all non-deleted prayers
    prayers_cursor = prayers_collection.find({"is_deleted": {"$ne": True}})
    prayers = []
    async for prayer in prayers_cursor:
        prayer["id"] = str(prayer["_id"])
        del prayer["_id"]
        prayers.append(prayer)

    # Create CSV
    output = io.StringIO()
    fieldnames = ["id", "user_id", "parish_id", "title", "content", "is_anonymous", "created_at", "updated_at"]
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    for prayer in prayers:
        writer.writerow(prayer)

    output.seek(0)
    return StreamingResponse(
        io.StringIO(output.getvalue()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=prayers.csv"}
    )

@router.get("/parishes")
async def export_parishes(user_id: str = Depends(get_current_user)):
    await require_admin(user_id)

    # Fetch all non-deleted parishes
    parishes_cursor = parishes_collection.find({"is_deleted": {"$ne": True}})
    parishes = []
    async for parish in parishes_cursor:
        parish["id"] = str(parish["_id"])
        del parish["_id"]
        parishes.append(parish)

    # Create CSV
    output = io.StringIO()
    fieldnames = ["id", "name", "zone", "location", "created_at"]
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    for parish in parishes:
        writer.writerow(parish)

    output.seek(0)
    return StreamingResponse(
        io.StringIO(output.getvalue()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=parishes.csv"}
    )