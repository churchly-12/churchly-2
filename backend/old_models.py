from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime
from database import Base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
    is_admin = Column(Boolean, default=False)

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, index=True)
    expires_at = Column(DateTime)

class Devotion(Base):
    __tablename__ = "devotions"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    duration = Column(String)
    description = Column(Text)


class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    date = Column(String)
    description = Column(Text)

# Pydantic models for MongoDB prayer requests
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class PrayerRequest(BaseModel):
    userId: str
    userName: str
    requestText: str

class PrayerResponse(BaseModel):
    responseText: str
    responderId: str
    responderName: str
