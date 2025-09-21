-- Drop existing triggers and functions if they exist
DROP TRIGGER IF EXISTS on_user_profiles_updated ON public.user_profiles;
DROP TRIGGER IF EXISTS on_collections_updated ON public.collections;
DROP TRIGGER IF EXISTS on_keys_updated ON public.keys;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_updated_at();
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create improved trigger function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_name TEXT;
  master_hash TEXT;
  avatar_url_val TEXT;
  theme_pref TEXT;
  two_factor_val BOOLEAN;
BEGIN
  -- Debug: Log the raw_user_meta_data content
  RAISE NOTICE 'Creating profile for user %, meta_data: %', NEW.id, NEW.raw_user_meta_data;
  
  -- Extract values with proper null handling
  user_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'display_name',
    ''
  );
  
  master_hash := NEW.raw_user_meta_data->>'master_password_hash';
  avatar_url_val := NEW.raw_user_meta_data->>'avatar_url';
  theme_pref := COALESCE(NEW.raw_user_meta_data->>'theme_preference', 'system');
  
  -- Handle boolean conversion safely
  BEGIN
    two_factor_val := COALESCE((NEW.raw_user_meta_data->>'two_factor_enabled')::boolean, false);
  EXCEPTION
    WHEN OTHERS THEN
      two_factor_val := false;
  END;

  -- Insert the user profile
  INSERT INTO public.user_profiles (
    id,
    full_name,
    avatar_url,
    theme_preference,
    master_password_hash,
    two_factor_enabled,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    user_name,
    avatar_url_val,
    theme_pref,
    master_hash,
    two_factor_val,
    now(),
    now()
  );

  -- Log successful profile creation
  RAISE NOTICE 'Successfully created user profile for user: % with name: %', NEW.id, user_name;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the detailed error
    RAISE WARNING 'Failed to create user profile for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;
    -- You can choose to either fail the user creation or continue
    -- To fail: RAISE;
    -- To continue: RETURN NEW;
    RAISE; -- This will fail the user creation if profile creation fails
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set the owner of the function to postgres
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Apply updated_at triggers to tables
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

-- Create trigger to automatically create user profile when auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;