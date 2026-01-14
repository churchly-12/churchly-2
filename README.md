# Church Community App

A full-stack web application for church communities featuring daily devotions, prayer requests, events, and user management.

## Project Structure

- `backend/` - FastAPI backend with MongoDB database
- `frontend/` - React frontend with Vite and Tailwind CSS
- `ADMIN_SETUP.md` - Admin setup instructions
- `FILE_STRUCTURE.md` - Detailed file structure documentation

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
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
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

## Login Credentials

### Admin Access
- Email: admin@church.com
- Password: admin123

### User Access
- Email: user@churchapp.com
- Password: user@123

## API Documentation

When backend is running, visit `http://localhost:8000/docs` for interactive API docs.

## Recent Updates

- Codebase cleaned up: removed unnecessary files, duplicates, and unused code
- Updated project structure documentation
- Added user login credentials to README