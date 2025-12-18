import asyncio
from database import db
from datetime import datetime
from utils.security import hash_password

ROLES = [
    {
        "name": "admin",
        "permissions": [
            "admin_access",
            "manage_users",
            "create_announcement",
            "delete_prayer",
            "manage_events"
        ]
    },
    {
        "name": "priest",
        "permissions": [
            "create_announcement",
            "manage_events"
        ]
    },
    {
        "name": "member",
        "permissions": [
            "create_prayer",
            "respond_prayer"
        ]
    }
]

async def seed():
    # Parish
    parish = await db.parishes.find_one({"name": "St. Joseph Community"})
    if not parish:
        result = await db.parishes.insert_one({
            "name": "St. Joseph Community",
            "zone": "North Zone",
            "location": "Chennai",
            "created_at": datetime.utcnow()
        })
        parish_id = result.inserted_id
    else:
        parish_id = parish["_id"]

    # Roles
    role_ids = {}
    for role in ROLES:
        existing = await db.roles.find_one({"name": role["name"]})
        if not existing:
            result = await db.roles.insert_one(role)
            role_id = result.inserted_id
        else:
            role_id = existing["_id"]
        role_ids[role["name"]] = role_id

    # Admin user
    user_email = "admin@churchapp.com"
    user = await db.users.find_one({"email": user_email})

    if not user:
        result = await db.users.insert_one({
            "full_name": "Admin User",
            "email": user_email,
            "password": hash_password("admin@123"),
            "parish_id": parish_id,
            "is_active": True,
            "is_verified": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        user_id = result.inserted_id
    else:
        user_id = user["_id"]

    # Assign admin role
    existing_role = await db.user_roles.find_one({
        "user_id": user_id,
        "role_id": role_ids["admin"]
    })
    if not existing_role:
        await db.user_roles.insert_one({
            "user_id": user_id,
            "role_id": role_ids["admin"]
        })

    print("Database seeded successfully")


if __name__ == "__main__":
    asyncio.run(seed())