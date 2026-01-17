import asyncio
from database import db
from bson import ObjectId

async def assign_admin():
    # Find the user
    user = await db.users.find_one({"email": "admin@churchapp.com"})
    if not user:
        print("User not found")
        return

    user_id = user["_id"]  # ObjectId
    print(f"Found user: {user['full_name']}")

    # Check if admin role exists
    role = await db.roles.find_one({"name": "admin"})
    if not role:
        print("Admin role not found, creating...")
        role_doc = {
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
            ]
        }
        result = await db.roles.insert_one(role_doc)
        role_id = result.inserted_id  # ObjectId
        print(f"Created admin role: {role_id}")
    else:
        role_id = role["_id"]  # ObjectId
        print("Admin role exists")

    # Assign role
    # First, delete any existing with str user_id
    await db.user_roles.delete_many({"user_id": str(user_id)})
    await db.user_roles.insert_one({
        "user_id": user_id,
        "role_id": role_id
    })
    print("Assigned admin role to user")

if __name__ == "__main__":
    asyncio.run(assign_admin())