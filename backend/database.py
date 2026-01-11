from motor.motor_asyncio import AsyncIOMotorClient
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLAlchemy for existing models
DATABASE_URL = "sqlite:///./app.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI not set")

client = AsyncIOMotorClient(MONGODB_URI)
db = client["church_app"]

print("CONNECTED DB:", db)

# Collections
users_collection = db.users
parishes_collection = db.parishes
prayers_collection = db.prayers
prayer_responses_collection = db.prayer_responses
prayer_reactions_collection = db.prayer_reactions
testimony_reactions_collection = db.testimony_reactions
testimonies_collection = db.testimonies
notifications_collection = db.notifications
events_collection = db.events
announcements_collection = db.announcements
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

    # Prayer reactions indexes
    await prayer_reactions_collection.create_index([("prayer_id", 1), ("user_id", 1)], unique=True)
    await prayer_reactions_collection.create_index("prayer_id")

    # Testimonies indexes
    await testimonies_collection.create_index("user_id")
    await testimonies_collection.create_index([("created_at", -1)])

    # Testimony reactions indexes
    await testimony_reactions_collection.create_index([("testimony_id", 1), ("user_id", 1)], unique=True)
    await testimony_reactions_collection.create_index("testimony_id")

    # Notifications indexes
    await notifications_collection.create_index("user_id")
    await notifications_collection.create_index([("created_at", -1)])

    # Events indexes
    await events_collection.create_index("parish_id")
    await events_collection.create_index("event_date")

    # Password reset tokens TTL index
    await password_reset_tokens_collection.create_index("expires_at", expireAfterSeconds=0)

    # User roles indexes
    await user_roles_collection.create_index("user_id")
    await user_roles_collection.create_index("role_id")

