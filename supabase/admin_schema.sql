-- ==============================================================================
-- SUPABASE ADMIN DASHBOARD SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- Complete Isolation & Real-Time Monitoring Schema
-- Run this in your Supabase SQL Editor
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENHANCE / CREATE PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  current_page TEXT DEFAULT '/',
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for real-time traffic queries (5-minute active visitor window)
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles(last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- 3. USER ACTIVITIES TABLE
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_email TEXT,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  page TEXT DEFAULT '/',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_action ON public.user_activities(action);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- 5. HELPER FUNCTION: CHECK IF CURRENT USER IS ADMIN
-- Uses SECURITY DEFINER to bypass recursion when reading profiles
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
      AND role = 'admin'
  );
$$;

-- 6. RLS POLICIES FOR PROFILES
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins have full access to all profiles" ON public.profiles;
CREATE POLICY "Admins have full access to all profiles"
  ON public.profiles
  FOR ALL
  USING (public.is_admin());

-- 7. RLS POLICIES FOR USER_ACTIVITIES
DROP POLICY IF EXISTS "Users can log their own activities" ON public.user_activities;
CREATE POLICY "Users can log their own activities"
  ON public.user_activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Admins can view all user activities" ON public.user_activities;
CREATE POLICY "Admins can view all user activities"
  ON public.user_activities
  FOR SELECT
  USING (public.is_admin());

-- 8. AUTOMATIC USER PROFILE CREATION TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, last_active_at, current_page)
  VALUES (
    NEW.id,
    NEW.email,
    -- Designate initial super admin or default to user
    CASE 
      WHEN NEW.email = 'lahcengelmim@gmail.com' THEN 'admin'
      ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'user')
    END,
    NOW(),
    '/'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    last_active_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 9. HELPER QUERY: PROMOTE SPECIFIC USER TO SUPER ADMIN
-- (Replace with your actual admin email if different)
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'lahcengelmim@gmail.com';
