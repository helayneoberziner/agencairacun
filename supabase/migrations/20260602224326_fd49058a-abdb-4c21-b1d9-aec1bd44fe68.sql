
-- 1) Extend media_assets to support YouTube references
ALTER TABLE public.media_assets
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'image',
  ADD COLUMN IF NOT EXISTS youtube_id text,
  ADD COLUMN IF NOT EXISTS youtube_title text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Backfill kind from is_video where defaulted
UPDATE public.media_assets
  SET kind = CASE WHEN is_video THEN 'video_file' ELSE 'image' END
  WHERE kind = 'image' AND is_video = true;

-- Make path nullable for YouTube-only entries
ALTER TABLE public.media_assets ALTER COLUMN path DROP NOT NULL;
ALTER TABLE public.media_assets ALTER COLUMN hash DROP NOT NULL;
ALTER TABLE public.media_assets ALTER COLUMN size DROP NOT NULL;
ALTER TABLE public.media_assets ALTER COLUMN size SET DEFAULT 0;

-- 2) Categories table (dynamic)
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  kind text NOT NULL DEFAULT 'case',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.categories (name, slug, kind, display_order) VALUES
  ('Foto', 'foto', 'case', 1),
  ('Vídeo', 'video', 'case', 2),
  ('Foto + Vídeo', 'foto-video', 'case', 3),
  ('Marketing', 'marketing', 'case', 4),
  ('Branding', 'branding', 'case', 5)
ON CONFLICT (slug) DO NOTHING;

-- 3) Cases (one page per client, evolves over time)
CREATE TABLE IF NOT EXISTS public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  client_name text NOT NULL,
  title text NOT NULL,
  subtitle text,
  hero_kind text NOT NULL DEFAULT 'image',
  hero_media_url text,
  hero_youtube_id text,
  hero_image_url text,
  challenge text,
  strategy text,
  solution text,
  results_text text,
  metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  testimonial_text text,
  testimonial_author text,
  categories text[] NOT NULL DEFAULT '{}',
  segments text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  show_on_home boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  og_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cases TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cases TO authenticated;
GRANT ALL ON public.cases TO service_role;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active cases" ON public.cases FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage cases" ON public.cases FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON public.cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Case media (gallery with sections + dnd order)
CREATE TABLE IF NOT EXISTS public.case_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'image',
  url text,
  youtube_id text,
  caption text,
  section text NOT NULL DEFAULT 'galeria',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS case_media_case_idx ON public.case_media(case_id, section, display_order);
GRANT SELECT ON public.case_media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_media TO authenticated;
GRANT ALL ON public.case_media TO service_role;
ALTER TABLE public.case_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view case media" ON public.case_media FOR SELECT USING (true);
CREATE POLICY "Admins manage case media" ON public.case_media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
