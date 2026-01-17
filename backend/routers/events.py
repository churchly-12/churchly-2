from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId
from datetime import datetime
from database import events_collection
from auth import get_current_user

router = APIRouter()

@router.get("/events")
async def get_events(current_user: dict = Depends(get_current_user)):
    events = await events_collection.find().to_list(None)
    for event in events:
        event["id"] = str(event["_id"])
        del event["_id"]
        if "created_at" in event and event["created_at"]:
            event["created_at"] = event["created_at"].isoformat()
        if "updated_at" in event and event["updated_at"]:
            event["updated_at"] = event["updated_at"].isoformat()
    return events

@router.post("/events")
async def create_event(event: dict, current_user: dict = Depends(get_current_user)):
    event["created_at"] = datetime.utcnow()
    event["updated_at"] = datetime.utcnow()
    result = await events_collection.insert_one(event)
    response = {"id": str(result.inserted_id), **event}
    response["created_at"] = response["created_at"].isoformat()
    response["updated_at"] = response["updated_at"].isoformat()
    return response

@router.put("/events/{event_id}")
async def update_event(event_id: str, event: dict, current_user: dict = Depends(get_current_user)):
    event["updated_at"] = datetime.utcnow()
    result = await events_collection.update_one(
        {"_id": ObjectId(event_id)},
        {"$set": event}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event updated"}

@router.delete("/events/{event_id}")
async def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    result = await events_collection.delete_one({"_id": ObjectId(event_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Event deleted"}