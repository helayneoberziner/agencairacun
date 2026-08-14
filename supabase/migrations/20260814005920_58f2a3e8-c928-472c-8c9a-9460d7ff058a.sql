-- 1) Remove sensitive gallery tables from the realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.gallery_orders;
ALTER PUBLICATION supabase_realtime DROP TABLE public.gallery_visits;
ALTER PUBLICATION supabase_realtime DROP TABLE public.gallery_items;
ALTER PUBLICATION supabase_realtime DROP TABLE public.gallery_galleries;
ALTER PUBLICATION supabase_realtime DROP TABLE public.gallery_albums;
ALTER PUBLICATION supabase_realtime DROP TABLE public.gallery_favorites;

-- 2) Hard-deny direct Data API access for public roles; all public reads go
--    through SECURITY DEFINER RPCs (get_gallery_by_slug, get_gallery_content)
--    and edge functions that verify password/session tokens.
REVOKE ALL ON public.gallery_galleries FROM anon, authenticated;
REVOKE ALL ON public.gallery_items FROM anon, authenticated;
REVOKE ALL ON public.gallery_albums FROM anon, authenticated;
REVOKE ALL ON public.gallery_orders FROM anon, authenticated;
REVOKE ALL ON public.gallery_order_items FROM anon, authenticated;
REVOKE ALL ON public.gallery_visits FROM anon, authenticated;
REVOKE ALL ON public.gallery_downloads FROM anon, authenticated;
REVOKE ALL ON public.gallery_favorites FROM anon, authenticated;
REVOKE ALL ON public.gallery_sessions FROM anon, authenticated;

GRANT ALL ON public.gallery_galleries TO service_role;
GRANT ALL ON public.gallery_items TO service_role;
GRANT ALL ON public.gallery_albums TO service_role;
GRANT ALL ON public.gallery_orders TO service_role;
GRANT ALL ON public.gallery_order_items TO service_role;
GRANT ALL ON public.gallery_visits TO service_role;
GRANT ALL ON public.gallery_downloads TO service_role;
GRANT ALL ON public.gallery_favorites TO service_role;
GRANT ALL ON public.gallery_sessions TO service_role;

-- 3) Explicit restrictive policies so a future permissive policy cannot open
--    item/album/order/visit data to anonymous visitors.
DROP POLICY IF EXISTS "gallery_items_deny_anon" ON public.gallery_items;
CREATE POLICY "gallery_items_deny_anon" ON public.gallery_items
  AS RESTRICTIVE FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "gallery_albums_deny_anon" ON public.gallery_albums;
CREATE POLICY "gallery_albums_deny_anon" ON public.gallery_albums
  AS RESTRICTIVE FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "gallery_orders_deny_anon" ON public.gallery_orders;
CREATE POLICY "gallery_orders_deny_anon" ON public.gallery_orders
  AS RESTRICTIVE FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "gallery_visits_deny_anon" ON public.gallery_visits;
CREATE POLICY "gallery_visits_deny_anon" ON public.gallery_visits
  AS RESTRICTIVE FOR SELECT TO anon USING (false);

DROP POLICY IF EXISTS "gallery_galleries_deny_anon" ON public.gallery_galleries;
CREATE POLICY "gallery_galleries_deny_anon" ON public.gallery_galleries
  AS RESTRICTIVE FOR SELECT TO anon USING (false);
