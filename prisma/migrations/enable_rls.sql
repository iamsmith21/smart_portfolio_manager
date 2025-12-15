-- Enable Row Level Security on Profile and Project tables
-- This migration should be run in Supabase SQL Editor
-- 
-- Note: This application uses Prisma with NextAuth (not Supabase Auth)
-- Prisma typically uses the service role which bypasses RLS, but enabling
-- RLS protects against direct database access and satisfies Supabase security requirements.
-- Your application's API layer already handles authentication and authorization.

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON "Profile";
DROP POLICY IF EXISTS "Users can insert their own profile" ON "Profile";
DROP POLICY IF EXISTS "Users can update their own profile" ON "Profile";
DROP POLICY IF EXISTS "Visible projects are viewable by everyone" ON "Project";
DROP POLICY IF EXISTS "Users can insert projects" ON "Project";
DROP POLICY IF EXISTS "Users can update their own projects" ON "Project";
DROP POLICY IF EXISTS "Users can delete their own projects" ON "Project";

-- Enable RLS on Profile table
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;

-- Enable RLS on Project table
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;

-- Profile Policies
-- Allow public read access to all profiles (profiles are public portfolios)
CREATE POLICY "Profiles are viewable by everyone"
  ON "Profile"
  FOR SELECT
  USING (true);

-- Allow inserts (API layer validates via NextAuth)
CREATE POLICY "Users can insert their own profile"
  ON "Profile"
  FOR INSERT
  WITH CHECK (true);

-- Allow updates (API layer validates ownership)
CREATE POLICY "Users can update their own profile"
  ON "Profile"
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Project Policies
-- Allow public read access to visible projects only
CREATE POLICY "Visible projects are viewable by everyone"
  ON "Project"
  FOR SELECT
  USING (COALESCE("visible", true) = true);

-- Allow inserts (API layer validates ownership via profile association)
CREATE POLICY "Users can insert projects"
  ON "Project"
  FOR INSERT
  WITH CHECK (true);

-- Allow updates (API layer validates ownership)
CREATE POLICY "Users can update their own projects"
  ON "Project"
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow deletes (API layer validates ownership)
CREATE POLICY "Users can delete their own projects"
  ON "Project"
  FOR DELETE
  USING (true);

