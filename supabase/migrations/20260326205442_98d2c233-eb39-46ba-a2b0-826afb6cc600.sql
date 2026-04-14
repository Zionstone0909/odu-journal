
-- Journals table
CREATE TABLE public.journals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  issn TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  impact_factor NUMERIC(5,3),
  subject_category TEXT NOT NULL DEFAULT 'General',
  publisher TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view journals" ON public.journals FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage journals" ON public.journals FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Article authors table (with ORCID support)
CREATE TABLE public.article_authors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  orcid_id TEXT,
  affiliation TEXT,
  contact_email TEXT,
  author_order INTEGER NOT NULL DEFAULT 1,
  is_corresponding BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.article_authors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view article authors" ON public.article_authors FOR SELECT TO public USING (true);
CREATE POLICY "Admins and editors can manage" ON public.article_authors FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

-- Citations table (many-to-many)
CREATE TABLE public.citations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  citing_article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  cited_article_id UUID REFERENCES public.articles(id) ON DELETE SET NULL,
  cited_doi TEXT,
  cited_title TEXT,
  cited_authors TEXT,
  cited_journal TEXT,
  cited_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view citations" ON public.citations FOR SELECT TO public USING (true);
CREATE POLICY "Admins and editors can manage citations" ON public.citations FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

-- Article keywords
CREATE TABLE public.article_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL
);
ALTER TABLE public.article_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view keywords" ON public.article_keywords FOR SELECT TO public USING (true);
CREATE POLICY "Admins and editors can manage keywords" ON public.article_keywords FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

-- Institutional access table
CREATE TABLE public.institutional_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_name TEXT NOT NULL,
  ip_range_start INET NOT NULL,
  ip_range_end INET NOT NULL,
  contact_email TEXT,
  subscription_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.institutional_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage institutional access" ON public.institutional_access FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Article metrics table
CREATE TABLE public.article_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE UNIQUE,
  views INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  altmetric_score NUMERIC(8,2) DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.article_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view metrics" ON public.article_metrics FOR SELECT TO public USING (true);
CREATE POLICY "System can manage metrics" ON public.article_metrics FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

-- Add full_text_html and journal_id to articles
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS full_text_html TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS journal_id UUID REFERENCES public.journals(id);
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS keywords TEXT[];

-- Article version history (errata / retractions)
CREATE TABLE public.article_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  version_type TEXT NOT NULL DEFAULT 'original',
  version_number INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.article_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view versions" ON public.article_versions FOR SELECT TO public USING (true);
CREATE POLICY "Admins and editors can manage versions" ON public.article_versions FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

-- User favorites
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, article_id)
);
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own favorites" ON public.user_favorites FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
