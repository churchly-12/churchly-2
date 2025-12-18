# Churchly Admin Portal Setup Guide

## How to Access the Admin Portal

### Default Admin Credentials
- **Email**: admin@churchapp.com
- **Password**: admin@123

### 1. Create Additional Admin Users
If you need more admin users, you can:

1. **Create a regular user account** through the normal signup process
2. **Then manually assign admin permissions** to that user in the database

### 2. Database Setup for Admin Access

You need to manually set up the admin permissions in MongoDB:

```javascript
// Connect to your MongoDB database and run these commands:

// 1. First, create an admin role (if it doesn't exist)
db.roles.insertOne({
  name: "admin",
  permissions: [
    "admin_access",
    "manage_users", 
    "manage_roles",
    "manage_content",
    "manage_prayers",
    "create_prayer",
    "respond_prayer",
    "view_analytics"
  ],
  created_at: new Date(),
  updated_at: new Date()
});

// 2. Get the role ID
var adminRole = db.roles.findOne({name: "admin"});
print("Admin Role ID:", adminRole._id);

// 3. Assign the admin role to your user (replace USER_ID with the actual user ID)
db.user_roles.insertOne({
  user_id: ObjectId("YOUR_USER_ID_HERE"),
  role_id: adminRole._id,
  assigned_at: new Date()
});
```

### 3. Finding Your User ID

To find your user ID after signing up:

```javascript
// Run this in MongoDB to find your user
db.users.find({email: "your-email@example.com"})
```

### 4. Accessing the Admin Portal

Once you have admin permissions:

1. **Login** to the regular app with your admin user account
2. **Look for the shield icon** (🛡️) in the top navigation bar
3. **Click the shield icon** to access the admin portal
4. You'll be redirected to `/admin` where you can manage:
   - **Dashboard** - Overview statistics
   - **Users** - Manage user accounts
   - **Roles** - Manage roles and permissions  
   - **Prayers** - Moderate prayer requests

### 5. Admin Portal Features

#### Dashboard
- View total users, active users
- Monitor prayer requests and statistics
- Quick access to all admin functions

#### User Management
- View all users with search and pagination
- Edit user details (name, email, status)
- Activate/deactivate users
- Delete users
- Assign roles to users

#### Role Management
- Create new roles with custom permissions
- Edit existing roles
- Delete roles
- View all permissions available

#### Prayer Management
- View all prayer requests
- See prayer details and responses
- Delete inappropriate prayers
- Monitor prayer activity

### 6. Troubleshooting

**Can't see the admin shield icon?**
- Check that your user has the `admin_access` permission
- Verify the role is properly assigned in `user_roles` collection

**Getting "Access Denied" when clicking admin link?**
- Make sure you're logged in
- Check that your user has admin permissions in the database

**Admin pages show errors?**
- Ensure the backend server is running
- Check browser console for detailed error messages

### 7. Security Notes

- Only users with `admin_access` permission can access admin features
- Admin actions are logged and should be monitored
- Consider creating a separate admin-only account for security

## Backend API Endpoints

The admin portal uses these API endpoints:

- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/users` - List users with pagination
- `GET /admin/users/{id}` - Get user details
- `PUT /admin/users/{id}` - Update user
- `DELETE /admin/users/{id}` - Delete user
- `GET /admin/roles` - List all roles
- `POST /admin/roles` - Create new role
- `PUT /admin/roles/{id}` - Update role
- `DELETE /admin/roles/{id}` - Delete role
- `GET /admin/prayers` - List prayers with pagination
- `DELETE /admin/prayers/{id}` - Delete prayer

All endpoints require a valid JWT token and `admin_access` permission.