
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS gallery_urls TEXT[],
  ADD COLUMN IF NOT EXISTS client_name TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_text TEXT,
  ADD COLUMN IF NOT EXISTS testimonial_author TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT;

UPDATE public.projects
SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE slug IS NULL OR slug = '';

WITH dups AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) AS rn
  FROM public.projects
  WHERE slug IS NOT NULL
)
UPDATE public.projects p
SET slug = p.slug || '-' || substring(p.id::text, 1, 6)
FROM dups d
WHERE p.id = d.id AND d.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_unique ON public.projects (slug);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  photo_url TEXT,
  social_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view team members" ON public.team_members;
CREATE POLICY "Anyone can view team members"
  ON public.team_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
CREATE POLICY "Admins can manage team members"
  ON public.team_members FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP TRIGGER IF EXISTS trg_team_members_updated_at ON public.team_members;
CREATE TRIGGER trg_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE IF NOT EXISTS public.proposal_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  text TEXT NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category, text)
);

ALTER TABLE public.proposal_suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view suggestions" ON public.proposal_suggestions;
CREATE POLICY "Anyone can view suggestions"
  ON public.proposal_suggestions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert suggestions" ON public.proposal_suggestions;
CREATE POLICY "Anyone can insert suggestions"
  ON public.proposal_suggestions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage suggestions" ON public.proposal_suggestions;
CREATE POLICY "Admins can manage suggestions"
  ON public.proposal_suggestions FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.proposal_suggestions (category, text) VALUES
  ('marketing', 'Gestão de tráfego pago'),
  ('marketing', 'Social Media'),
  ('marketing', 'Estratégia de conteúdo'),
  ('marketing', 'Meta Ads'),
  ('marketing', 'Google Ads'),
  ('marketing', 'Landing Page'),
  ('marketing', 'Relatórios mensais'),
  ('marketing', 'Planejamento de campanhas'),
  ('marketing', 'Criação de artes e copies'),
  ('audiovisual', 'Captação de vídeo em 4K'),
  ('audiovisual', 'Captação com drone'),
  ('audiovisual', 'Edição e pós produção'),
  ('audiovisual', 'Fotos profissionais'),
  ('audiovisual', 'Cobertura de evento'),
  ('audiovisual', 'Roteiro criativo'),
  ('audiovisual', 'Color grading'),
  ('audiovisual', 'Versão vertical para stories e reels'),
  ('complete', 'Tudo do plano Marketing Digital'),
  ('complete', 'Tudo do plano Audiovisual'),
  ('complete', 'Estratégia integrada de conteúdo'),
  ('complete', 'Suporte prioritário')
ON CONFLICT (category, text) DO NOTHING;
