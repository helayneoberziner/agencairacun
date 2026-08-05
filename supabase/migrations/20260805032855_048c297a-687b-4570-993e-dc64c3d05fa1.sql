-- 1. Session table proving password/access verification
CREATE TABLE public.gallery_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.gallery_galleries(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_gallery_sessions_token ON public.gallery_sessions(token);

GRANT ALL ON public.gallery_sessions TO service_role;
ALTER TABLE public.gallery_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view gallery sessions" ON public.gallery_sessions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Remove public direct-read access to gallery data
DROP POLICY IF EXISTS "Public views active galleries" ON public.gallery_galleries;
DROP POLICY IF EXISTS "Public views items of active galleries" ON public.gallery_items;
DROP POLICY IF EXISTS "Public views albums of active galleries" ON public.gallery_albums;
DROP POLICY IF EXISTS "Public views favorites of active galleries" ON public.gallery_favorites;

REVOKE SELECT ON public.gallery_galleries FROM anon;
REVOKE SELECT ON public.gallery_items FROM anon;
REVOKE SELECT ON public.gallery_albums FROM anon;
REVOKE SELECT ON public.gallery_favorites FROM anon;

-- 3. Token validation helper
CREATE OR REPLACE FUNCTION public.gallery_session_valid(_gallery_id uuid, _token text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.gallery_sessions s
    WHERE s.gallery_id = _gallery_id
      AND s.token = _token
      AND s.expires_at > now()
  )
$$;

-- 4. Token gated content RPC (items + albums + own favorites)
CREATE OR REPLACE FUNCTION public.get_gallery_content(_gallery_id uuid, _token text, _client_key text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _ok boolean;
  _result jsonb;
BEGIN
  IF _token IS NULL OR length(_token) < 10 THEN
    RAISE EXCEPTION 'access_denied';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.gallery_sessions s
    JOIN public.gallery_galleries g ON g.id = s.gallery_id
    WHERE s.gallery_id = _gallery_id
      AND s.token = _token
      AND s.expires_at > now()
      AND g.status = 'active'
      AND (g.expires_at IS NULL OR g.expires_at > now())
  ) INTO _ok;

  IF NOT _ok THEN
    RAISE EXCEPTION 'access_denied';
  END IF;

  SELECT jsonb_build_object(
    'items', COALESCE((
      SELECT jsonb_agg(to_jsonb(i) ORDER BY i.display_order, i.created_at)
      FROM public.gallery_items i WHERE i.gallery_id = _gallery_id
    ), '[]'::jsonb),
    'albums', COALESCE((
      SELECT jsonb_agg(to_jsonb(a) ORDER BY a.display_order)
      FROM public.gallery_albums a WHERE a.gallery_id = _gallery_id
    ), '[]'::jsonb),
    'favorites', COALESCE((
      SELECT jsonb_agg(f.item_id)
      FROM public.gallery_favorites f
      WHERE f.gallery_id = _gallery_id AND _client_key IS NOT NULL AND f.client_key = _client_key
    ), '[]'::jsonb)
  ) INTO _result;

  RETURN _result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_gallery_content(uuid, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.get_gallery_content(uuid, text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.gallery_session_valid(uuid, text) TO anon, authenticated, service_role;

-- 5. Favorites writes require a valid session token; no public reads at all
DROP POLICY IF EXISTS "Public adds favorites on active galleries" ON public.gallery_favorites;
DROP POLICY IF EXISTS "Public removes favorites on active galleries" ON public.gallery_favorites;

CREATE OR REPLACE FUNCTION public.toggle_gallery_favorite(_gallery_id uuid, _item_id uuid, _token text, _client_key text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _existing uuid;
BEGIN
  IF _client_key IS NULL OR length(_client_key) < 6 THEN
    RAISE EXCEPTION 'access_denied';
  END IF;
  IF NOT public.gallery_session_valid(_gallery_id, _token) THEN
    RAISE EXCEPTION 'access_denied';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.gallery_items i WHERE i.id = _item_id AND i.gallery_id = _gallery_id) THEN
    RAISE EXCEPTION 'invalid_item';
  END IF;

  SELECT id INTO _existing FROM public.gallery_favorites
  WHERE gallery_id = _gallery_id AND item_id = _item_id AND client_key = _client_key;

  IF _existing IS NOT NULL THEN
    DELETE FROM public.gallery_favorites WHERE id = _existing;
    RETURN false;
  END IF;

  INSERT INTO public.gallery_favorites (gallery_id, item_id, client_key)
  VALUES (_gallery_id, _item_id, _client_key);
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_gallery_favorite(uuid, uuid, text, text) TO anon, authenticated, service_role;

-- 6. Visits: only allow logging with a valid session token
DROP POLICY IF EXISTS "Public logs gallery visits" ON public.gallery_visits;
CREATE OR REPLACE FUNCTION public.log_gallery_visit(_gallery_id uuid, _token text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.gallery_session_valid(_gallery_id, _token) THEN
    RAISE EXCEPTION 'access_denied';
  END IF;
  INSERT INTO public.gallery_visits (gallery_id) VALUES (_gallery_id);
END;
$$;
GRANT EXECUTE ON FUNCTION public.log_gallery_visit(uuid, text) TO anon, authenticated, service_role;