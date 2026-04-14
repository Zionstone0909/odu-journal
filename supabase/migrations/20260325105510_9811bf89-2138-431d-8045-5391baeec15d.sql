
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'reviewer', 'publisher');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  institution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Function to count editors
CREATE OR REPLACE FUNCTION public.count_editors()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM public.user_roles WHERE role = 'editor'
$$;

-- Function to count admins
CREATE OR REPLACE FUNCTION public.count_admins()
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM public.user_roles WHERE role = 'admin'
$$;

-- RLS for user_roles: users can see own roles, admins can manage all
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Articles table with paywall
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  abstract TEXT,
  article_type TEXT NOT NULL DEFAULT 'Research Article',
  doi TEXT,
  published_date TIMESTAMPTZ DEFAULT now(),
  is_locked BOOLEAN NOT NULL DEFAULT false,
  price_cents INTEGER DEFAULT 0,
  pdf_url TEXT,
  volume INTEGER,
  issue INTEGER,
  access_type TEXT NOT NULL DEFAULT 'Open Access',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Anyone can view article metadata
CREATE POLICY "Anyone can view articles" ON public.articles FOR SELECT USING (true);
-- Publishers can insert articles
CREATE POLICY "Publishers can insert" ON public.articles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'publisher') OR public.has_role(auth.uid(), 'admin'));
-- Editors and admins can update
CREATE POLICY "Editors can update" ON public.articles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'admin'));
-- Only admins can delete
CREATE POLICY "Admins can delete" ON public.articles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Article purchases table
CREATE TABLE public.article_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE NOT NULL,
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  amount_cents INTEGER NOT NULL DEFAULT 0,
  UNIQUE (user_id, article_id)
);

ALTER TABLE public.article_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" ON public.article_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON public.article_purchases FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  -- Default role: publisher
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'publisher');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
