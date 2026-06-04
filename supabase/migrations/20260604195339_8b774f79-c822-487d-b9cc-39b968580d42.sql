ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS subcategory text,
  ADD COLUMN IF NOT EXISTS appears_in text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS home_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS cover_media_id uuid;

CREATE INDEX IF NOT EXISTS cases_appears_in_idx ON public.cases USING GIN (appears_in);
CREATE INDEX IF NOT EXISTS cases_segments_idx ON public.cases USING GIN (segments);