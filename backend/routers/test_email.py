from fastapi import APIRouter
from services.email_service import send_email

router = APIRouter()

@router.get("/test-email")
async def test_email():
    await send_email(
        to="your-email@example.com",
        subject="Churchly Test Email",
        html="<h1>Resend is working 🎉</h1>"
    )
    return {"status": "email sent"}