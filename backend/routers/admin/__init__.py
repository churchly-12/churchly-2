from .admin import router as admin_router
from .export import router as export_router

# Combine routers
from fastapi import APIRouter
router = APIRouter()
router.include_router(admin_router)
router.include_router(export_router)