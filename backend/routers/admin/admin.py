from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
import asyncio

from database import (
    users_collection,
    user_roles_collection,
    roles_collection,
    prayers_collection,
    prayer_responses_collection,
    parishes_collection,
    db
)
from auth import get_current_user
from utils.permissions import require_permission
from utils.security import hash_password
from services.audit_service import log_admin_action
from data.role_presets import get_role_preset
from core.admin_rate_limiter import limiter
from pydantic import BaseModel
from fastapi import Request

router = APIRouter(prefix="/admin", tags=["Admin"])

def convert_objectids_to_strings(obj: Any) -> Any:
    """Recursively convert ObjectId instances to strings in a data structure"""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {key: convert_objectids_to_strings(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectids_to_strings(item) for item in obj]
    else:
        return obj

# Pydantic models for admin operations
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    parish_id: Optional[str] = None

class RoleCreate(BaseModel):
    name: str
    permissions: Optional[List[str]] = None
    preset_name: Optional[str] = None

class UserRoleUpdate(BaseModel):
    role_id: str

class ParishCreate(BaseModel):
    name: str
    address: str
    city: str
    state: str
    country: str
    phone: Optional[str] = None
    email: Optional[str] = None

class PrayerUpdate(BaseModel):
    is_approved: Optional[bool] = None

class PrayerResponseUpdate(BaseModel):
    is_approved: Optional[bool] = None

# Admin authentication middleware
async def require_admin(user_id: str = Depends(get_current_user)):
    """Require admin privileges and return user object with permissions"""
    # Check admin access permission
    from utils.permissions import user_has_permission
    has_admin = await user_has_permission(user_id, "admin_access")
    if not has_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    # Get full user object
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get user permissions
    user["is_read_only_admin"] = await user_has_permission(user_id, "admin_read_only")

    user["id"] = str(user["_id"])
    del user["_id"]
    return user

# Check if user is read-only admin
def check_read_only_admin(current_user: dict):
    if current_user.get("is_read_only_admin", False):
        raise HTTPException(
            status_code=403,
            detail="Read-only admin cannot perform this action"
        )

# Get current admin user info
@router.get("/me")
async def get_current_admin(current_user: dict = Depends(require_admin)):
    return {
        "id": current_user["id"],
        "full_name": current_user.get("full_name"),
        "email": current_user.get("email"),
        "is_read_only_admin": current_user.get("is_read_only_admin", False)
    }

# Dashboard analytics
@router.get("/dashboard")
async def admin_dashboard(current_user: dict = Depends(require_admin)):
    try:
        # Get total users count (not deleted)
        total_users = await users_collection.count_documents({"is_deleted": {"$ne": True}})

        # Get active users count (not deleted)
        active_users = await users_collection.count_documents({"is_active": True, "is_deleted": {"$ne": True}})

        # Get total prayers count (not deleted)
        total_prayers = await prayers_collection.count_documents({"is_deleted": {"$ne": True}})

        # Get prayers from last 30 days (not deleted)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_prayers = await prayers_collection.count_documents({
            "created_at": {"$gte": thirty_days_ago},
            "is_deleted": {"$ne": True}
        })

        # Get total parishes count (not deleted)
        total_parishes = await parishes_collection.count_documents({"is_deleted": {"$ne": True}})
        
        # Get pending prayers (unanswered)
        pending_prayers = await prayers_collection.count_documents({
            # Prayer without responses
        })
        
        # This is a simplified query - you'd need to check for prayers without responses
        # For now, we'll use total prayers as pending
        pending_prayers = total_prayers
        
        return {
            "total_users": total_users,
            "active_users": active_users,
            "total_prayers": total_prayers,
            "recent_prayers": recent_prayers,
            "total_parishes": total_parishes,
            "pending_prayers": pending_prayers
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard data: {str(e)}")

# User Management
@router.get("/users")
async def get_all_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    parish_id: Optional[str] = None,
    current_user: dict = Depends(require_admin)
):
    try:
        query = {"is_deleted": {"$ne": True}}

        if search:
            query["$or"] = [
                {"full_name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}}
            ]

        if parish_id:
            query["parish_id"] = ObjectId(parish_id)

        # Get users with pagination
        skip = (page - 1) * limit
        users_cursor = users_collection.find(query).skip(skip).limit(limit)
        
        users = []
        async for user in users_cursor:
            user["id"] = str(user["_id"])
            del user["_id"]
            del user["password"]  # Don't expose passwords
            # Convert any remaining ObjectIds to strings
            user = convert_objectids_to_strings(user)
            users.append(user)
        
        # Get total count for pagination
        total = await users_collection.count_documents(query)
        
        return {
            "data": users,
            "total": total,
            "page": page,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch users: {str(e)}")

@router.get("/users/{user_id}")
async def get_user_details(
    user_id: str,
    current_user: dict = Depends(require_admin)
):
    try:
        user = await users_collection.find_one({"_id": ObjectId(user_id), "is_deleted": {"$ne": True}})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get user roles
        user_roles_cursor = user_roles_collection.find({"user_id": ObjectId(user_id)})
        user_roles = []
        async for ur in user_roles_cursor:
            role = await roles_collection.find_one({"_id": ur["role_id"]})
            if role:
                role["id"] = str(role["_id"])
                del role["_id"]
                user_roles.append(role)
        
        user["id"] = str(user["_id"])
        del user["_id"]
        del user["password"]
        # Convert any remaining ObjectIds to strings
        user = convert_objectids_to_strings(user)
        user["roles"] = user_roles
        
        return user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user details: {str(e)}")

@limiter.limit("5/minute")
@router.put("/users/{user_id}")
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        update_data = {}
        for field, value in user_data.dict(exclude_unset=True).items():
            if field == "parish_id" and value:
                update_data[field] = ObjectId(value)
            else:
                update_data[field] = value

        update_data["updated_at"] = datetime.utcnow()

        result = await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        # Audit logging for user updates
        action = "USER_ACTIVATED" if user_data.is_active == True else "USER_DEACTIVATED" if user_data.is_active == False else "USER_UPDATED"
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action=action,
            entity_type="User",
            entity_id=user_id,
            metadata={"updated_fields": list(update_data.keys())},
            request=request
        )

        return {"message": "User updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user: {str(e)}")

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: str,
    current_user: dict = Depends(require_admin)
):
    result = await users_collection.delete_one({"_id": ObjectId(user_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted permanently"}

# Role Management
@router.get("/roles")
async def get_all_roles(current_user: dict = Depends(require_admin)):
    try:
        roles_cursor = roles_collection.find()
        roles = []
        async for role in roles_cursor:
            role["id"] = str(role["_id"])
            del role["_id"]
            roles.append(role)
        return roles
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch roles: {str(e)}")

@router.post("/roles")
async def create_role(
    role_data: RoleCreate,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        # Use preset if provided, otherwise use manual permissions
        if role_data.preset_name:
            preset = get_role_preset(role_data.preset_name)
            if not preset:
                raise HTTPException(status_code=400, detail=f"Invalid preset name: {role_data.preset_name}")
            permissions = preset["permissions"]
            role_name = role_data.name or preset["name"]  # Use provided name or preset name
        else:
            if not role_data.permissions:
                raise HTTPException(status_code=400, detail="Permissions are required when not using a preset")
            permissions = role_data.permissions
            role_name = role_data.name

        role_doc = {
            "name": role_name,
            "permissions": permissions,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await roles_collection.insert_one(role_doc)

        # Audit logging
        metadata = {
            "role_name": role_name,
            "permissions": permissions,
            "used_preset": role_data.preset_name if role_data.preset_name else None
        }
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action="ROLE_CREATED",
            entity_type="Role",
            entity_id=str(result.inserted_id),
            metadata=metadata,
            request=request
        )

        return {"message": "Role created successfully", "role_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create role: {str(e)}")

@limiter.limit("5/minute")
@router.put("/roles/{role_id}")
async def update_role(
    role_id: str,
    role_data: RoleCreate,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        update_data = {
            "name": role_data.name,
            "permissions": role_data.permissions,
            "updated_at": datetime.utcnow()
        }

        result = await roles_collection.update_one(
            {"_id": ObjectId(role_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Role not found")

        # Audit logging
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action="ROLE_UPDATED",
            entity_type="Role",
            entity_id=role_id,
            metadata={"role_name": role_data.name, "permissions": role_data.permissions},
            request=request
        )

        return {"message": "Role updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update role: {str(e)}")

@limiter.limit("5/minute")
@router.delete("/roles/{role_id}")
async def delete_role(
    role_id: str,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        result = await roles_collection.delete_one({"_id": ObjectId(role_id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Role not found")

        # Also remove role from users
        await user_roles_collection.delete_many({"role_id": ObjectId(role_id)})

        # Audit logging
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action="ROLE_DELETED",
            entity_type="Role",
            entity_id=role_id,
            request=request
        )

        return {"message": "Role deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete role: {str(e)}")

# User Role Management
@limiter.limit("5/minute")
@router.post("/users/{user_id}/roles")
async def assign_role_to_user(
    user_id: str,
    role_data: UserRoleUpdate,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        # Check if role assignment already exists
        existing = await user_roles_collection.find_one({
            "user_id": ObjectId(user_id),
            "role_id": ObjectId(role_data.role_id)
        })

        if existing:
            return {"message": "Role already assigned to user"}

        user_role_doc = {
            "user_id": ObjectId(user_id),
            "role_id": ObjectId(role_data.role_id),
            "assigned_at": datetime.utcnow()
        }

        await user_roles_collection.insert_one(user_role_doc)

        # Audit logging
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action="USER_ROLE_ASSIGNED",
            entity_type="User",
            entity_id=user_id,
            metadata={"role_id": role_data.role_id},
            request=request
        )

        return {"message": "Role assigned successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to assign role: {str(e)}")

@limiter.limit("5/minute")
@router.delete("/users/{user_id}/roles/{role_id}")
async def remove_role_from_user(
    user_id: str,
    role_id: str,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        result = await user_roles_collection.delete_one({
            "user_id": ObjectId(user_id),
            "role_id": ObjectId(role_id)
        })

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Role not found for user")

        # Audit logging
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action="USER_ROLE_REMOVED",
            entity_type="User",
            entity_id=user_id,
            metadata={"role_id": role_id},
            request=request
        )

        return {"message": "Role removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to remove role: {str(e)}")

# Prayer Management
@router.get("/prayers")
async def get_all_prayers(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,  # pending, answered, etc.
    current_user: dict = Depends(require_admin)
):
    try:
        query = {"is_deleted": {"$ne": True}}

        prayers_cursor = prayers_collection.find(query).skip((page-1)*limit).limit(limit)
        
        prayers = []
        async for prayer in prayers_cursor:
            prayer["id"] = str(prayer["_id"])
            del prayer["_id"]
            
            # Get user info
            if prayer.get("user_id"):
                user = await users_collection.find_one({"_id": prayer["user_id"]})
                if user:
                    prayer["user_name"] = user.get("full_name", "Unknown")
                    prayer["user_email"] = user.get("email", "Unknown")
            
            # Get response count
            response_count = await prayer_responses_collection.count_documents({
                "prayer_id": ObjectId(prayer["id"])
            })
            prayer["response_count"] = response_count
            
            prayers.append(prayer)
        
        total = await prayers_collection.count_documents(query)
        
        return {
            "prayers": prayers,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch prayers: {str(e)}")

@limiter.limit("5/minute")
@router.delete("/prayers/{prayer_id}")
async def delete_prayer(
    prayer_id: str,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        # Soft delete: mark as deleted
        result = await prayers_collection.update_one(
            {"_id": ObjectId(prayer_id)},
            {"$set": {"is_deleted": True, "deleted_at": datetime.utcnow()}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Prayer not found")

        # Also soft delete associated responses, reactions, and notifications
        await prayer_responses_collection.update_many(
            {"prayer_id": ObjectId(prayer_id)},
            {"$set": {"is_deleted": True, "deleted_at": datetime.utcnow()}}
        )

        await prayer_reactions_collection.update_many(
            {"prayer_id": ObjectId(prayer_id)},
            {"$set": {"is_deleted": True, "deleted_at": datetime.utcnow()}}
        )

        await notifications_collection.update_many(
            {"related_id": prayer_id},
            {"$set": {"is_deleted": True, "deleted_at": datetime.utcnow()}}
        )

        # Emit SSE delete event
        from routers.prayer_requests import event_queue
        await event_queue.put({
            "type": "prayer_deleted",
            "prayer_id": prayer_id
        })

        # Audit logging
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action="PRAYER_DELETED",
            entity_type="Prayer",
            entity_id=prayer_id,
            request=request
        )

        return {"message": "Prayer deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete prayer: {str(e)}")

@limiter.limit("5/minute")
@router.patch("/prayers/{prayer_id}")
async def update_prayer(
    prayer_id: str,
    prayer_data: PrayerUpdate,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        update_data = {}
        for field, value in prayer_data.dict(exclude_unset=True).items():
            update_data[field] = value

        update_data["updated_at"] = datetime.utcnow()

        result = await prayers_collection.update_one(
            {"_id": ObjectId(prayer_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Prayer not found")

        # Audit logging
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action="PRAYER_UPDATED",
            entity_type="Prayer",
            entity_id=prayer_id,
            metadata={"updated_fields": list(update_data.keys())},
            request=request
        )

        return {"message": "Prayer updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update prayer: {str(e)}")

@limiter.limit("5/minute")
@router.patch("/prayers/respond/{response_id}")
async def update_prayer_response(
    response_id: str,
    response_data: PrayerResponseUpdate,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        update_data = {}
        for field, value in response_data.dict(exclude_unset=True).items():
            update_data[field] = value

        update_data["updated_at"] = datetime.utcnow()

        result = await prayer_responses_collection.update_one(
            {"_id": ObjectId(response_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Prayer response not found")

        # Audit logging
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action="PRAYER_RESPONSE_UPDATED",
            entity_type="PrayerResponse",
            entity_id=response_id,
            metadata={"updated_fields": list(update_data.keys())},
            request=request
        )

        return {"message": "Prayer response updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update prayer response: {str(e)}")

# Activity Management (Admin Audit Logs)
@router.get("/activities")
async def get_admin_activities(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    action: Optional[str] = None,
    entity_type: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: dict = Depends(require_admin)
):
    try:
        from database import admin_audit_logs_collection
        query = {}

        if action:
            query["action"] = {"$regex": action, "$options": "i"}

        if entity_type:
            query["entity_type"] = {"$regex": entity_type, "$options": "i"}

        if start_date or end_date:
            date_query = {}
            if start_date:
                date_query["$gte"] = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            if end_date:
                date_query["$lte"] = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            query["created_at"] = date_query

        # Get activities with pagination
        skip = (page - 1) * limit
        activities_cursor = admin_audit_logs_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)

        activities = []
        async for activity in activities_cursor:
            activity["id"] = str(activity["_id"])
            del activity["_id"]
            # Convert ObjectIds in metadata if any
            activity = convert_objectids_to_strings(activity)
            activities.append(activity)

        # Get total count
        total = await admin_audit_logs_collection.count_documents(query)

        return {
            "data": activities,
            "total": total,
            "page": page,
            "limit": limit,
            "total_pages": (total + limit - 1) // limit
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch activities: {str(e)}")

# Parish Management
@router.get("/parishes")
async def get_all_parishes(current_user: dict = Depends(require_admin)):
    try:
        parishes_cursor = parishes_collection.find({"is_deleted": {"$ne": True}})
        parishes = []
        async for parish in parishes_cursor:
            parish["id"] = str(parish["_id"])
            del parish["_id"]

            # Get user count for this parish (not deleted users)
            user_count = await users_collection.count_documents({"parish_id": ObjectId(parish["id"]), "is_deleted": {"$ne": True}})
            parish["user_count"] = user_count

            parishes.append(parish)
        return parishes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch parishes: {str(e)}")

@router.post("/parishes")
async def create_parish(
    parish_data: ParishCreate,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        parish_doc = {
            "name": parish_data.name,
            "address": parish_data.address,
            "city": parish_data.city,
            "state": parish_data.state,
            "country": parish_data.country,
            "phone": parish_data.phone,
            "email": parish_data.email,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await parishes_collection.insert_one(parish_doc)

        # Audit logging
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action="PARISH_CREATED",
            entity_type="Parish",
            entity_id=str(result.inserted_id),
            metadata={"parish_name": parish_data.name},
            request=request
        )

        return {"message": "Parish created successfully", "parish_id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create parish: {str(e)}")

@limiter.limit("5/minute")
@router.delete("/parishes/{parish_id}")
async def delete_parish(
    parish_id: str,
    current_user: dict = Depends(require_admin),
    request: Request = None
):
    check_read_only_admin(current_user)
    try:
        # Soft delete: mark as deleted
        result = await parishes_collection.update_one(
            {"_id": ObjectId(parish_id)},
            {"$set": {"is_deleted": True, "deleted_at": datetime.utcnow()}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Parish not found")

        # Audit logging
        await log_admin_action(
            db=db,
            admin_user=current_user,
            action="PARISH_DELETED",
            entity_type="Parish",
            entity_id=parish_id,
            request=request
        )

        return {"message": "Parish deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete parish: {str(e)}")