
CREATE TABLE IF NOT EXISTS public.media_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.media_folders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view folders" ON public.media_folders FOR SELECT USING (true);
CREATE POLICY "Admins manage folders" ON public.media_folders FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL UNIQUE,
  folder TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL,
  mime_type TEXT,
  size BIGINT NOT NULL DEFAULT 0,
  hash TEXT,
  width INTEGER,
  height INTEGER,
  is_video BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS media_assets_hash_unique ON public.media_assets(hash) WHERE hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS media_assets_folder_idx ON public.media_assets(folder);
CREATE INDEX IF NOT EXISTS media_assets_is_video_idx ON public.media_assets(is_video);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view media assets" ON public.media_assets FOR SELECT USING (true);
CREATE POLICY "Admins manage media assets" ON public.media_assets FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.media_folders (name) VALUES
  ('home'),('segments'),('cases'),('produtora'),('marketing'),('restaurantes'),('sobre'),('institucional'),('banners'),('projects')
ON CONFLICT (name) DO NOTHING;
