# Church Community App - Frontend

This is the React frontend for the Church Community App.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
   (This installs packages from package.json)

2. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Features

- User authentication (signup/login)
- View daily devotions
- Browse church events
- Submit and manage prayer requests
- Admin panel for managing users and approving prayer requests

## Project Structure

- `src/App.jsx` - Main app component with routing
- `src/pages/` - Page components (Home, Devotions, Login, etc.)
- `src/components/` - Reusable components (Navbar, etc.)
- `src/main.jsx` - App entry point

## Backend Integration

Make sure the backend is running on `http://localhost:8000`. The frontend fetches data from the API endpoints.

## Admin Access

Use the admin credentials from the backend README to access admin features.