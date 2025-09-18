
-- 05_rls_policies.sql

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

CREATE POLICY "Service roles can insert audit logs." ON public.audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');
