# Church Community App

A full-stack web application for church communities featuring daily devotions, prayer requests, events, and user management.

## Project Structure

- `backend/` - FastAPI backend with SQLAlchemy database
- `frontend/` - React frontend with Vite

## Getting Started

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Seed the database:
   ```bash
   python seed.py
   ```

4. Run the backend server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8008
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   (Runs on http://localhost:3000)

## Features

- User authentication with JWT
- Daily devotions and prayer content
- Church events calendar
- Prayer request submission and management
- Admin panel for content management

## Admin Access

- Email: admin@church.com
- Password: admin123

## API Documentation

When backend is running, visit `http://localhost:8000/docs` for interactive API docs.