from fastapi import APIRouter, HTTPException, Depends, Form, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import json
from database import users_collection, password_reset_tokens_collection, db

# Temporary signups collection for unverified users
pending_users_collection = db.pending_users
from utils.security import hash_password, verify_password, create_jwt, SECRET_KEY, ALGORITHM
from datetime import datetime, timedelta
from bson import ObjectId
import uuid
import random
import os
from services.email_service import send_email
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
security = HTTPBearer()

router = APIRouter(tags=["Authentication"])

# Pydantic models
class SignupSchema(BaseModel):
    full_name: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=8)
    parish_id: Optional[str] = None

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str

class VerifyEmailSchema(BaseModel):
    otp: str

class CheckEmailSchema(BaseModel):
    email: EmailStr

# Routes
@router.post("/signup")
async def signup(data: SignupSchema):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Check if temp signup exists
    existing_temp = await pending_users_collection.find_one({"email": data.email})
    if existing_temp:
        # Update existing temp signup
        await pending_users_collection.delete_one({"email": data.email})

    # Generate OTP for email verification
    otp = f"{random.randint(100000, 999999)}"
    verification_expires = datetime.utcnow() + timedelta(minutes=10)

    print(f"DEBUG: otp={otp}, verification_expires={verification_expires}, type={type(verification_expires)}")

    # Store temporary signup data
    temp_doc = {
        "full_name": data.full_name,
        "email": data.email,
        "password": hash_password(data.password),
        "parish_id": data.parish_id,
        "otp": otp,
        "otp_expires": verification_expires,
        "created_at": datetime.utcnow()
    }
    print(f"DEBUG: temp_doc={temp_doc}")
    await pending_users_collection.insert_one(temp_doc)

    # Send verification email
    try:
        await send_email(
            to=data.email,
            subject="Verify your Churchly account",
            html=f"""
            <p>Welcome to Churchly! Your verification code:</p>
            <h2>{otp}</h2>
            <p>This code expires in 10 minutes.</p>
            """
        )
        print(f"OTP email sent successfully to {data.email}")
    except Exception as e:
        print(f"Failed to send verification email to {data.email}: {e}")

    return {"message": "Please check your email for verification code."}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    email = form_data.username
    password = form_data.password

    print("LOGIN ATTEMPT:", email)

    user = await users_collection.find_one({"email": email})
    print("USER FOUND:", bool(user))

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    password_ok = verify_password(password, user["password"])
    print("PASSWORD MATCH:", password_ok)

    if not password_ok:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = create_jwt(str(user["_id"]))
    print("TOKEN CREATED:", token)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": str(user["_id"]),
    }

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordSchema):
    user = await users_collection.find_one({"email": payload.email})

    # Do not reveal if email exists
    if user:
        token = str(uuid.uuid4())
        reset_doc = {
            "user_id": str(user["_id"]),
            "token": token,
            "expires_at": datetime.utcnow() + timedelta(minutes=15),
            "created_at": datetime.utcnow()
        }
        await password_reset_tokens_collection.insert_one(reset_doc)

        # Send password reset email
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        reset_link = f"{frontend_url}/reset-password?token={token}"
        try:
            await send_email(
                to=user["email"],
                subject="Reset your Churchly password",
                html=f"""
                <p>Click below to reset your password:</p>
                <a href="{reset_link}">Reset Password</a>
                <p>Link expires in 15 minutes.</p>
                """
            )
        except Exception as e:
            print(f"Failed to send password reset email: {e}")

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

@router.get("/check-email")
async def check_email(email: str):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": email})
    if existing_user:
        return {"exists": True, "message": "Email already registered"}
    return {"exists": False}

@router.post("/verify-email")
async def verify_email(payload: VerifyEmailSchema):
    # Find temp signup by OTP
    temp_signup = await pending_users_collection.find_one({"otp": payload.otp})

    if not temp_signup:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if temp_signup.get("otp_expires") < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired")

    # Check if user already exists (in case of duplicate verification)
    existing_user = await users_collection.find_one({"email": temp_signup["email"]})
    if existing_user:
        await pending_users_collection.delete_one({"_id": temp_signup["_id"]})
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create the actual user
    user_doc = {
        "full_name": temp_signup["full_name"],
        "email": temp_signup["email"],
        "password": temp_signup["password"],
        "parish_id": temp_signup.get("parish_id"),
        "is_active": True,
        "is_verified": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    result = await users_collection.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # Clean up temp signup
    await pending_users_collection.delete_one({"_id": temp_signup["_id"]})

    # Create JWT token
    token = create_jwt(user_id)

    return {"message": "Email verified successfully. Account created.", "token": token, "user_id": user_id}

# JWT Dependency for FastAPI
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
