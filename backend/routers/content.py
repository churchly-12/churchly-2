from fastapi import APIRouter
from database import events_collection

router = APIRouter(prefix="/content", tags=["Content"])

# Devotions - placeholder, no collection yet
@router.get("/devotions")
async def get_devotions():
    # TODO: Implement devotions collection
    return []

# Events
@router.get("/events")
async def get_events():
    events = await events_collection.find().to_list(None)
    return events
