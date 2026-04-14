
ALTER TABLE public.profiles 
  ADD COLUMN country text,
  ADD COLUMN state_province text,
  ADD COLUMN marketing_opt_out boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'publisher');
  RETURN NEW;
END;
$function$;
