-- ============================================================
-- Reset and recreate schema for user_profiles, collections, keys,
-- audit_logs, functions, triggers, policies, and permissions
-- ============================================================

-- ============================
-- DROP SECTION (clean reset)
-- ============================

-- Drop policies
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename
           FROM pg_policies
           WHERE schemaname = 'public'
             AND tablename IN ('user_profiles','collections','keys','audit_logs')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END$$;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_user_profiles_updated ON public.user_profiles;
DROP TRIGGER IF EXISTS on_collections_updated ON public.collections;
DROP TRIGGER IF EXISTS on_keys_updated ON public.keys;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- Drop tables
DROP TABLE IF EXISTS public.audit_logs CASCADE;
DROP TABLE IF EXISTS public.keys CASCADE;
DROP TABLE IF EXISTS public.collections CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Drop enum types
DROP TYPE IF EXISTS public.key_type CASCADE;

-- ============================
-- CREATE SECTION
-- ============================

-- 01_create_user_profiles.sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  theme_preference TEXT DEFAULT 'system',
  master_password_hash TEXT,
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

COMMENT ON TABLE public.user_profiles IS 'User profile information, extending auth.users.';
COMMENT ON COLUMN public.user_profiles.id IS 'Links to auth.users table.';
COMMENT ON COLUMN public.user_profiles.theme_preference IS 'User theme preference (e.g., light, dark, system).';
COMMENT ON COLUMN public.user_profiles.master_password_hash IS 'Hash of the user''s master password for additional security.';

CREATE INDEX idx_user_profiles_full_name ON public.user_profiles(full_name);

-- 02_create_collections.sql
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  icon TEXT,
  is_archived BOOLEAN DEFAULT false,
  sort_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

COMMENT ON TABLE public.collections IS 'A collection of secrets.';

CREATE INDEX idx_collections_user_id ON public.collections(user_id);
CREATE INDEX idx_collections_name ON public.collections(name);

-- 03_create_keys.sql
CREATE TYPE public.key_type AS ENUM ('api_key', 'secret', 'token', 'credential');

CREATE TABLE public.keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  encrypted_value TEXT NOT NULL,
  iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
  salt TEXT NOT NULL,
  description TEXT,
  key_type public.key_type,
  tags TEXT[],
  url TEXT,
  username TEXT,
  expires_at TIMESTAMPTZ,
  is_favorite BOOLEAN DEFAULT false,
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

COMMENT ON TABLE public.keys IS 'Stores encrypted key-value pairs.';

CREATE INDEX idx_keys_user_id ON public.keys(user_id);
CREATE INDEX idx_keys_collection_id ON public.keys(collection_id);
CREATE INDEX idx_keys_name ON public.keys(name);
CREATE INDEX idx_keys_tags ON public.keys USING GIN(tags);

-- 04_create_audit_logs.sql
CREATE TABLE public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  success BOOLEAN DEFAULT TRUE,
  duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

COMMENT ON TABLE public.audit_logs IS 'Tracks user actions for security and auditing.';

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON public.audit_logs(resource_type);

-- 05_create_functions_and_triggers.sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  master_hash TEXT;
  avatar_url_val TEXT;
  theme_pref TEXT;
  two_factor_val BOOLEAN;
BEGIN
  RAISE LOG 'Creating profile for user %, meta_data: %', NEW.id, NEW.raw_user_meta_data;
  
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    ''
  );
  
  master_hash := NEW.raw_user_meta_data->>'master_password_hash';
  avatar_url_val := NEW.raw_user_meta_data->>'avatar_url';
  theme_pref := COALESCE(NEW.raw_user_meta_data->>'theme_preference', 'system');
  
  BEGIN
    two_factor_val := COALESCE((NEW.raw_user_meta_data->>'two_factor_enabled')::boolean, false);
  EXCEPTION WHEN OTHERS THEN
    two_factor_val := false;
  END;

  INSERT INTO public.user_profiles (
    id, full_name, avatar_url, theme_preference,
    master_password_hash, two_factor_enabled,
    created_at, updated_at
  ) VALUES (
    NEW.id, user_name, avatar_url_val, theme_pref,
    master_hash, two_factor_val, now(), now()
  );

  RAISE LOG 'Successfully created user profile for user: % with name: %', NEW.id, user_name;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Failed to create user profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_user_profiles_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_collections_updated
  BEFORE UPDATE ON public.collections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_keys_updated
  BEFORE UPDATE ON public.keys
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 06_setup_rls_policies.sql
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow profile creation" ON public.user_profiles
  FOR INSERT WITH CHECK (
    current_setting('role', true) = 'postgres'
    OR auth.role() = 'service_role'
    OR (auth.uid() = id AND auth.uid() IS NOT NULL)
  );

CREATE POLICY "Users can manage their own collections" ON public.collections
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own keys" ON public.keys
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role'
    OR current_setting('role', true) = 'postgres'
  );

-- 07_grant_permissions.sql
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT ALL ON public.user_profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;

GRANT ALL ON public.collections TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collections TO authenticated;

GRANT ALL ON public.keys TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.keys TO authenticated;

GRANT ALL ON public.audit_logs TO postgres, service_role;
GRANT SELECT ON public.audit_logs TO authenticated;

GRANT USAGE, SELECT ON SEQUENCE public.audit_logs_id_seq TO authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres, service_role;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO postgres, authenticated, service_role;
