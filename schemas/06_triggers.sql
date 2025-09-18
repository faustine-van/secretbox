
-- 06_triggers.sql

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER on_user_profiles_updated
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_collections_updated
  BEFORE UPDATE ON public.collections
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_keys_updated
  BEFORE UPDATE ON public.keys
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();
