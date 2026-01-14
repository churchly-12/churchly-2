from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from datetime import datetime
import os
import uuid
from typing import Optional

from auth import get_current_user

router = APIRouter()

# Configure upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-image")
async def upload_image(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    """
    Upload an image file and return a URL to access it.
    
    Args:
        file: The image file to upload
        current_user: Authenticated user
        
    Returns:
        JSON response with image URL
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Generate unique filename
        file_extension = file.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        
        # Return URL (in production, this would be a CDN URL)
        image_url = f"http://localhost:8000/uploads/{unique_filename}"
        
        return {
            "imageUrl": image_url,
            "filename": unique_filename,
            "message": "Image uploaded successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload image: {str(e)}"
        )