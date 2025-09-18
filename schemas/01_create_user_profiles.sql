-- 01_create_user_profiles.sql

-- Create user_profiles table
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

-- Add comments to user_profiles table
COMMENT ON TABLE public.user_profiles IS 'User profile information, extending auth.users.';
COMMENT ON COLUMN public.user_profiles.id IS 'Links to auth.users table.';
COMMENT ON COLUMN public.user_profiles.theme_preference IS 'User theme preference (e.g., light, dark, system).';
COMMENT ON COLUMN public.user_profiles.master_password_hash IS 'Hash of the user''s master password for additional security.';

-- Add indexes
CREATE INDEX idx_user_profiles_full_name ON public.user_profiles(full_name);

