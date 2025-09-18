
-- 03_create_keys.sql

-- Create key_type enum
CREATE TYPE public.key_type AS ENUM ('api_key', 'secret', 'token', 'credential');

-- Create keys table
CREATE TABLE public.keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  encrypted_value TEXT NOT NULL,
  encryption_iv TEXT NOT NULL,
  auth_tag TEXT NOT NULL,
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

-- Add comments to keys table
COMMENT ON TABLE public.keys IS 'Stores encrypted key-value pairs.';

-- Add indexes
CREATE INDEX idx_keys_user_id ON public.keys(user_id);
CREATE INDEX idx_keys_collection_id ON public.keys(collection_id);
CREATE INDEX idx_keys_name ON public.keys(name);
CREATE INDEX idx_keys_tags ON public.keys USING GIN(tags);
