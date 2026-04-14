
CREATE TABLE public.contact_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact inquiry
CREATE POLICY "Anyone can insert contact inquiries"
  ON public.contact_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view inquiries
CREATE POLICY "Admins can view contact inquiries"
  ON public.contact_inquiries
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
