-- Fix has_role function to accept text instead of enum
-- This allows the RPC calls to pass string values that get cast to app_role enum

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role text)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = _role::app_role
  )
$$;

-- Also update get_user_role if it exists to handle the migration consistently
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;
