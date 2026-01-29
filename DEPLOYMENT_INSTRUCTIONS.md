# Admin Dashboard Deployment Instructions

## 1. Database Schema Updates

Run these SQL commands in pgAdmin to update your database:

```sql
-- Add FirstName and LastName columns
ALTER TABLE "Identity"."Users"
ADD COLUMN "FirstName" VARCHAR(100),
ADD COLUMN "LastName" VARCHAR(100);

-- Add PlainPassword column (for reference only - NOT recommended in production)
ALTER TABLE "Identity"."Users"
ADD COLUMN "PlainPassword" TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON "Identity"."Users"("DeletedAt");
CREATE INDEX IF NOT EXISTS idx_users_is_active ON "Identity"."Users"("IsActive");
```

## 2. Features Implemented

### Backend API Routes

1. **PATCH `/api/auth/admin/users/[userId]`** - Update user FirstName and LastName
2. **DELETE `/api/auth/admin/users/[userId]`** - Soft delete user (sets IsActive=false and DeletedAt timestamp)
3. **POST `/api/auth/admin/users/[userId]/reset-password`** - Reset user password

### Frontend Features

1. **Edit User** - Click edit button → modify FirstName/LastName → click checkmark to save
2. **Delete User** - Soft delete with confirmation, removes from display
3. **Reset Password** - Prompts for new password (minimum 6 characters)
4. **Sign Up Updated** - Now requires FirstName and LastName fields

### Security Notes

⚠️ **IMPORTANT**: The `PlainPassword` field stores passwords in plain text as requested. This is **NOT secure** and should only be used for development/testing. In production:
- Remove the `PlainPassword` column
- Only store `PasswordHash` (already implemented with bcrypt)
- Never log or expose plain passwords

## 3. API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/auth/admin/users` | List all active users |
| PATCH | `/api/auth/admin/users/[userId]` | Update user details |
| DELETE | `/api/auth/admin/users/[userId]` | Soft delete user |
| POST | `/api/auth/admin/users/[userId]/reset-password` | Reset password |
| POST | `/api/auth/sign_up` | Create new user (with FirstName/LastName) |

## 4. Database Behavior

### Soft Delete
- When a user is "deleted", `IsActive` is set to `false` and `DeletedAt` is set to current timestamp
- Deleted users don't appear in the admin dashboard
- Data is preserved in the database for audit purposes

### Password Updates
- When password is reset, both `PasswordHash` (bcrypt) and `PlainPassword` are updated
- Password must be minimum 6 characters

### User Updates
- FirstName and LastName can be edited from admin dashboard
- Changes are saved immediately when checkmark is clicked

## 5. Next Steps

1. Run the SQL commands above in pgAdmin
2. Restart your development server
3. Test all CRUD operations in admin dashboard
4. For Vercel deployment, ensure environment variables are set:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `ADMIN_ALERT_EMAIL`

## 6. Testing Checklist

- [ ] Sign up new user with FirstName/LastName
- [ ] Login as admin
- [ ] View all users in dashboard
- [ ] Edit user FirstName/LastName
- [ ] Reset user password
- [ ] Delete user (verify they disappear from list)
- [ ] Verify deleted user has DeletedAt timestamp in database
