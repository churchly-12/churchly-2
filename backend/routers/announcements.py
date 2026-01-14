from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime
from database import announcements_collection
from auth import get_current_user
from models.announcement import Announcement, CreateAnnouncement

router = APIRouter()

@router.get("/announcements")
async def get_announcements(current_user: str = Depends(get_current_user)):
    announcements = await announcements_collection.find().to_list(None)
    for ann in announcements:
        ann["id"] = str(ann["_id"])
        del ann["_id"]
        if "created_at" in ann and ann["created_at"]:
            ann["created_at"] = ann["created_at"].isoformat()
        if "updated_at" in ann and ann["updated_at"]:
            ann["updated_at"] = ann["updated_at"].isoformat()
    return announcements

@router.post("/announcements")
async def create_announcement(announcement: dict, current_user: dict = Depends(get_current_user)):
    announcement["created_at"] = datetime.utcnow()
    announcement["updated_at"] = datetime.utcnow()
    result = await announcements_collection.insert_one(announcement)
    response = {"id": str(result.inserted_id), **announcement}
    response["created_at"] = response["created_at"].isoformat()
    response["updated_at"] = response["updated_at"].isoformat()
    return response

@router.put("/announcements/{announcement_id}")
async def update_announcement(announcement_id: str, announcement: dict, current_user: dict = Depends(get_current_user)):
    announcement["updated_at"] = datetime.utcnow()
    result = await announcements_collection.update_one(
        {"_id": ObjectId(announcement_id)},
        {"$set": announcement}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return {"message": "Announcement updated"}

@router.delete("/announcements/{announcement_id}")
async def delete_announcement(announcement_id: str, current_user: dict = Depends(get_current_user)):
    result = await announcements_collection.delete_one({"_id": ObjectId(announcement_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Announcement not found")
    return {"message": "Announcement deleted"}