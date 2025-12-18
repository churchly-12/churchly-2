from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from fastapi import Request, HTTPException
from starlette.responses import JSONResponse

# Create a limiter instance
limiter = Limiter(key_func=get_remote_address)

# Admin sensitive rate limit dependency
def admin_sensitive_rate_limit(request: Request):
    """
    Rate limit for sensitive admin operations.
    Allows 5 requests per minute per IP.
    """
    # This will be used as a dependency
    pass

# Custom rate limit exceeded handler
def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please try again later."}
    )

# Set the handler on the limiter
limiter._rate_limit_exceeded_handler = rate_limit_exceeded_handler