import logging

logging.basicConfig(level=logging.INFO)
logging.getLogger("pymongo").setLevel(logging.ERROR)
logging.getLogger("motor").setLevel(logging.ERROR)

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from routers import users, content
from routers.prayer_requests import router as prayer_requests_router
from routers.testimonials import router as testimonials_router
from routers.admin import router as admin_router
from routers.users import router as users_router
from routers.test_email import router as test_email_router
from routers.announcements import router as announcements_router
from routers.events import router as events_router
from routers.upload import router as upload_router
from auth import router as auth_router
from database import init_db, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Spiritual App API")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print(f"INCOMING REQUEST: {request.method} {request.url}")
    response = await call_next(request)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router, prefix="/auth")
app.include_router(users_router)
app.include_router(content.router)
app.include_router(prayer_requests_router)
app.include_router(testimonials_router)
app.include_router(admin_router)
app.include_router(test_email_router)
app.include_router(announcements_router)
app.include_router(events_router)
app.include_router(upload_router)

@app.on_event("startup")
async def start_db():
    await init_db()

@app.get("/")
def root():
    return {"message": "API is running"}
