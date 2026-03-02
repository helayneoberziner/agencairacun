
-- Create storage bucket for client logos
INSERT INTO storage.buckets (id, name, public) VALUES ('client-logos', 'client-logos', true);

-- Allow anyone to view client logos
CREATE POLICY "Anyone can view client logos" ON storage.objects FOR SELECT USING (bucket_id = 'client-logos');

-- Allow admins to manage client logos
CREATE POLICY "Admins can manage client logos" ON storage.objects FOR ALL USING (bucket_id = 'client-logos' AND public.has_role(auth.uid(), 'admin'));
