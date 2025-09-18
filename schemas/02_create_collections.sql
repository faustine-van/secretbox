
-- 02_create_collections.sql

-- Create collections table
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

-- Add comments to collections table
COMMENT ON TABLE public.collections IS 'A collection of secrets.';

-- Add indexes
CREATE INDEX idx_collections_user_id ON public.collections(user_id);
CREATE INDEX idx_collections_name ON public.collections(name);
