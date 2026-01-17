from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, content, prayer_requests
from routers.testimonials import router as testimonials_router
from routers.admin import router as admin_router
from routers.users import router as users_router
from routers.test_email import router as test_email_router
from auth import router as auth_router
from database import init_db, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Spiritual App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(content.router)
app.include_router(prayer_requests.router)
app.include_router(testimonials_router)
app.include_router(admin_router)
app.include_router(test_email_router)

@app.on_event("startup")
async def start_db():
    await init_db()

@app.get("/")
def root():
    return {"message": "API is running"}
