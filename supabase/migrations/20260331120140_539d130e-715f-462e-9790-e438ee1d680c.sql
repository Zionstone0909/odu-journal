
-- Table to pre-register editorial board member emails for automatic role assignment
CREATE TABLE public.editorial_board_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text UNIQUE,
  role app_role NOT NULL DEFAULT 'editor',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.editorial_board_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage editorial board members"
  ON public.editorial_board_members
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view editorial board members"
  ON public.editorial_board_members
  FOR SELECT
  TO public
  USING (true);

-- Update the handle_new_user trigger to check editorial_board_members
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _board_role app_role;
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, institution, country, state_province, marketing_opt_out)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'institution',
    NEW.raw_user_meta_data ->> 'country',
    NEW.raw_user_meta_data ->> 'state_province',
    COALESCE((NEW.raw_user_meta_data ->> 'marketing_opt_out')::boolean, false)
  );

  -- Check if this email is pre-registered as an editorial board member
  SELECT role INTO _board_role
  FROM public.editorial_board_members
  WHERE LOWER(email) = LOWER(NEW.email)
  LIMIT 1;

  IF _board_role IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _board_role);
    -- Auto-approve editorial board members
    UPDATE public.profiles SET is_approved = true, approved_at = now() WHERE id = NEW.id;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'publisher');
  END IF;

  RETURN NEW;
END;
$$;

-- Seed with current editorial board members (emails to be added by admin)
INSERT INTO public.editorial_board_members (full_name, role) VALUES
  ('Professor A. T. Akande', 'editor'),
  ('Professor G. O. Ajibade', 'editor'),
  ('Professor A. K. Makinde', 'editor'),
  ('Dr. K. O. Ogunfolabi', 'editor'),
  ('Professor Gbenga Fasiku', 'editor'),
  ('Prof. F. A. Omidire', 'editor'),
  ('Prof. S. E. O. Abiodun', 'editor'),
  ('Professor K. A. Atilade', 'editor'),
  ('Prof. S. B. Amusa', 'editor'),
  ('Dr. S. T. Ogundipe', 'editor'),
  ('Dr. O. O. Oyebode', 'editor'),
  ('Dr. Kolawole Adeniyi', 'editor'),
  ('Dr. I. S. Alimi', 'editor'),
  ('Dr. T. A. Osunniran', 'editor'),
  ('Dr. B. A. Bakare', 'editor'),
  ('Dr. O. I. Olalere', 'editor'),
  ('Dr. A. A. Ajiboro', 'editor');
