# Churchly Admin Portal - Clean File Structure

## Backend Structure (Organized)

```
backend/
├── routers/
│   ├── admin/
│   │   ├── __init__.py          # Admin router exports
│   │   └── admin.py             # Admin endpoints (user management, roles, etc.)
│   ├── users/
│   │   ├── __init__.py          # Users router exports
│   │   └── users.py             # User endpoints (profile, etc.)
│   ├── content.py               # Content management endpoints
│   └── prayer_requests.py       # Prayer request endpoints
├── auth.py                      # Authentication endpoints
├── main.py                      # Main app with all router imports
├── setup_admin.py               # Admin setup script
└── database.py                  # Database configuration
```

## Frontend Structure (Organized)

```
frontend/src/
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx   # Admin dashboard with statistics
│   │   ├── UserManagement.jsx   # User CRUD operations
│   │   ├── RoleManagement.jsx   # Role and permission management
│   │   └── PrayerManagement.jsx # Prayer moderation
│   ├── users/
│   │   └── __init__.py          # Users pages module
│   ├── Login.jsx                # Login with admin info icon
│   └── [other user pages...]    # Regular user pages
├── components/
│   ├── AdminRoute.jsx           # Admin route protection
│   ├── ProtectedRoute.jsx       # General route protection
│   ├── TopBar.jsx               # Navigation with admin shield icon
│   └── [other components...]    # Other UI components
├── context/
│   ├── AuthContext.jsx          # Authentication context
│   └── ThemeContext.jsx         # Theme management
├── api/
│   └── apiClient.js             # API client configuration
└── App.jsx                      # Main app with admin routes
```

## Key Features

### Backend Organization
- **Admin Router** (`backend/routers/admin/admin.py`): All admin functionality
  - Dashboard analytics
  - User management (CRUD with pagination)
  - Role and permission management
  - Prayer moderation
  - Parish management

- **Users Router** (`backend/routers/users/users.py`): Regular user functionality
  - User profile endpoints
  - User-specific operations

### Frontend Organization
- **Admin Pages** (`frontend/src/pages/admin/`): All admin interface components
- **Users Pages** (`frontend/src/pages/users/`): Regular user pages (ready for expansion)
- **Admin Components** (`frontend/src/components/`): Admin-specific components

### Admin Access Flow
1. **Setup**: Run `python backend/setup_admin.py user@example.com`
2. **Login**: User logs in normally
3. **Discovery**: Admin shield icon (🛡️) appears in top navigation
4. **Access**: Click shield to access `/admin` portal
5. **Management**: Full admin dashboard with user, role, and content management

### Security
- Role-based access control
- Admin route protection
- Permission-based API endpoints
- Secure admin authentication

## User Registration Process

### Frontend Registration Flow
Users register through the signup form in `frontend/src/pages/auth/Signup.jsx`. The form collects:
- Full name
- Email address
- Password (with confirmation)
- A hardcoded default parish ID (`"507f1f77bcf86cd799439011"`)

Client-side validation ensures passwords match before submission. The form sends a POST request to `/auth/signup` via the API client in `frontend/src/api/apiClient.js`.

### Backend Processing
The signup endpoint is handled in `backend/auth.py`. The process includes:

1. **Validation**: Checks the incoming data against `SignupSchema` (full_name, email, password, parish_id)
2. **Duplicate Check**: Queries the MongoDB `users` collection to ensure the email doesn't already exist
3. **Password Hashing**: Uses bcrypt (via passlib) to hash the password securely
4. **User Document Creation**: Creates a user document with:
   - `full_name`: User's full name
   - `email`: User's email address
   - `password`: Hashed password
   - `parish_id`: Converted to MongoDB ObjectId
   - `is_active`: Set to `True`
   - `is_verified`: Set to `False` (users start unverified)
   - `created_at`: Current UTC timestamp
   - `updated_at`: Current UTC timestamp

### Database Storage
Users are stored in MongoDB Atlas (`church_app` database) in the `users` collection. Key database details from `backend/database.py`:

- **Database**: MongoDB (Atlas cloud instance)
- **Collection**: `users`
- **Indexes**:
  - Unique index on `email`
  - Index on `parish_id`
- **Connection**: Async Motor client

### Authentication Token
After successful registration, a JWT token is generated using the user's MongoDB ObjectId and returned to the client. The token expires after 7 days.

### Post-Registration
- Frontend redirects users to the login page
- Users must verify their account separately (verification logic not implemented in signup)
- Password reset functionality exists but email sending is not implemented (logs token to console)

## Usage
1. Create user account through normal signup (see User Registration Process above)
2. Run admin setup script to grant permissions
3. Login and access admin portal via shield icon
4. Manage users, roles, prayers, and content

All files are now properly organized with clear separation between admin and user functionality.