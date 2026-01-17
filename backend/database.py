from motor.motor_asyncio import AsyncIOMotorClient
from fastapi import FastAPI
import asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLAlchemy for existing models
DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# MongoDB
MONGO_URI = "mongodb+srv://church_admin:25112025churchme@church-app.xqcry5c.mongodb.net/?retryWrites=true&w=majority"

client = AsyncIOMotorClient(MONGO_URI)
db = client.church_app  # your db name

# Collections
users_collection = db.users
parishes_collection = db.parishes
prayers_collection = db.prayers
prayer_responses_collection = db.prayer_responses
testimonies_collection = db.testimonies
testimony_reactions_collection = db.testimony_reactions
notifications_collection = db.notifications
announcements_collection = db.announcements
events_collection = db.events
roles_collection = db.roles
user_roles_collection = db.user_roles
password_reset_tokens_collection = db.password_reset_tokens
admin_audit_logs_collection = db.admin_audit_logs

async def init_db():
    # Users indexes
    await users_collection.create_index("email", unique=True)
    await users_collection.create_index("parish_id")

    # Prayers indexes
    await prayers_collection.create_index("parish_id")
    await prayers_collection.create_index([("created_at", -1)])
    await prayers_collection.create_index("is_approved")
    await prayers_collection.create_index("expires_at", expireAfterSeconds=0)

    # Prayer responses indexes
    await prayer_responses_collection.create_index("prayer_id")
    await prayer_responses_collection.create_index("is_approved")
    await prayer_responses_collection.create_index("expires_at", expireAfterSeconds=0)

    # Testimonies indexes
    await testimonies_collection.create_index("user_id")
    await testimonies_collection.create_index([("created_at", -1)])
    await testimonies_collection.create_index("is_deleted")
    await testimonies_collection.create_index("expires_at", expireAfterSeconds=0)

    # Testimony reactions indexes
    await testimony_reactions_collection.create_index("testimony_id")
    await testimony_reactions_collection.create_index("user_id")
    await testimony_reactions_collection.create_index("is_deleted")

    # Notifications indexes
    await notifications_collection.create_index("user_id")
    await notifications_collection.create_index([("created_at", -1)])
    await notifications_collection.create_index("is_read")

    # Announcements indexes
    await announcements_collection.create_index("parish_id")
    await announcements_collection.create_index([("created_at", -1)])

    # Events indexes
    await events_collection.create_index("parish_id")
    await events_collection.create_index("event_date")

    # Password reset tokens TTL index
    await password_reset_tokens_collection.create_index("expires_at", expireAfterSeconds=0)

    # User roles indexes
    await user_roles_collection.create_index("user_id")
    await user_roles_collection.create_index("role_id")

    # Legacy prayer requests TTL index (24 hours)
    prayer_collection = db.prayer_requests
    await prayer_collection.create_index("createdAt", expireAfterSeconds=86400)
