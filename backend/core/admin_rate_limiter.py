from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)