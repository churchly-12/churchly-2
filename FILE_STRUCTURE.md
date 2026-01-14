# Churchly - Full-Stack Church Community App

## Overview
Churchly is a comprehensive web application for church communities, featuring daily devotions, prayer requests, events, user management, and an admin panel. Built with FastAPI backend and React frontend, using a hybrid database setup (SQLite + MongoDB).

## Project Structure

### Root Directory
```
churchly/
├── ADMIN_SETUP.md                 # Admin setup instructions
├── FILE_STRUCTURE.md              # This file
├── README.md                      # Project overview and setup
├── test_admin_navigation.html     # Test file for admin navigation
├── Gemini_Generated_Image_...png  # Generated image asset
└── .vscode/                       # VS Code settings
```

### Backend Structure (FastAPI, Python)
```
backend/
├── main.py                        # FastAPI app entry point with router includes
├── auth.py                        # Authentication endpoints and JWT handling
├── database.py                    # Hybrid database config (SQLAlchemy + MongoDB)
├── app.db                         # SQLite database file
├── .env                           # Environment variables
├── requirements.txt               # Python dependencies
├── package.json & package-lock.json # Node.js deps (legacy?)
├── server.js                      # Node.js server (legacy?)
├── README.md                      # Backend-specific docs
├── seed.py                        # Database seeding script
├── setup_admin.py                 # Admin user setup
├── create_admin.py                # Admin creation script
├── create_user.py                 # User creation script
├── old_models.py                  # Legacy models
├── utils.py                       # Utility functions
├── config/
│   └── db.js                      # Database config (Node.js style)
├── core/
│   └── admin_rate_limiter.py      # Admin rate limiting
├── data/
│   └── role_presets.py            # Predefined roles
├── dependencies/
│   └── auth.py                    # Auth dependencies
├── models/                        # SQLAlchemy models
│   ├── user.py                    # User model
│   ├── prayer.py                  # Prayer model
│   ├── prayer_response.py         # Prayer response model
│   ├── event.py                   # Event model
│   ├── announcement.py            # Announcement model
│   ├── parish.py                  # Parish model
│   ├── role.py                    # Role model
│   ├── user_role.py               # User-role relationship
│   ├── password_reset.py          # Password reset model
│   ├── admin_audit_log.py         # Admin audit log
│   ├── youth_groups.py            # Youth groups model
│   └── PrayerRequest.js           # Legacy JS prayer request model
├── routers/                       # API endpoints
│   ├── content.py                 # Content management
│   ├── prayer_requests.py         # Prayer request handling
│   ├── test_email.py              # Email testing
│   ├── admin/
│   │   ├── __init__.py
│   │   ├── admin.py               # Admin endpoints
│   │   └── export.py              # Data export
│   └── users/
│       ├── __init__.py
│       └── users.py               # User endpoints
├── routes/                        # Legacy routes (Node.js)
│   └── prayerRoutes.js
├── services/                      # Business logic services
│   ├── email_service.py           # Email handling
│   └── audit_service.py           # Audit logging
└── utils/                         # Utility modules
    ├── __init__.py
    ├── permissions.py             # Permission utilities
    └── security.py                # Security utilities
```

### Frontend Structure (React, Vite)
```
frontend/
├── index.html                     # Main HTML
├── package.json & package-lock.json # Dependencies
├── vite.config.js                 # Vite config
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── README.md                      # Frontend docs
├── public/
│   └── church.png                 # Public assets
└── src/
    ├── main.jsx                   # React entry point
    ├── App.jsx                    # Main app component with routing
    ├── index.css                  # Global styles
    ├── config.js                  # App configuration
    ├── api/
    │   └── apiClient.js           # API client for backend communication
    ├── assets/
    │   └── churchly-logo.png      # App logo
    ├── components/                # Reusable UI components
    │   ├── AdminBottomNav.jsx     # Admin bottom navigation
    │   ├── AdminLayout.jsx        # Admin layout wrapper
    │   ├── AdminRoute.jsx         # Admin route protection
    │   ├── AdminTopBar.jsx        # Admin top bar
    │   ├── BottomNav.jsx          # User bottom navigation
    │   ├── Card.jsx               # Generic card component
    │   ├── DailyVerseCard.jsx     # Daily verse display
    │   ├── PrayerDetails.jsx      # Prayer details component
    │   ├── ProtectedRoute.jsx     # General route protection
    │   ├── TopBar.jsx             # User top bar
    │   └── UserProfileSummary.jsx # User profile summary
    ├── constants/
    │   └── dailyVerses.js         # Daily verse constants
    ├── context/                   # React contexts
    │   ├── AuthContext.jsx        # Authentication state
    │   └── ThemeContext.jsx       # Theme management
    ├── data/
    │   └── samplePrayerRequests.js # Sample prayer data
    ├── pages/                     # Page components
    │   ├── AccountSettings.jsx    # Account settings (duplicate?)
    │   ├── account/               # Account-related pages
    │   │   ├── AccountSettings.jsx
    │   │   ├── ChangePassword.jsx
    │   │   ├── DeleteAccount.jsx
    │   │   ├── EditField.jsx
    │   │   ├── Notifications.jsx
    │   │   ├── ParishInfo.jsx
    │   │   ├── PersonalInfo.jsx
    │   │   ├── Preferences.jsx
    │   │   └── Security.jsx
    │   ├── admin/                 # Admin pages
    │   │   ├── AdminActivities.jsx
    │   │   ├── AdminLanding.jsx
    │   │   ├── AdminSettings.jsx
    │   │   ├── AdminYouthGroups.jsx
    │   │   ├── Logout.jsx
    │   │   ├── PrayerManagement.jsx
    │   │   ├── RoleManagement.jsx
    │   │   └── UserManagement.jsx
    │   ├── auth/                  # Authentication pages
    │   │   ├── AdminLogin.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── VerifyEmail.jsx
    │   └── users/                 # User pages
    │       ├── __init__.py        # Python init (mixed languages?)
    │       ├── Activities.jsx
    │       ├── CommunityPage.jsx
    │       ├── DailyReadings.jsx
    │       ├── Devotions.jsx
    │       ├── DivineMercy.jsx
    │       ├── FastingGuide.jsx
    │       ├── Home.jsx
    │       ├── LiturgyCalendar.jsx
    │       ├── Meditation.jsx
    │       ├── NewPrayerRequest.jsx
    │       ├── NewTestimonial.jsx
    │       ├── Novenas.jsx
    │       ├── PrayerIntentions.jsx
    │       ├── PrayerWall.jsx
    │       ├── Profile.jsx
    │       ├── Rosary.jsx
    │       ├── Settings.jsx
    │       ├── ShortPrayers.jsx
    │       ├── StationsOfTheCross.jsx
    │       ├── TestimonialDetails.jsx
    │       ├── Testimonials.jsx
    │       ├── YouthGroups.jsx
    │       ├── edit/               # Profile editing pages
    │       │   ├── EditAddress.jsx
    │       │   ├── EditCommunityZone.jsx
    │       │   ├── EditDOB.jsx
    │       │   ├── EditEmail.jsx
    │       │   ├── EditFamilyID.jsx
    │       │   ├── EditFullName.jsx
    │       │   └── EditPhone.jsx
    │       └── settings/           # User settings pages
    │           ├── ChangePassword.jsx
    │           ├── ContactSupport.jsx
    │           ├── DeleteAccount.jsx
    │           ├── Logout.jsx
    │           ├── NotificationSettings.jsx
    │           └── ReportProblem.jsx
    ├── services/
    │   └── prayerService.js        # Prayer-related services
    └── utils/                     # Utility functions
        ├── fetchVerse.js          # Verse fetching
        ├── testimonialStorage.js  # Testimonial storage
        └── verseHelpers.js        # Verse utilities
```

## Database Architecture

### Hybrid Database Setup
Churchly uses a hybrid database approach combining relational (SQLite) and NoSQL (MongoDB) databases:

#### SQLite (SQLAlchemy)
- **Purpose**: Relational data with complex relationships
- **Models**: User roles, parishes, events, announcements, audit logs
- **File**: `backend/app.db`
- **ORM**: SQLAlchemy with declarative base

#### MongoDB (Atlas)
- **Purpose**: Flexible document storage for user-generated content
- **Collections**:
  - `users`: User accounts with profile data
  - `prayers`: Prayer requests and responses
  - `prayer_responses`: Prayer response documents
  - `announcements`: Church announcements
  - `events`: Church events
  - `roles`: User roles
  - `user_roles`: User-role assignments
  - `password_reset_tokens`: Password reset tokens (TTL)
  - `admin_audit_logs`: Admin action logs
- **Connection**: Async Motor client
- **Indexes**: Optimized for queries (unique email, parish_id, TTL for expirables)

### Database Initialization
- SQLite tables created via `Base.metadata.create_all()` in `main.py`
- MongoDB indexes created in `database.py` `init_db()` function
- Seeding via `seed.py` script

## Key Features

### Backend Features
- **Authentication**: JWT-based with bcrypt password hashing
- **Admin Panel**: Full user, role, and content management
- **Prayer System**: Request submission, moderation, responses
- **Email Service**: SMTP-based email sending (Gmail)
- **Audit Logging**: Admin action tracking
- **Rate Limiting**: Admin endpoint protection
- **Role-Based Access**: Permission-based API access

### Frontend Features
- **Responsive Design**: Tailwind CSS with custom color scheme (#f7efe6, #3b2a20)
- **User Dashboard**: Spiritual content (devotions, prayers, readings)
- **Prayer Wall**: Community prayer sharing
- **Admin Interface**: Dedicated admin layout with navigation
- **Authentication Flow**: Login/signup with email verification
- **Profile Management**: Comprehensive user profile editing

### User Registration Process

#### Frontend Flow
Users register via `frontend/src/pages/auth/Signup.jsx`:
- Collects: full name, email, password, parish ID
- Client validation for password matching
- POST to `/auth/signup` via API client

#### Backend Processing (`backend/auth.py`)
1. **Validation**: Pydantic schema validation
2. **Duplicate Check**: MongoDB query for existing email
3. **Password Hashing**: bcrypt via passlib
4. **User Creation**: MongoDB document with:
   - Basic info (name, email, hashed password)
   - Parish ID (ObjectId)
   - Status flags (active: true, verified: false)
   - Timestamps
5. **Token Generation**: JWT with 7-day expiration

#### Database Storage
- **Primary**: MongoDB `users` collection
- **Backup**: SQLite user model for relational queries
- **Indexes**: Unique email, parish_id

### Admin Access Flow
1. **Setup**: Run `python backend/setup_admin.py email@example.com`
2. **Login**: Standard user login
3. **Discovery**: Admin shield icon in navigation
4. **Access**: Navigate to `/admin` routes
5. **Management**: CRUD operations for users, roles, prayers

## Security
- JWT authentication with expiration
- Role-based access control
- Admin route protection
- Password hashing with bcrypt
- Rate limiting for admin endpoints
- CORS configuration
- Input validation and sanitization

## Development Setup
- **Backend**: `pip install -r requirements.txt; uvicorn main:app --reload`
- **Frontend**: `npm install; npm run dev`
- **Database**: Auto-initialized on startup
- **Admin**: Run setup script for admin access

This structure reflects the current state of the Churchly codebase, with a focus on spiritual community features and comprehensive admin management.