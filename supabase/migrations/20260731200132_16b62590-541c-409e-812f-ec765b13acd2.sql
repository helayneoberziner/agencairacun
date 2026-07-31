-- 1. Missing grants (root cause of broken public gallery)
GRANT SELECT ON public.gallery_galleries TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_galleries TO authenticated;
GRANT ALL ON public.gallery_galleries TO service_role;

GRANT SELECT ON public.gallery_albums TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_albums TO authenticated;
GRANT ALL ON public.gallery_albums TO service_role;

GRANT SELECT ON public.gallery_items TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;

GRANT INSERT ON public.gallery_visits TO anon, authenticated;
GRANT SELECT ON public.gallery_visits TO authenticated;
GRANT ALL ON public.gallery_visits TO service_role;

GRANT SELECT ON public.gallery_downloads TO authenticated;
GRANT ALL ON public.gallery_downloads TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_orders TO authenticated;
GRANT ALL ON public.gallery_orders TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_order_items TO authenticated;
GRANT ALL ON public.gallery_order_items TO service_role;

-- 2. Favorites
CREATE TABLE public.gallery_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.gallery_galleries(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.gallery_items(id) ON DELETE CASCADE,
  client_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (item_id, client_key)
);

GRANT SELECT, INSERT, DELETE ON public.gallery_favorites TO anon, authenticated;
GRANT ALL ON public.gallery_favorites TO service_role;

ALTER TABLE public.gallery_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public views favorites of active galleries"
ON public.gallery_favorites FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.gallery_galleries g WHERE g.id = gallery_id AND g.status = 'active' AND (g.expires_at IS NULL OR g.expires_at > now())));

CREATE POLICY "Public adds favorites on active galleries"
ON public.gallery_favorites FOR INSERT TO anon, authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.gallery_galleries g WHERE g.id = gallery_id AND g.status = 'active' AND (g.expires_at IS NULL OR g.expires_at > now())));

CREATE POLICY "Public removes favorites on active galleries"
ON public.gallery_favorites FOR DELETE TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.gallery_galleries g WHERE g.id = gallery_id AND g.status = 'active' AND (g.expires_at IS NULL OR g.expires_at > now())));

CREATE POLICY "Admins manage gallery favorites"
ON public.gallery_favorites FOR ALL TO authenticated
USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- 3. Counters
CREATE OR REPLACE FUNCTION public.sync_gallery_favorite_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.gallery_items SET favorite_count = favorite_count + 1 WHERE id = NEW.item_id;
    RETURN NEW;
  ELSE
    UPDATE public.gallery_items SET favorite_count = GREATEST(favorite_count - 1, 0) WHERE id = OLD.item_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER trg_gallery_favorite_count
AFTER INSERT OR DELETE ON public.gallery_favorites
FOR EACH ROW EXECUTE FUNCTION public.sync_gallery_favorite_count();

CREATE OR REPLACE FUNCTION public.sync_gallery_visit_count()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.gallery_galleries SET visit_count = visit_count + 1 WHERE id = NEW.gallery_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_gallery_visit_count
AFTER INSERT ON public.gallery_visits
FOR EACH ROW EXECUTE FUNCTION public.sync_gallery_visit_count();

CREATE OR REPLACE FUNCTION public.sync_gallery_total_sold()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'paid' AND (OLD.status IS DISTINCT FROM 'paid') THEN
    UPDATE public.gallery_galleries SET total_sold = total_sold + NEW.total WHERE id = NEW.gallery_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_gallery_total_sold
AFTER INSERT OR UPDATE OF status ON public.gallery_orders
FOR EACH ROW EXECUTE FUNCTION public.sync_gallery_total_sold();

-- 4. Realtime
ALTER TABLE public.gallery_galleries REPLICA IDENTITY FULL;
ALTER TABLE public.gallery_items REPLICA IDENTITY FULL;
ALTER TABLE public.gallery_visits REPLICA IDENTITY FULL;
ALTER TABLE public.gallery_favorites REPLICA IDENTITY FULL;
ALTER TABLE public.gallery_orders REPLICA IDENTITY FULL;

DO $pub$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['gallery_galleries','gallery_items','gallery_visits','gallery_favorites','gallery_orders'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename=t) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $pub$;