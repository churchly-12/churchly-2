import asyncio
from database import db
from datetime import datetime
from utils import hash_password

async def create_admin():
    # Check if admin user exists
    user = await db.users.find_one({"email": "admin@church.com"})
    if user:
        print("Admin user already exists")
        return

    # Create admin user
    result = await db.users.insert_one({
        "full_name": "Admin User",
        "email": "admin@church.com",
        "password": hash_password("admin123"),
        "role": "admin",
        "is_active": True,
        "is_verified": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    user_id = result.inserted_id
    print(f"Created admin user with ID: {user_id}")

    # Check if admin role exists
    role = await db.roles.find_one({"name": "admin"})
    if not role:
        role_result = await db.roles.insert_one({
            "name": "admin",
            "permissions": [
                "admin_access",
                "manage_users",
                "manage_roles",
                "manage_content",
                "manage_prayers",
                "create_prayer",
                "respond_prayer",
                "view_analytics"
            ],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })
        role_id = role_result.inserted_id
        print(f"Created admin role with ID: {role_id}")
    else:
        role_id = role["_id"]
        print("Admin role already exists")

    # Assign role to user
    existing = await db.user_roles.find_one({"user_id": user_id, "role_id": role_id})
    if not existing:
        await db.user_roles.insert_one({
            "user_id": user_id,
            "role_id": role_id,
            "assigned_at": datetime.utcnow()
        })
        print("Assigned admin role to user")
    else:
        print("User already has admin role")

if __name__ == "__main__":
    asyncio.run(create_admin())