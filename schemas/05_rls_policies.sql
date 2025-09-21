-- 05_rls_policies_updated.sql

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own collections." ON public.collections;
DROP POLICY IF EXISTS "Users can insert their own collections." ON public.collections;
DROP POLICY IF EXISTS "Users can update their own collections." ON public.collections;
DROP POLICY IF EXISTS "Users can delete their own collections." ON public.collections;
DROP POLICY IF EXISTS "Users can view their own keys." ON public.keys;
DROP POLICY IF EXISTS "Users can insert their own keys." ON public.keys;
DROP POLICY IF EXISTS "Users can update their own keys." ON public.keys;
DROP POLICY IF EXISTS "Users can delete their own keys." ON public.keys;
DROP POLICY IF EXISTS "Users can view their own audit logs." ON public.audit_logs;
DROP POLICY IF EXISTS "Service roles can insert audit logs." ON public.audit_logs;

-- Enable RLS for all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_profiles
CREATE POLICY "Users can view their own profile." ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Allow only system (triggers/functions) to insert profiles
-- This prevents manual profile creation and ensures it goes through the trigger
CREATE POLICY "System can insert profiles." ON public.user_profiles
  FOR INSERT WITH CHECK (
    -- Allow if called from a function with SECURITY DEFINER (like our trigger)
    current_setting('role', true) = 'postgres' OR
    auth.role() = 'service_role'
  );

-- RLS policies for collections
CREATE POLICY "Users can view their own collections." ON public.collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collections." ON public.collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections." ON public.collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections." ON public.collections
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for keys
CREATE POLICY "Users can view their own keys." ON public.keys
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own keys." ON public.keys
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own keys." ON public.keys
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own keys." ON public.keys
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for audit_logs
CREATE POLICY "Users can view their own audit logs." ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs." ON public.audit_logs
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    current_setting('role', true) = 'postgres'
  );

-- Additional security: Ensure service role can bypass RLS when needed
ALTER TABLE public.user_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.collections FORCE ROW LEVEL SECURITY;
ALTER TABLE public.keys FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;