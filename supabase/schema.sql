-- ==============================================================================
-- SCHEMA SUPABASE POUR VITAREY (CRÉATEUR DE CV & LETTRE DE MOTIVATION)
-- Exécutez ce script dans l'éditeur SQL de votre tableau de bord Supabase
-- ==============================================================================

-- 1. TABLE DES UTILISATEURS / PROFILS (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  city TEXT DEFAULT '',
  country TEXT DEFAULT '',
  photo_url TEXT DEFAULT '',
  title TEXT DEFAULT '',
  summary TEXT DEFAULT '',
  cover_letter_usage_count INTEGER DEFAULT 0,
  plan TEXT DEFAULT 'free',
  active_pass TEXT DEFAULT 'none',
  download_credits INTEGER DEFAULT 0,
  pass_expires_at TIMESTAMPTZ,
  total_downloads INTEGER DEFAULT 0,
  unlocked_cover_letters BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT true,
  subscription_status TEXT DEFAULT 'none',
  subscription_start TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  role TEXT DEFAULT 'user',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Alias/Table compatible 'users' pour administration backend
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  plan TEXT DEFAULT 'free',
  active_pass TEXT DEFAULT 'none',
  download_credits INTEGER DEFAULT 0,
  pass_expires_at TIMESTAMPTZ,
  total_downloads INTEGER DEFAULT 0,
  unlocked_cover_letters BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT true,
  subscription_status TEXT DEFAULT 'none',
  subscription_start TIMESTAMPTZ,
  subscription_end TIMESTAMPTZ,
  cv_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  role TEXT DEFAULT 'user',
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  raw_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 2. TABLE DES CV (cvs)
CREATE TABLE IF NOT EXISTS public.cvs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT DEFAULT 'Mon CV',
  template_id TEXT DEFAULT 'modern',
  is_paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMPTZ,
  cv_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cvs_user_id ON public.cvs(user_id);
CREATE INDEX IF NOT EXISTS idx_cvs_updated_at ON public.cvs(updated_at DESC);

-- 3. TABLE DES LETTRES DE MOTIVATION (cover_letters)
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  cv_id TEXT,
  title TEXT DEFAULT 'Lettre de motivation',
  recipient TEXT DEFAULT '',
  company TEXT DEFAULT '',
  job_title TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  content TEXT NOT NULL,
  template_id TEXT DEFAULT 'classic',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_updated_at ON public.cover_letters(updated_at DESC);

-- 4. TABLE DES PAIEMENTS (payments)
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT DEFAULT '',
  cv_id TEXT,
  cv_title TEXT,
  plan_type TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL,
  reference TEXT NOT NULL,
  payment_method TEXT DEFAULT 'paypal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  raw_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- 5. TABLE DES LOGS IA (ai_logs)
CREATE TABLE IF NOT EXISTS public.ai_logs (
  id TEXT PRIMARY KEY,
  endpoint TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_email TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT true,
  raw_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id ON public.ai_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_endpoint ON public.ai_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_ai_logs_timestamp ON public.ai_logs(timestamp DESC);

-- 6. TABLE DES MESSAGES DE CONTACT (messages)
CREATE TABLE IF NOT EXISTS public.messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'nouveau',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  replied_at TIMESTAMPTZ,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_messages_status ON public.messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- ==============================================================================
-- ACTIVATION STRICTE DE LA SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 1. POLICIES : profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT
  USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid()::text = id);

-- 2. POLICIES : cvs (Strict per-user isolation, NO global guest access)
DROP POLICY IF EXISTS "Users can manage own cvs" ON public.cvs;
CREATE POLICY "Users can manage own cvs" ON public.cvs
  FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- 3. POLICIES : cover_letters (Strict per-user isolation)
DROP POLICY IF EXISTS "Users can manage own cover letters" ON public.cover_letters;
CREATE POLICY "Users can manage own cover letters" ON public.cover_letters
  FOR ALL
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- 4. POLICIES : payments (Users can only view their own payment receipts)
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT
  USING (auth.uid()::text = user_id);

-- 5. POLICIES : messages (Public can insert contact messages, read restricted)
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.messages;
CREATE POLICY "Public can submit contact messages" ON public.messages
  FOR INSERT
  WITH CHECK (true);

-- 6. POLICIES : ai_logs (Users can view their own AI usage logs)
DROP POLICY IF EXISTS "Users can view own ai logs" ON public.ai_logs;
CREATE POLICY "Users can view own ai logs" ON public.ai_logs
  FOR SELECT
  USING (auth.uid()::text = user_id);
