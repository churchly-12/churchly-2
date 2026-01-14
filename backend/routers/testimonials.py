from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from database import testimonies_collection, testimony_reactions_collection, notifications_collection, users_collection
from datetime import datetime, timedelta
from bson import ObjectId
from bson.errors import InvalidId
from models.testimony import TestimonyCreate
from models.testimony_reaction import TestimonyReactionCreate
from models.notification import NotificationCreate
from auth import get_current_user
import asyncio
import json
from jose import JWTError, jwt
from utils.security import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/api/testimonies", tags=["Testimonies"])

# Global event queue for SSE
testimony_event_queue = asyncio.Queue()

# Global for cleanup tracking
last_cleanup = None

def convert_objectids(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {k: convert_objectids(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectids(item) for item in obj]
    else:
        return obj

async def cleanup_expired_testimonies():
    global last_cleanup
    now = datetime.utcnow()
    if last_cleanup is None or (now - last_cleanup) > timedelta(hours=1):
        # Delete expired testimonies
        expired_testimonies = testimonies_collection.find({"expires_at": {"$lt": now}})
        expired_ids = []
        async for t in expired_testimonies:
            expired_ids.append(t["_id"])
        if expired_ids:
            # Delete reactions and notifications
            for tid in expired_ids:
                tid_str = str(tid)
                await testimony_reactions_collection.delete_many({"testimony_id": tid_str})
                await notifications_collection.delete_many({"related_id": tid_str})
            # Delete testimonies
            await testimonies_collection.delete_many({"_id": {"$in": expired_ids}})
            print(f"Deleted {len(expired_ids)} expired testimonies")
        last_cleanup = now

@router.get("/")
async def get_all_testimonies(user_id: str = Depends(get_current_user)):
    try:
        await cleanup_expired_testimonies()
        testimonies_cursor = testimonies_collection.find({"is_deleted": {"$ne": True}}).sort("created_at", -1)
        testimonies = []
        count = 0
        async for t in testimonies_cursor:
            count += 1
            t["id"] = str(t["_id"])
            del t["_id"]
            # Add userName
            if t.get("is_anonymous", False):
                t["userName"] = "Anonymous"
            else:
                user = await users_collection.find_one({"_id": ObjectId(t["user_id"])})
                t["userName"] = user.get("full_name", "Unknown") if user else "Unknown"
            # Add reactions
            reactions_cursor = testimony_reactions_collection.find({"testimony_id": t["id"], "is_deleted": {"$ne": True}})
            reaction_counts = {"praise": 0, "amen": 0, "thanks": 0}
            user_reaction = None
            async for r in reactions_cursor:
                reaction_counts[r["reaction"]] += 1
                if r["user_id"] == user_id:
                    user_reaction = r["reaction"]
            t["reactions"] = reaction_counts
            t["userReaction"] = user_reaction
            testimonies.append(t)
        print(f"Found {count} my testimonies for user {user_id}")
        return {"success": True, "data": convert_objectids(testimonies)}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to fetch testimonies"}

@router.get("/my")
async def get_my_testimonies(user_id: str = Depends(get_current_user)):
    try:
        await cleanup_expired_testimonies()
        testimonies_cursor = testimonies_collection.find({"user_id": user_id, "expires_at": {"$gt": datetime.utcnow()}, "is_deleted": {"$ne": True}}).sort("created_at", -1)
        testimonies = []
        count = 0
        async for t in testimonies_cursor:
            count += 1
            t["id"] = str(t["_id"])
            del t["_id"]
            # Add userName
            if t.get("is_anonymous", False):
                t["userName"] = "Anonymous"
            else:
                user = await users_collection.find_one({"_id": ObjectId(t["user_id"])})
                t["userName"] = user.get("full_name", "Unknown") if user else "Unknown"
            # Add reactions
            reactions_cursor = testimony_reactions_collection.find({"testimony_id": t["id"], "is_deleted": {"$ne": True}})
            reaction_counts = {"praise": 0, "amen": 0, "thanks": 0}
            user_reaction = None
            async for r in reactions_cursor:
                reaction_counts[r["reaction"]] += 1
                if r["user_id"] == user_id:
                    user_reaction = r["reaction"]
            t["reactions"] = reaction_counts
            t["userReaction"] = user_reaction
            testimonies.append(t)
        print(f"Found {count} testimonies")
        return {"success": True, "data": convert_objectids(testimonies)}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to fetch my testimonies"}

@router.post("/post")
async def create_testimony(
    testimony: TestimonyCreate,
    user_id: str = Depends(get_current_user)
):
    try:
        if not testimony.content:
            raise HTTPException(status_code=422, detail="Content is required")
        now = datetime.utcnow()
        testimony_doc = {
            "user_id": user_id,
            "content": testimony.content,
            "is_anonymous": testimony.is_anonymous,
            "created_at": now,
            "expires_at": now + timedelta(hours=24)
        }
        result = await testimonies_collection.insert_one(testimony_doc)
        testimony_id = str(result.inserted_id)

        # Get the full testimony data for SSE
        testimony = await testimonies_collection.find_one({"_id": ObjectId(testimony_id)})
        testimony["id"] = testimony_id
        del testimony["_id"]
        # Add userName
        if testimony.get("is_anonymous", False):
            testimony["userName"] = "Anonymous"
        else:
            user = await users_collection.find_one({"_id": ObjectId(testimony["user_id"])})
            testimony["userName"] = user.get("full_name", "Unknown") if user else "Unknown"
        # Add reactions
        testimony["reactions"] = {"praise": 0, "amen": 0, "thanks": 0}
        testimony["userReaction"] = None
        testimony.pop("user_id", None)

        # Broadcast event
        await testimony_event_queue.put({
            "type": "testimony_added",
            "testimony": convert_objectids(testimony)
        })

        return {"success": True, "message": "Testimony submitted successfully"}
    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to create testimony"}

@router.get("/{testimony_id}")
async def get_testimony(testimony_id: str, user_id: str = Depends(get_current_user)):
    testimony = await testimonies_collection.find_one({"_id": ObjectId(testimony_id), "expires_at": {"$gt": datetime.utcnow()}, "is_deleted": {"$ne": True}})
    if not testimony:
        raise HTTPException(status_code=404, detail="Testimony not found")

    testimony["id"] = str(testimony["_id"])
    del testimony["_id"]
    # Add userName
    if testimony.get("is_anonymous", False):
        testimony["userName"] = "Anonymous"
    else:
        user = await users_collection.find_one({"_id": ObjectId(testimony["user_id"])})
        testimony["userName"] = user.get("full_name", "Unknown") if user else "Unknown"
    # Add reactions
    reactions_cursor = testimony_reactions_collection.find({"testimony_id": testimony["id"], "is_deleted": {"$ne": True}})
    reaction_counts = {"praise": 0, "amen": 0, "thanks": 0}
    user_reaction = None
    async for r in reactions_cursor:
        reaction_counts[r["reaction"]] += 1
        if r["user_id"] == user_id:
            user_reaction = r["reaction"]
    testimony["reactions"] = reaction_counts
    testimony["userReaction"] = user_reaction
    # Remove ObjectId fields
    testimony.pop("user_id", None)
    return {"success": True, "testimony": convert_objectids(testimony)}

@router.post("/{testimony_id}/react")
async def react_to_testimony(
    testimony_id: str,
    payload: TestimonyReactionCreate,
    user_id: str = Depends(get_current_user)
):
    try:
        # Check if testimony exists
        testimony = await testimonies_collection.find_one({"_id": ObjectId(testimony_id), "is_deleted": {"$ne": True}})
        if not testimony:
            raise HTTPException(status_code=404, detail="Testimony not found")
        # For now, skip existence check since testimonies are local

        # Check for existing reaction
        existing = await testimony_reactions_collection.find_one({
            "testimony_id": testimony_id,
            "user_id": user_id
        })

        if not existing:
            # Create new reaction
            reaction_doc = {
                "testimony_id": testimony_id,
                "user_id": user_id,
                "reaction": payload.reaction,
                "created_at": datetime.utcnow()
            }
            await testimony_reactions_collection.insert_one(reaction_doc)
            await testimony_event_queue.put({
                "type": "testimony_reaction_added",
                "testimony_id": testimony_id,
                "reaction": payload.reaction,
                "user_id": user_id
            })

            # Create notification for testimony author if not self
            if testimony["user_id"] != user_id:
                reactor = await users_collection.find_one({"_id": ObjectId(user_id)})
                reactor_name = reactor.get("full_name", "Someone") if reactor else "Someone"
                message = f"{reactor_name} reacted {payload.reaction} to your testimony"
                notification_doc = {
                    "user_id": testimony["user_id"],
                    "type": "testimony_reaction",
                    "message": message,
                    "is_read": False,
                    "created_at": datetime.utcnow(),
                    "related_id": testimony_id
                }
                await notifications_collection.insert_one(notification_doc)

            return {"success": True, "message": "Reaction added"}
        elif existing["reaction"] == payload.reaction:
            # Same reaction: remove it
            await testimony_reactions_collection.delete_one({
                "_id": existing["_id"]
            })
            await testimony_event_queue.put({
                "type": "testimony_reaction_removed",
                "testimony_id": testimony_id,
                "reaction": existing["reaction"],
                "user_id": user_id
            })
            return {"success": True, "message": "Reaction removed"}
        else:
            # Different reaction: update it
            old_reaction = existing["reaction"]
            await testimony_reactions_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {"reaction": payload.reaction}}
            )
            await testimony_event_queue.put({
                "type": "testimony_reaction_updated",
                "testimony_id": testimony_id,
                "old_reaction": old_reaction,
                "new_reaction": payload.reaction,
                "user_id": user_id
            })
            return {"success": True, "message": "Reaction updated"}

    except Exception as e:
        print(e)
        return {"success": False, "message": "Failed to process reaction"}

@router.get("/stream")
async def stream_testimony_events(token: str = None):
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
                event = await asyncio.wait_for(testimony_event_queue.get(), timeout=60)
                yield f"data: {json.dumps(event)}\n\n"
            except asyncio.TimeoutError:
                # Send keep-alive
                yield "data: {\"type\": \"ping\"}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.delete("/{testimony_id}")
async def delete_testimony(
    testimony_id: str,
    current_user=Depends(get_current_user)
):
    tid = ObjectId(testimony_id)

    testimony = await testimonies_collection.find_one({"_id": tid})
    if not testimony:
        raise HTTPException(status_code=404, detail="Testimony not found")

    if testimony["user_id"] != current_user:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Delete reactions
    await testimony_reactions_collection.delete_many({"testimony_id": testimony_id})

    # Delete notifications
    await notifications_collection.delete_many({"related_id": testimony_id})

    # Delete testimony
    await testimonies_collection.delete_one({"_id": tid})

    # Emit SSE delete event
    await testimony_event_queue.put({
        "type": "testimony_deleted",
        "testimony_id": testimony_id
    })

    return {"success": True, "message": "Testimony deleted"}