-- Add PIN column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN login_pin text UNIQUE;

-- Function to generate random 6-digit PIN
CREATE OR REPLACE FUNCTION generate_unique_pin()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_pin text;
  pin_exists boolean;
BEGIN
  LOOP
    -- Generate random 6-digit PIN
    new_pin := LPAD(FLOOR(RANDOM() * 1000000)::text, 6, '0');
    
    -- Check if PIN already exists
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE login_pin = new_pin) INTO pin_exists;
    
    -- Exit loop if PIN is unique
    EXIT WHEN NOT pin_exists;
  END LOOP;
  
  RETURN new_pin;
END;
$$;

-- Update trigger to generate PIN when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, login_pin)
  VALUES (
    new.id, 
    new.email,
    new.raw_user_meta_data->>'display_name',
    generate_unique_pin()
  );
  RETURN new;
END;
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();