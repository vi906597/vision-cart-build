-- Create a function to assign admin role (for first admin setup via service role)
CREATE OR REPLACE FUNCTION public.assign_admin_role_by_email(_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _user_id UUID;
BEGIN
  -- Get user ID from auth.users by email
  SELECT id INTO _user_id FROM auth.users WHERE email = _email;
  
  IF _user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Insert admin role if not exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;