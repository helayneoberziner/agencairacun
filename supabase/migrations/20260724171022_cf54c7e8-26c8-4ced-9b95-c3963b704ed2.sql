
-- Only admins manage files in the private gallery-originals bucket.
-- Reads happen exclusively via edge function signed URLs (service role).
CREATE POLICY "Admins upload gallery originals" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery-originals' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update gallery originals" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery-originals' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete gallery originals" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'gallery-originals' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins read gallery originals" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'gallery-originals' AND public.has_role(auth.uid(), 'admin'));
