
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.cases; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.case_media; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.segment_pages; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
ALTER TABLE public.cases REPLICA IDENTITY FULL;
ALTER TABLE public.case_media REPLICA IDENTITY FULL;
ALTER TABLE public.segment_pages REPLICA IDENTITY FULL;
