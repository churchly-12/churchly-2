from fastapi import APIRouter, HTTPException, Depends
from database import prayers_collection, prayer_responses_collection
from datetime import datetime
from bson import ObjectId
from models.prayer import PrayerCreate
from models.prayer_response import PrayerResponseCreate
from dependencies.auth import get_current_user
from utils.permissions import require_permission

router = APIRouter(prefix="/api/prayers", tags=["Prayers"])

@router.get("/")
async def get_prayers(
    parish_id: str,
    user_id: str = Depends(get_current_user)
):
    try:
        prayers_cursor = prayers_collection.find(
            {"parish_id": ObjectId(parish_id)}
        ).sort("created_at", -1)
        prayers = []
        async for p in prayers_cursor:
            p["id"] = str(p["_id"])
            del p["_id"]
            prayers.append(p)
        return {"success": True, "data": prayers}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to fetch prayers"}

@router.post("/post")
async def post_prayer(
    payload: PrayerCreate,
    user_id: str = Depends(get_current_user)
):
    await require_permission(user_id, "create_prayer")
    try:
        doc = {
            "user_id": ObjectId(user_id),
            "parish_id": ObjectId(payload.parish_id),
            "title": payload.title,
            "content": payload.content,
            "is_anonymous": payload.is_anonymous,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await prayers_collection.insert_one(doc)
        return {"success": True, "id": str(result.inserted_id)}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to create prayer"}

@router.get("/get/{prayer_id}")
async def get_prayer_with_responses(
    prayer_id: str,
    user_id: str = Depends(get_current_user)
):
    prayer = await prayers_collection.find_one({"_id": ObjectId(prayer_id)})
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer not found")

    # Get responses
    responses_cursor = prayer_responses_collection.find(
        {"prayer_id": ObjectId(prayer_id)}
    ).sort("created_at", 1)
    responses = []
    async for r in responses_cursor:
        r["id"] = str(r["_id"])
        del r["_id"]
        responses.append(r)

    prayer["id"] = str(prayer["_id"])
    del prayer["_id"]
    prayer["responses"] = responses

    return {"success": True, "prayer": prayer}

@router.post("/respond/{prayer_id}")
async def respond_to_prayer(
    prayer_id: str,
    payload: PrayerResponseCreate,
    user_id: str = Depends(get_current_user)
):
    await require_permission(user_id, "respond_prayer")

    prayer = await prayers_collection.find_one({"_id": ObjectId(prayer_id)})
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer not found")

    new_response = {
        "prayer_id": ObjectId(prayer_id),
        "user_id": ObjectId(user_id),
        "message": payload.message,
        "created_at": datetime.utcnow()
    }

    result = await prayer_responses_collection.insert_one(new_response)
    new_response["id"] = str(result.inserted_id)

    return {"success": True, "message": "Response added", "response": new_response}