import asyncio
from database import db
from datetime import datetime
from utils.security import hash_password

async def create_user():
    # Get the parish
    parish = await db.parishes.find_one({"name": "St. Joseph Community"})
    if not parish:
        print("Parish not found")
        return

    parish_id = parish["_id"]

    # Check if user exists
    user = await db.users.find_one({"email": "user@churchapp.com"})
    if user:
        print("User already exists")
        return

    # Create user
    result = await db.users.insert_one({
        "full_name": "Regular User",
        "email": "user@churchapp.com",
        "password": hash_password("user@123"),
        "parish_id": parish_id,
        "is_active": True,
        "is_verified": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })

    print(f"Created user with ID: {result.inserted_id}")
    print("Email: user@churchapp.com")
    print("Password: user@123")

if __name__ == "__main__":
    asyncio.run(create_user())