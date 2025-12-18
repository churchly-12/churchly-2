# Church Community App - Backend

This is the FastAPI backend for the Church Community App.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Seed the database (creates tables, admin user, and sample data):
   ```bash
   python seed.py
   ```

3. Run the server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8008
   ```

The API will be available at `http://localhost:8008`.

## API Documentation

Once running, visit `http://localhost:8000/docs` for interactive API docs.

## Admin Credentials

- Email: admin@church.com
- Password: admin123

## Endpoints

- `/auth/signup` - User registration
- `/auth/login` - User login
- `/content/devotions` - Get devotions
- `/content/events` - Get events
- `/prayer-requests/submit` - Submit prayer request
- `/prayer-requests/approve/{id}` - Approve prayer request (admin only)
- `/users/profile` - Get user profile
- `/users/all-users` - Get all users (admin only)