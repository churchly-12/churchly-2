from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from database import prayers_collection, prayer_responses_collection, prayer_reactions_collection, notifications_collection, users_collection
from datetime import datetime, timedelta
from bson import ObjectId
from typing import Optional
from models.prayer import PrayerCreate
from models.prayer_response import PrayerResponseCreate
from models.prayer_reaction import PrayerReactionCreate
from models.notification import NotificationCreate
from auth import get_current_user
from utils.permissions import require_permission
import asyncio
import json
from jose import JWTError, jwt
from utils.security import SECRET_KEY, ALGORITHM

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

# Global event queue for SSE
event_queue = asyncio.Queue()

@router.get("/")
async def get_prayers(
    parish_id: Optional[str] = None,
    user_id: str = Depends(get_current_user)
):
    try:
        query = {"expires_at": {"$gt": datetime.utcnow()}, "is_deleted": {"$ne": True}}
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
            # Add reactions
            reactions_cursor = prayer_reactions_collection.find({"prayer_id": ObjectId(p["id"]), "is_deleted": {"$ne": True}})
            reaction_counts = {"prayed": 0, "amen": 0, "peace": 0}
            user_reaction = None
            async for r in reactions_cursor:
                reaction_counts[r["reaction"]] += 1
                if r["user_id"] == user_id:
                    user_reaction = r["reaction"]
            p["reactions"] = reaction_counts
            p["userReaction"] = user_reaction
            # Remove ObjectId fields that can't be serialized
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
        prayer_id = str(result.inserted_id)
        await event_queue.put({
            "type": "prayer_created",
            "prayer_id": prayer_id,
            "user_id": user_id
        })
        return {"success": True, "message": "Prayer submitted successfully"}
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
        "expires_at": {"$gt": datetime.utcnow()},
        "is_deleted": {"$ne": True}
    })
    if not prayer:
        raise HTTPException(status_code=404, detail="Prayer request has expired or does not exist")

    # Get responses
    query = {
        "prayer_id": ObjectId(prayer_id),
        "is_approved": True,
        "expires_at": {"$gt": datetime.utcnow()},
        "is_deleted": {"$ne": True}
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

    prayer = await prayers_collection.find_one({"_id": ObjectId(prayer_id), "is_deleted": {"$ne": True}})
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

@router.post("/react/{prayer_id}")
async def react_to_prayer(
    prayer_id: str,
    payload: PrayerReactionCreate,
    user_id: str = Depends(get_current_user)
):
    try:
        # Check if prayer exists and is active
        prayer = await prayers_collection.find_one({
            "_id": ObjectId(prayer_id),
            "expires_at": {"$gt": datetime.utcnow()},
            "is_deleted": {"$ne": True}
        })
        if not prayer:
            raise HTTPException(status_code=404, detail="Prayer not found or expired")

        # Check for existing reaction
        existing = await prayer_reactions_collection.find_one({
            "prayer_id": ObjectId(prayer_id),
            "user_id": user_id
        })

        if not existing:
            # Create new reaction
            reaction_doc = {
                "prayer_id": ObjectId(prayer_id),
                "user_id": user_id,
                "reaction": payload.reaction,
                "created_at": datetime.utcnow()
            }
            await prayer_reactions_collection.insert_one(reaction_doc)
            await event_queue.put({
                "type": "reaction_added",
                "prayer_id": prayer_id,
                "reaction": payload.reaction,
                "user_id": user_id
            })

            # Create notification for prayer author if not self
            if prayer["user_id"] != ObjectId(user_id):
                reactor = await users_collection.find_one({"_id": ObjectId(user_id)})
                reactor_name = reactor.get("full_name", "Someone") if reactor else "Someone"
                message = f"{reactor_name} reacted {payload.reaction} to your prayer"
                notification_doc = {
                    "user_id": str(prayer["user_id"]),
                    "type": "prayer_reaction",
                    "message": message,
                    "is_read": False,
                    "created_at": datetime.utcnow(),
                    "related_id": prayer_id
                }
                await notifications_collection.insert_one(notification_doc)

            return {"success": True, "message": "Reaction added"}
        elif existing["reaction"] == payload.reaction:
            # Same reaction: remove it (toggle off)
            await prayer_reactions_collection.delete_one({
                "_id": existing["_id"]
            })
            await event_queue.put({
                "type": "reaction_removed",
                "prayer_id": prayer_id,
                "reaction": existing["reaction"],
                "user_id": user_id
            })
            return {"success": True, "message": "Reaction removed"}
        else:
            # Different reaction: update it
            old_reaction = existing["reaction"]
            await prayer_reactions_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {"reaction": payload.reaction}}
            )
            await event_queue.put({
                "type": "reaction_updated",
                "prayer_id": prayer_id,
                "old_reaction": old_reaction,
                "new_reaction": payload.reaction,
                "user_id": user_id
            })
            return {"success": True, "message": "Reaction updated"}

    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to process reaction"}

@router.get("/my-prayers")
async def get_my_prayers(user_id: str = Depends(get_current_user)):
    print(f"MY-PRAYERS ENDPOINT HIT - User ID: {user_id}")
    try:
        query = {"user_id": ObjectId(user_id), "is_deleted": {"$ne": True}}
        print(f"Query: {query}")
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
            p["approved"] = True  # Since all are approved
            p["anonymous"] = p.get("is_anonymous", False)
            # Add reactions
            reactions_cursor = prayer_reactions_collection.find({"prayer_id": ObjectId(p["id"]), "is_deleted": {"$ne": True}})
            reaction_counts = {"prayed": 0, "amen": 0, "peace": 0}
            user_reaction = None
            async for r in reactions_cursor:
                reaction_counts[r["reaction"]] += 1
                if r["user_id"] == user_id:
                    user_reaction = r["reaction"]
            p["reactions"] = reaction_counts
            p["userReaction"] = user_reaction
            # Remove ObjectId fields that can't be serialized
            p.pop("parish_id", None)
            prayers.append(p)
        print(f"Found {len(prayers)} prayers for user {user_id}")
        return {"success": True, "data": convert_objectids(prayers)}
    except Exception as e:
        print(f"Error in my-prayers: {e}")
        import traceback
        traceback.print_exc()
        return {"success": False, "message": "Failed to fetch prayers"}

@router.get("/stream")
async def stream_prayer_events(token: str = None):
    # For SSE, auth via query param since EventSource can't send headers
    if not token:
        raise HTTPException(status_code=401, detail="Token required")
    # Manually verify token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    async def event_generator():
        while True:
            try:
                event = await asyncio.wait_for(event_queue.get(), timeout=30)
                yield f"data: {json.dumps(event)}\n\n"
            except asyncio.TimeoutError:
                # Send keep-alive
                yield "data: {\"type\": \"ping\"}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/notifications")
async def get_notifications(user_id: str = Depends(get_current_user)):
    try:
        cursor = notifications_collection.find({"user_id": user_id, "is_deleted": {"$ne": True}}).sort("created_at", -1)
        notifications = []
        async for n in cursor:
            n["id"] = str(n["_id"])
            del n["_id"]
            notifications.append(n)
        return {"success": True, "notifications": notifications}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to fetch notifications"}

@router.post("/notifications/mark-read")
async def mark_notifications_read(user_id: str = Depends(get_current_user)):
    try:
        await notifications_collection.update_many(
            {"user_id": user_id, "is_read": False},
            {"$set": {"is_read": True}}
        )
        return {"success": True, "message": "Notifications marked as read"}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to mark notifications"}

@router.delete("/{prayer_id}")
async def delete_prayer(
    prayer_id: str,
    current_user=Depends(get_current_user)
):
    print(f"DELETE PRAYER HIT - ID: {prayer_id}")
    print(f"USER ID: {current_user}")

    pid = ObjectId(prayer_id)

    prayer = await prayers_collection.find_one({"_id": pid})
    if not prayer:
        print(f"PRAYER NOT FOUND: {prayer_id}")
        raise HTTPException(status_code=404, detail="Prayer not found")

    print("PRAYER FOUND")
    print("PRAYER USER ID:", prayer["user_id"], type(prayer["user_id"]))
    print("REQUEST USER ID:", current_user, type(current_user))

    if prayer["user_id"] != ObjectId(current_user):
        print(f"UNAUTHORIZED: User {current_user} cannot delete prayer {prayer_id}")
        raise HTTPException(status_code=403, detail="Not authorized")

    print(f"DELETING PRAYER: {prayer_id}")

    # 1️⃣ Delete responses
    responses_result = await prayer_responses_collection.delete_many({"prayer_id": pid})
    print(f"RESPONSES DELETED: {responses_result.deleted_count}")

    # 2️⃣ Delete reactions
    reactions_result = await prayer_reactions_collection.delete_many({"prayer_id": pid})
    print(f"REACTIONS DELETED: {reactions_result.deleted_count}")

    # 3️⃣ Delete notifications
    notifications_result = await notifications_collection.delete_many({"prayer_id": pid})
    print(f"NOTIFICATIONS DELETED: {notifications_result.deleted_count}")

    # 4️⃣ Delete prayer
    prayer_result = await prayers_collection.delete_one({"_id": pid})
    print(f"PRAYER DELETED: {prayer_result.deleted_count}")

    # 5️⃣ Emit SSE delete event
    await event_queue.put({
        "type": "prayer_deleted",
        "prayer_id": prayer_id
    })

    print(f"PRAYER {prayer_id} DELETED SUCCESSFULLY")
    return {"success": True, "message": "Prayer deleted"}