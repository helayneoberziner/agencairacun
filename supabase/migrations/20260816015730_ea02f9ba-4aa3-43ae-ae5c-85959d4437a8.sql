-- Grants: admin panel (authenticated) + edge functions (service_role). No anon access.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_albums TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_favorites TO authenticated;
GRANT SELECT ON public.gallery_downloads TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
GRANT ALL ON public.gallery_albums TO service_role;
GRANT ALL ON public.gallery_favorites TO service_role;
GRANT ALL ON public.gallery_downloads TO service_role;

-- gallery_items: enforce admin-only direct access for every role (public path uses SECURITY DEFINER RPCs)
DROP POLICY IF EXISTS gallery_items_deny_anon ON public.gallery_items;
CREATE POLICY gallery_items_admin_only_direct
ON public.gallery_items AS RESTRICTIVE FOR ALL TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- gallery_albums: same enforcement
DROP POLICY IF EXISTS gallery_albums_deny_anon ON public.gallery_albums;
CREATE POLICY gallery_albums_admin_only_direct
ON public.gallery_albums AS RESTRICTIVE FOR ALL TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- gallery_favorites: no client-side reads/writes; toggling happens via toggle_gallery_favorite RPC
CREATE POLICY gallery_favorites_admin_only_direct
ON public.gallery_favorites AS RESTRICTIVE FOR ALL TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- gallery_downloads: only admins may read; nobody but service_role/definer functions may write
CREATE POLICY gallery_downloads_admin_only_direct
ON public.gallery_downloads AS RESTRICTIVE FOR ALL TO public
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));