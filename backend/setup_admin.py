#!/usr/bin/env python3
"""
Admin Setup Script for Churchly App

This script helps set up an admin user with all necessary permissions.
Run this after creating a user account to grant admin access.

Usage:
    python setup_admin.py <user_email>
"""

import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson import ObjectId

# MongoDB connection
MONGO_URI = "mongodb+srv://church_admin:25112025churchme@church-app.xqcry5c.mongodb.net/?retryWrites=true&w=majority"
client = AsyncIOMotorClient(MONGO_URI)
db = client.church_app

# Collections
users_collection = db.users
roles_collection = db.roles
user_roles_collection = db.user_roles

async def setup_admin_user(user_email):
    """Set up admin permissions for a user"""
    try:
        # Find the user
        user = await users_collection.find_one({"email": user_email})
        if not user:
            print(f"❌ User with email '{user_email}' not found!")
            print("Please create an account first using the app.")
            return False
        
        user_id = user["_id"]
        print(f"✅ Found user: {user['full_name']} ({user_email})")
        
        # Check if admin role exists, if not create it
        admin_role = await roles_collection.find_one({"name": "admin"})
        if not admin_role:
            print("🔧 Creating admin role...")
            admin_role_doc = {
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
            }
            result = await roles_collection.insert_one(admin_role_doc)
            admin_role_id = result.inserted_id
            print("✅ Admin role created successfully")
        else:
            admin_role_id = admin_role["_id"]
            print("✅ Admin role already exists")
        
        # Check if user already has admin role
        existing_assignment = await user_roles_collection.find_one({
            "user_id": user_id,
            "role_id": admin_role_id
        })
        
        if existing_assignment:
            print("✅ User already has admin role assigned")
            return True
        
        # Assign admin role to user
        print("🔧 Assigning admin role to user...")
        user_role_doc = {
            "user_id": user_id,
            "role_id": admin_role_id,
            "assigned_at": datetime.utcnow()
        }
        
        await user_roles_collection.insert_one(user_role_doc)
        print("✅ Admin role assigned successfully!")
        
        print("\n🎉 Setup complete!")
        print(f"User '{user_email}' now has admin access.")
        print("\nNext steps:")
        print("1. Login to the app with this user account")
        print("2. Look for the shield icon (🛡️) in the top navigation")
        print("3. Click the shield icon to access the admin portal")
        
        return True
        
    except Exception as e:
        print(f"❌ Error setting up admin user: {str(e)}")
        return False

async def list_users():
    """List all users in the database"""
    try:
        users_cursor = users_collection.find({})
        users = []
        async for user in users_cursor:
            users.append({
                "id": str(user["_id"]),
                "name": user["full_name"],
                "email": user["email"],
                "active": user.get("is_active", True)
            })
        
        if not users:
            print("No users found in the database.")
            return
        
        print("\n📋 Users in database:")
        print("-" * 60)
        for user in users:
            status = "✅ Active" if user["active"] else "❌ Inactive"
            print(f"{user['name']} ({user['email']}) - {status}")
            print(f"   ID: {user['id']}")
            print()
            
    except Exception as e:
        print(f"❌ Error listing users: {str(e)}")

async def main():
    if len(sys.argv) != 2:
        print("Usage: python setup_admin.py <user_email>")
        print("\nTo list users first, run without arguments:")
        print("python setup_admin.py")
        await list_users()
        return
    
    user_email = sys.argv[1]
    print(f"Setting up admin access for: {user_email}")
    print("=" * 50)
    
    success = await setup_admin_user(user_email)
    
    if success:
        print("\n✨ You can now access the admin portal!")
    else:
        print("\n💥 Setup failed. Please check the error messages above.")

if __name__ == "__main__":
    asyncio.run(main())