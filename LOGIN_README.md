# Login Process Documentation

This document outlines the login process for both regular users and administrators across the Churchly application, covering the backend API, frontend web application, and mobile app.

## Admin Credentials

- **Default Admin Account**: `admin@church.com` / `admin123`
- Admin users are identified by having the "admin_access" permission assigned via role-based access control
- To create additional admin users, assign the "admin" role using the admin setup script or admin panel

## Setting Up Admin Users

### Using the Setup Script
Run the admin setup script to grant admin permissions to existing users:
```bash
cd backend
python setup_admin.py user@example.com
```

### Manual Setup
1. Create or identify the user account
2. Use the admin panel (once logged in as admin) to assign roles
3. Or run the `assign_admin.py` script for direct database assignment

### Admin Permissions
The "admin" role includes the following permissions:
- `admin_access` - Basic admin access
- `manage_users` - User management
- `manage_roles` - Role management
- `manage_content` - Content management
- `manage_prayers` - Prayer management
- `create_prayer` - Prayer creation
- `respond_prayer` - Prayer responses
- `view_analytics` - Analytics access

## Backend

### Files Involved
- [`backend/auth.py`](backend/auth.py) - Contains authentication routes and logic
- [`backend/main.py`](backend/main.py) - Main FastAPI application that includes the auth router
- [`backend/utils/security.py`](backend/utils/security.py) - Password hashing and JWT token creation utilities
- [`backend/dependencies/auth.py`](backend/dependencies/auth.py) - Authentication dependencies
- [`backend/routers/users/users.py`](backend/routers/users/users.py) - User profile endpoint
- [`backend/utils/permissions.py`](backend/utils/permissions.py) - Permission checking utilities

### Routes
- **POST** `/auth/login` - Authenticates users (both regular and admin) and returns a JWT token
  - Request body: `{ "email": "string", "password": "string" }`
  - Response: `{ "access_token": "string", "token_type": "bearer", "user_id": "string" }`
- **GET** `/users/profile` - Returns user profile information including role based on permissions
  - Requires authentication
  - Response: `{ "full_name": "string", "email": "string", "role": "string", "parish_id": "string" }`

The login endpoint verifies the user's credentials against the database, creates a JWT token containing the user's ID and role, and returns it for subsequent authenticated requests. User roles are determined by checking assigned permissions rather than a stored role field.

## Frontend (Web Application)

### Files Involved
- [`frontend/src/pages/auth/Login.jsx`](frontend/src/pages/auth/Login.jsx) - Regular user login page
- [`frontend/src/pages/auth/AdminLogin.jsx`](frontend/src/pages/auth/AdminLogin.jsx) - Administrator login page
- [`frontend/src/context/AuthContext.jsx`](frontend/src/context/AuthContext.jsx) - Authentication context managing login state
- [`frontend/src/api/apiClient.js`](frontend/src/api/apiClient.js) - API client for making requests to the backend

### Routes
- `/auth/login` - Regular user login page
- `/auth/admin-login` - Administrator login page

### Process
1. User enters email and password on the respective login page
2. Form submission calls the `/auth/login` API endpoint
3. On successful authentication, the JWT token is stored in localStorage
4. User is redirected to the home page (`/`) for regular users or admin dashboard (`/admin`) for administrators
5. The AuthContext manages the authentication state and provides login/logout functionality

## Mobile App

### Files Involved
- [`mobile/src/screens/auth/LoginScreen.js`](mobile/src/screens/auth/LoginScreen.js) - Regular user login screen
- [`mobile/src/screens/auth/AdminLoginScreen.js`](mobile/src/screens/auth/AdminLoginScreen.js) - Administrator login screen
- [`mobile/src/navigation/AppNavigator.js`](mobile/src/navigation/AppNavigator.js) - Navigation setup including auth screens
- [`mobile/src/context/AuthContext.js`](mobile/src/context/AuthContext.js) - Authentication context for mobile
- [`mobile/src/api/apiClient.js`](mobile/src/api/apiClient.js) - API client for mobile requests

### Routes/Screens
- `Login` - Regular user login screen
- `AdminLogin` - Administrator login screen

### Process
1. User enters email and password on the respective login screen
2. Login button calls the `login` function from AuthContext with credentials and admin flag (true for admin login)
3. The AuthContext makes a request to the `/auth/login` API endpoint
4. On successful authentication, the JWT token is stored in AsyncStorage
5. The AuthContext fetches user profile to determine permissions
6. Navigation switches to either user interface or admin interface based on login method:
   - Regular login always goes to user interface
   - Admin login goes to admin interface (if user has admin permissions)
7. The AuthContext manages authentication state and handles token refresh/logout

### Important Notes
- The mobile app separates login flows: regular login for users, admin login for administrators
- Even admin users logging in via regular login will see the user interface
- Admin interface is only accessible via the dedicated admin login screen

## Shared Authentication Flow

All platforms use the same backend authentication endpoint and follow similar patterns:
1. User provides email/password
2. Credentials are sent to `/auth/login`
3. JWT token is returned and stored locally (localStorage for web, AsyncStorage for mobile)
4. Subsequent API requests include the token in the Authorization header
5. Token expiration is handled automatically with logout on 401 responses
6. User roles/permissions are determined by checking assigned roles in the database

## Permission System

- Users can be assigned roles with specific permissions
- Admin access requires the "admin_access" permission
- Permissions are checked on protected endpoints using role-based access control
- The system supports read-only admin permissions for limited access

## Security Notes
- Passwords are hashed using bcrypt before storage
- JWT tokens contain user ID and role information
- Tokens are validated on each protected request
- Failed login attempts return generic error messages to prevent user enumeration
- Admin permissions are verified server-side on each admin operation