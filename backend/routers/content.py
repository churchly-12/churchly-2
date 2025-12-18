from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from old_models import Devotion, Event

router = APIRouter(prefix="/content", tags=["Content"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Devotions
@router.get("/devotions")
def get_devotions(db: Session = Depends(get_db)):
    return db.query(Devotion).all()

# Events
@router.get("/events")
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()
