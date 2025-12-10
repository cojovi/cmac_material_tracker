# Supabase Migration Guide

## Overview

This guide walks you through the complete migration from Replit + Neon to Supabase for the Material Tracker application.

**Status**: ✅ Code migration complete. Ready for database setup and testing.

---

## What's Been Changed

### ✅ Completed Code Changes

1. **Removed Replit Dependencies**
   - Removed `@replit/vite-plugin-cartographer` and `@replit/vite-plugin-runtime-error-modal`
   - Cleaned up `vite.config.ts`
   - Updated `.replit` references

2. **Removed Passport.js Authentication**
   - Removed `passport`, `passport-local`, `express-session`, `bcryptjs`
   - Replaced with Supabase Auth (JWT-based)

3. **Updated Database Schema**
   - Added `profiles` table (linked to Supabase `auth.users`)
   - Updated all foreign keys from `integer` to `text` (UUID)
   - Maintained existing tables: `materials`, `price_history`, `price_change_requests`

4. **Backend Updates**
   - Created `/server/supabase.ts` - Supabase admin client
   - Updated `/server/routes.ts` - JWT authentication, new auth routes
   - Updated `/server/storage.ts` - Profile management methods

5. **Frontend Updates**
   - Created `/client/src/lib/supabase.ts` - Supabase browser client
   - Updated `/client/src/hooks/use-auth.tsx` - Supabase Auth integration
   - Updated `/client/src/lib/queryClient.ts` - JWT headers in API calls

6. **Environment Configuration**
   - Created `.env` with Supabase credentials
   - Created `.env.local` for Vite frontend

7. **Migration Tools**
   - Created `supabase_migration.sql` - Complete database schema
   - Created `scripts/import-materials.ts` - Import 180 materials from SQLite

---

## Next Steps: Database Setup

### Step 1: Apply Database Migration

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard/project/khjxwllahktqhiegouzt
   - Click "SQL Editor" in the left sidebar

2. **Run Migration SQL**
   - Click "New query"
   - Open `/Users/cojovi/dev/material_tracker/supabase_migration.sql`
   - Copy the entire contents
   - Paste into Supabase SQL Editor
   - Click "Run" button
   - **Verify**: You should see "Success. No rows returned" (this is expected)

3. **Verify Tables Created**
   - Go to "Table Editor" in left sidebar
   - You should see 4 tables:
     - `profiles`
     - `materials`
     - `price_history`
     - `price_change_requests`

### Step 2: Enable Email Authentication

1. **Go to Authentication Settings**
   - Navigate to: Authentication → Providers (left sidebar)
   - Find "Email" provider
   - Ensure it's **Enabled**
   - Set "Confirm email" to **Disabled** (for internal app)
   - Save changes

### Step 3: Create Admin User

You need at least one admin user to test the app.

**Option A: Via Supabase Dashboard (Recommended)**

1. Go to: Authentication → Users
2. Click "Add user" → "Create new user"
3. Fill in:
   - Email: `your-email@cmacroofing.com`
   - Password: Create a strong password
   - Auto Confirm User: **Check this box**
4. Click "Create user"
5. **Copy the User ID** (UUID, looks like: `a1b2c3d4-...`)

6. **Create Profile Manually**:
   - Go to "Table Editor" → "profiles"
   - Click "Insert" → "Insert row"
   - Fill in:
     - `id`: Paste the User ID from step 5
     - `email`: Same email as above
     - `role`: Type `admin`
     - `name`: Your full name
   - Click "Save"

**Option B: Via SQL**

Run this in SQL Editor (replace with your details):

```sql
-- Create auth user
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'your-email@cmacroofing.com',
  crypt('YourStrongPassword123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
)
RETURNING id;

-- Copy the returned ID, then create profile:
INSERT INTO profiles (id, email, role, name)
VALUES (
  'paste-the-id-from-above',
  'your-email@cmacroofing.com',
  'admin',
  'Your Full Name'
);
```

### Step 4: Import Materials Data

Now import your 180 materials from SQLite:

```bash
# Preview what will be imported (dry run)
npm run import:materials:dry-run

# Perform the actual import
npm run import:materials
```

**Expected Output:**
```
┌─────────────────────────────────────────────┐
│  Material Import - Production Mode          │
└─────────────────────────────────────────────┘

✓ Environment variables validated
✓ Connected to Supabase
✓ SQLite database found: 180 materials

Processing batch 1/4 (materials 1-50)...
✓ Batch 1/4 completed: 50 materials imported

Processing batch 2/4 (materials 51-100)...
✓ Batch 2/4 completed: 50 materials imported

Processing batch 3/4 (materials 101-150)...
✓ Batch 3/4 completed: 50 materials imported

Processing batch 4/4 (materials 151-180)...
✓ Batch 4/4 completed: 30 materials imported

┌─────────────────────────────────────────────┐
│  Import Summary                              │
├─────────────────────────────────────────────┤
│  Total:      180                             │
│  Success:    180                             │
│  Failed:     0                               │
│  Skipped:    0                               │
└─────────────────────────────────────────────┘

✓ Import completed successfully!
```

---

## Step 5: Test the Application

### Start Development Server

```bash
npm run dev
```

The app should start on http://localhost:5000

### Test Authentication

1. **Go to**: http://localhost:5000/login
2. **Login with**:
   - Email: The admin email you created in Step 3
   - Password: The password you set
3. **Expected**: You should be redirected to the dashboard
4. **Verify**: Check browser console for no errors

### Test Material Viewing

1. **Navigate to**: Materials page
2. **Expected**: You should see all 180 imported materials
3. **Verify**:
   - Materials display correctly
   - Filtering works
   - Sorting works

### Test Admin Functions

1. **Try to add a new material** (admin only)
2. **Try to edit a material price** (admin only)
3. **Expected**: Both should work without errors

### Test Standard User (Optional)

1. **Create a standard user**:
   - Go to Supabase Dashboard → Authentication → Users
   - Add a new user with role `standard` (not admin)

2. **Login as standard user**
3. **Expected**:
   - Can view materials ✓
   - Can submit price change requests ✓
   - Cannot directly edit materials ✗

---

## Environment Variables Reference

### Required Server Variables (`.env`)

```bash
SUPABASE_URL=https://khjxwllahktqhiegouzt.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoanh3bGxhaGt0cWhpZWdvdXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTU0MzMsImV4cCI6MjA4MDUzMTQzM30.vVU_FwwMZzUucnEUeXqa6dlCBJhi3OvAiN7Vy1S6gwM
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoanh3bGxhaGt0cWhpZWdvdXp0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDk1NTQzMywiZXhwIjoyMDgwNTMxNDMzfQ.wKSyrNbHunLDPuKEuKttY2YGf9uCm8c1R8Qc1N8xPlA

# Optional: Keep these if using Slack integration
SLACK_BOT_TOKEN=your-slack-bot-token
SLACK_CHANNEL_ID=your-slack-channel-id
```

### Required Client Variables (`.env.local`)

```bash
VITE_SUPABASE_URL=https://khjxwllahktqhiegouzt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoanh3bGxhaGt0cWhpZWdvdXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5NTU0MzMsImV4cCI6MjA4MDUzMTQzM30.vVU_FwwMZzUucnEUeXqa6dlCBJhi3OvAiN7Vy1S6gwM
```

---

## Troubleshooting

### Issue: "Environment variables not set"

**Solution**:
1. Verify `.env` and `.env.local` files exist in project root
2. Restart development server: `npm run dev`

### Issue: "Failed to fetch profile"

**Solution**:
1. Check that you created a profile for your user in Step 3
2. Verify the profile `id` matches the auth user ID exactly
3. Check Supabase logs: Dashboard → Logs → Postgres Logs

### Issue: "Materials table is empty"

**Solution**:
1. Run the import script: `npm run import:materials`
2. Check for errors in the output
3. Verify SQLite database exists at `database_files/cmac_master.db`

### Issue: "Unauthorized" errors

**Solution**:
1. Check browser console for JWT errors
2. Try logging out and logging back in
3. Verify RLS policies are applied: Supabase Dashboard → Authentication → Policies

### Issue: "Cannot read properties of undefined"

**Solution**:
1. Check browser console for specific error
2. Verify all migrations ran successfully
3. Check that all 4 tables exist in Supabase

---

## Production Deployment

### Update Environment Variables

For production deployment (Vercel, Railway, etc.), set these environment variables:

**Server:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NODE_ENV=production`
- `SLACK_BOT_TOKEN` (optional)
- `SLACK_CHANNEL_ID` (optional)

**Client (Build-time):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Build Commands

```bash
# Build
npm run build

# Start production server
npm start
```

---

## Key Changes Summary

### Authentication Flow

**Before (Replit/Neon):**
1. User submits email/password
2. Passport validates against `users` table (bcrypt)
3. Session stored in express-session (cookie-based)
4. Session validated on each request

**After (Supabase):**
1. User submits email/password
2. Supabase Auth validates and returns JWT
3. Frontend stores JWT in localStorage
4. JWT sent in Authorization header on each request
5. Server verifies JWT with Supabase

### Database Changes

**Before:**
- `users` table with `id` (integer serial)
- All foreign keys reference `users.id` (integer)

**After:**
- `profiles` table with `id` (text UUID)
- Links to Supabase `auth.users` table
- All foreign keys reference `profiles.id` (text/UUID)

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase Dashboard logs
3. Check browser console for errors
4. Verify all environment variables are set

---

## Next Phase: Additional Tables (Optional)

If you want to add the other tables from SQLite (builders, employees, communities, AccuLynx):

1. Update `shared/schema.ts` with new table definitions
2. Create migration SQL for new tables
3. Add corresponding storage methods
4. Create UI pages for managing data

Let me know when you're ready for this phase!
