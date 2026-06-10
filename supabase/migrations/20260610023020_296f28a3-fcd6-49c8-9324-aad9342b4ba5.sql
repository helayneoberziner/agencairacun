DROP POLICY IF EXISTS "Anyone can insert suggestions" ON public.proposal_suggestions;
DROP POLICY IF EXISTS "Anyone can view suggestions" ON public.proposal_suggestions;

DROP POLICY IF EXISTS "Anyone can view active proposals" ON public.proposals;

CREATE OR REPLACE FUNCTION public.get_proposal_by_slug(_slug text)
RETURNS SETOF public.proposals
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.proposals WHERE slug = _slug AND is_active = true LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_proposal_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_proposal_by_slug(text) TO anon, authenticated;