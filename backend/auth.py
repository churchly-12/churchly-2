from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from database import users_collection, password_reset_tokens_collection
from utils.security import hash_password, verify_password, create_jwt
from datetime import datetime, timedelta
from bson import ObjectId
import uuid

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Pydantic models
class SignupSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    parish_id: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str

# Routes
@router.post("/signup")
async def signup(data: SignupSchema):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_pw = hash_password(data.password)
    user_doc = {
        "full_name": data.full_name,
        "email": data.email,
        "password": hashed_pw,
        "parish_id": ObjectId(data.parish_id),
        "is_active": True,
        "is_verified": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    token = create_jwt(user_id)
    return {"message": "Signup successful", "token": token, "user_id": user_id}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users_collection.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_jwt(str(user["_id"]))
    return {"access_token": token, "token_type": "bearer", "user_id": str(user["_id"])}

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordSchema):
    user = await users_collection.find_one({"email": payload.email})

    # Do not reveal if email exists
    if user:
        token = str(uuid.uuid4())
        reset_doc = {
            "user_id": user["_id"],
            "token": token,
            "expires_at": datetime.utcnow() + timedelta(minutes=30),
            "created_at": datetime.utcnow()
        }
        await password_reset_tokens_collection.insert_one(reset_doc)

        # TODO: Send email with reset link
        # For now, just log it
        print(f"Reset token for {user['email']}: {token}")

    return {"message": "If the email exists, a reset link was sent"}

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordSchema):
    record = await password_reset_tokens_collection.find_one({"token": payload.token})

    if not record or record["expires_at"] < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    hashed_pw = hash_password(payload.new_password)
    await users_collection.update_one(
        {"_id": record["user_id"]},
        {"$set": {"password": hashed_pw}}
    )

    await password_reset_tokens_collection.delete_one({"_id": record["_id"]})

    return {"message": "Password reset successful"}
