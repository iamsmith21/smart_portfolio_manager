# Database Migrations

This directory contains SQL migrations for database configuration, particularly for Supabase Row Level Security (RLS) policies.

## Applying RLS Policies

To enable Row Level Security on your Supabase database:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `enable_rls.sql`
4. Click **Run** to execute the migration

## What These Policies Do

### Profile Table
- **Public Read**: Anyone can view profiles (profiles are public portfolios)
- **Insert/Update**: Allowed with API-level authentication checks (via NextAuth)

### Project Table
- **Public Read**: Only visible projects can be viewed by the public
- **Insert/Update/Delete**: Allowed with API-level authentication and ownership validation

## Important Notes

- This application uses **Prisma with NextAuth** (not Supabase Auth)
- Prisma typically uses the service role connection, which bypasses RLS
- These RLS policies protect against direct database access
- Your application's API routes already handle authentication and authorization
- The policies are permissive because the API layer enforces security

## Verifying RLS is Enabled

After applying the migration, you can verify RLS is enabled:

```sql
-- Check if RLS is enabled on Profile
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'Profile';

-- Check if RLS is enabled on Project
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'Project';

-- List all policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

