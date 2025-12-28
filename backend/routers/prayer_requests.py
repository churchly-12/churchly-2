from fastapi import APIRouter, HTTPException, Depends, Query
from database import prayers_collection, prayer_responses_collection, users_collection
from datetime import datetime, timedelta
from bson import ObjectId
from typing import Optional
from models.prayer import PrayerCreate
from models.prayer_response import PrayerResponseCreate
from dependencies.auth import get_current_user
from utils.permissions import require_permission

def convert_objectids(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {k: convert_objectids(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectids(item) for item in obj]
    else:
        return obj

router = APIRouter(prefix="/api/prayers", tags=["Prayers"])

@router.get("/")
async def get_prayers(
    parish_id: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    try:
        query = {
            "is_approved": True,
            "expires_at": {"$gt": datetime.utcnow()}
        }
        if parish_id:
            query["parish_id"] = ObjectId(parish_id)
        prayers_cursor = prayers_collection.find(query).sort("created_at", -1)
        prayers = []
        async for p in prayers_cursor:
            p["id"] = str(p["_id"])
            del p["_id"]
            # Add userName
            if p.get("is_anonymous", False):
                p["userName"] = "Anonymous"
            else:
                user = await users_collection.find_one({"_id": ObjectId(p["user_id"])})
                p["userName"] = user.get("full_name", "Unknown") if user else "Unknown"
            # Map fields
            p["requestText"] = p["content"]
            p["createdAt"] = p["created_at"]
            p["approved"] = p.get("is_approved", True)
            p["anonymous"] = p.get("is_anonymous", False)
            # Remove ObjectId fields that can't be serialized
            p.pop("user_id", None)
            p.pop("parish_id", None)
            prayers.append(p)
        return {"success": True, "data": convert_objectids(prayers)}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to fetch prayers"}

@router.post("/post")
async def create_prayer(
    prayer: PrayerCreate,
    user_id: str = Depends(get_current_user)
):
    # await require_permission(user_id, "create_prayer")
    try:
        now = datetime.utcnow()
        if not prayer.title or not prayer.content:
            raise HTTPException(status_code=422, detail="Title and content are required")
        prayer_doc = {
            "user_id": ObjectId(user_id),
            "title": prayer.title,
            "content": prayer.content,
            "is_anonymous": prayer.is_anonymous,
            "is_approved": True,
            "created_at": now,
            "expires_at": now + timedelta(hours=24),
            "updated_at": datetime.utcnow()
        }
        if prayer.parish_id:
            prayer_doc["parish_id"] = ObjectId(prayer.parish_id)

        result = await prayers_collection.insert_one(prayer_doc)
        return {"message": "Prayer submitted successfully"}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to create prayer"}

@router.get("/get/{prayer_id}")
async def get_prayer_with_responses(
    prayer_id: str,
    since: datetime = Query(None),
    user_id: str = Depends(get_current_user)
):
    prayer = await prayers_collection.find_one({
        "_id": ObjectId(prayer_id),
        "is_approved": True,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer request has expired or does not exist")

    # Get responses
    query = {
        "prayer_id": ObjectId(prayer_id),
        "is_approved": True,
        "expires_at": {"$gt": datetime.utcnow()}
    }
    if since:
        query["created_at"] = {"$gt": since}
    responses_cursor = prayer_responses_collection.find(query).sort("created_at", 1)
    responses = []
    async for r in responses_cursor:
        r["id"] = str(r["_id"])
        del r["_id"]
        # Map response fields
        r["userName"] = r.get("author_name") or "Anonymous"
        r["responseText"] = r["message"]
        r["time"] = r["created_at"]
        r["approved"] = r.get("is_approved", True)
        r["anonymous"] = not r.get("author_name")
        # Remove ObjectId fields
        r.pop("prayer_id", None)
        r.pop("user_id", None)
        responses.append(r)

    prayer["id"] = str(prayer["_id"])
    del prayer["_id"]
    # Map prayer fields
    if prayer.get("is_anonymous", False):
        prayer["userName"] = "Anonymous"
    else:
        user = await users_collection.find_one({"_id": ObjectId(prayer["user_id"])})
        prayer["userName"] = user.get("full_name", "Unknown") if user else "Unknown"
    prayer["requestText"] = prayer["content"]
    prayer["createdAt"] = prayer["created_at"]
    prayer["approved"] = prayer.get("is_approved", True)
    prayer["anonymous"] = prayer.get("is_anonymous", False)
    prayer = convert_objectids(prayer)
    responses = convert_objectids(responses)
    prayer["responses"] = responses

    return {"success": True, "prayer": prayer}

@router.post("/respond/{prayer_id}")
async def respond_to_prayer(
    prayer_id: str,
    payload: PrayerResponseCreate,
    user_id: str = Depends(get_current_user)
):
    await require_permission(user_id, "respond_prayer")

    prayer = await prayers_collection.find_one({"_id": ObjectId(prayer_id), "is_approved": True})
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer not found")

    author_name = None
    if not prayer.get("is_anonymous", False):
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            author_name = user.get("full_name")

    new_response = {
        "prayer_id": ObjectId(prayer_id),
        "user_id": ObjectId(user_id),
        "message": payload.message,
        "author_name": author_name,
        "is_approved": True,
        "created_at": datetime.utcnow(),
        "expires_at": prayer["expires_at"]
    }

    result = await prayer_responses_collection.insert_one(new_response)
    new_response["id"] = str(result.inserted_id)

    # Map response for frontend
    response_data = {
        "userName": new_response.get("author_name") or "Anonymous",
        "responseText": new_response["message"],
        "time": new_response["created_at"],
        "approved": new_response.get("is_approved", True),
        "anonymous": not new_response.get("author_name")
    }

    return {"success": True, "message": "Response added", "response": response_data}