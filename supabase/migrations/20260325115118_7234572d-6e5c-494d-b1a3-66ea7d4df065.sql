
ALTER TABLE public.profiles 
  ADD COLUMN is_approved boolean NOT NULL DEFAULT false,
  ADD COLUMN approved_at timestamp with time zone,
  ADD COLUMN approved_by uuid;

-- Update existing users to be approved
UPDATE public.profiles SET is_approved = true;

-- Function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_user_approved(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_approved FROM public.profiles WHERE id = _user_id),
    false
  )
$$;

-- Policy: only approved publishers can insert articles
DROP POLICY IF EXISTS "Publishers can insert" ON public.articles;
CREATE POLICY "Approved publishers can insert" ON public.articles
FOR INSERT TO authenticated
WITH CHECK (
  public.is_user_approved(auth.uid()) AND 
  (public.has_role(auth.uid(), 'publisher') OR public.has_role(auth.uid(), 'admin'))
);
