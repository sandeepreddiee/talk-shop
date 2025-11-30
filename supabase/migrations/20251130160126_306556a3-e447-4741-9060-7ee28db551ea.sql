-- Fix search_path for generate_unique_pin function
CREATE OR REPLACE FUNCTION generate_unique_pin()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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