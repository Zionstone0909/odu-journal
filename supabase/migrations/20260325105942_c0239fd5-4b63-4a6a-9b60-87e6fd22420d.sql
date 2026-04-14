
-- Add manuscript workflow columns to articles
ALTER TABLE public.articles
  ADD COLUMN status TEXT NOT NULL DEFAULT 'submitted',
  ADD COLUMN reviewer_id UUID REFERENCES auth.users(id),
  ADD COLUMN editor_id UUID REFERENCES auth.users(id),
  ADD COLUMN editor_notes TEXT,
  ADD COLUMN reviewer_notes TEXT,
  ADD COLUMN decision TEXT,
  ADD COLUMN submitted_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN reviewed_at TIMESTAMPTZ,
  ADD COLUMN decided_at TIMESTAMPTZ;

-- Editors can view all articles for review
CREATE POLICY "Editors can view all articles"
  ON public.articles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));

-- Allow profiles to be viewed by editors/admins (to show author info)
CREATE POLICY "Editors can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
