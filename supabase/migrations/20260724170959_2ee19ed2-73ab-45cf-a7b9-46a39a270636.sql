
-- ========== Galleries module (Phase 1) ==========

CREATE TABLE public.gallery_galleries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  client_name text NOT NULL DEFAULT '',
  client_email text,
  event_date date,
  cover_url text,
  title_font text NOT NULL DEFAULT 'DM Serif Display',
  title_color text NOT NULL DEFAULT '#FF00CC',
  layout text NOT NULL DEFAULT 'grid', -- grid | mosaic | carousel
  access_type text NOT NULL DEFAULT 'free', -- free | paid
  password_hash text,
  expires_at timestamptz,
  download_limit integer,
  watermark_enabled boolean NOT NULL DEFAULT false,
  watermark_text text,
  status text NOT NULL DEFAULT 'draft', -- draft | active | expired
  price_tiers jsonb NOT NULL DEFAULT '[]'::jsonb, -- [{min:1,max:5,price:50},...]
  total_sold numeric NOT NULL DEFAULT 0,
  visit_count integer NOT NULL DEFAULT 0,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery_albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.gallery_galleries(id) ON DELETE CASCADE,
  name text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.gallery_galleries(id) ON DELETE CASCADE,
  album_id uuid REFERENCES public.gallery_albums(id) ON DELETE SET NULL,
  kind text NOT NULL DEFAULT 'image', -- image | video
  original_path text NOT NULL, -- path in gallery-originals (private)
  preview_url text,            -- public URL of preview
  file_name text,
  mime_type text,
  size bigint DEFAULT 0,
  width integer,
  height integer,
  hash text,
  display_order integer NOT NULL DEFAULT 0,
  favorite_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX gallery_items_gallery_idx ON public.gallery_items(gallery_id);

CREATE TABLE public.gallery_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.gallery_galleries(id) ON DELETE CASCADE,
  client_email text NOT NULL,
  client_name text,
  status text NOT NULL DEFAULT 'pending', -- pending | paid | canceled
  subtotal numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  provider text,
  provider_payment_id text,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.gallery_orders(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.gallery_items(id) ON DELETE CASCADE,
  unit_price numeric NOT NULL DEFAULT 0
);

CREATE TABLE public.gallery_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.gallery_galleries(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.gallery_items(id) ON DELETE SET NULL,
  order_id uuid REFERENCES public.gallery_orders(id) ON DELETE SET NULL,
  ip text,
  downloaded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX gallery_downloads_gallery_idx ON public.gallery_downloads(gallery_id);

CREATE TABLE public.gallery_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id uuid NOT NULL REFERENCES public.gallery_galleries(id) ON DELETE CASCADE,
  ip text,
  visited_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX gallery_visits_gallery_idx ON public.gallery_visits(gallery_id);

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_galleries TO authenticated;
GRANT SELECT ON public.gallery_galleries TO anon;
GRANT ALL ON public.gallery_galleries TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_albums TO authenticated;
GRANT SELECT ON public.gallery_albums TO anon;
GRANT ALL ON public.gallery_albums TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT SELECT ON public.gallery_items TO anon;
GRANT ALL ON public.gallery_items TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_orders TO authenticated;
GRANT ALL ON public.gallery_orders TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_order_items TO authenticated;
GRANT ALL ON public.gallery_order_items TO service_role;

GRANT SELECT, INSERT ON public.gallery_downloads TO authenticated;
GRANT ALL ON public.gallery_downloads TO service_role;

GRANT SELECT, INSERT ON public.gallery_visits TO authenticated;
GRANT INSERT ON public.gallery_visits TO anon;
GRANT ALL ON public.gallery_visits TO service_role;

-- RLS
ALTER TABLE public.gallery_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_visits ENABLE ROW LEVEL SECURITY;

-- Admins manage everything
CREATE POLICY "Admins manage galleries" ON public.gallery_galleries
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage gallery albums" ON public.gallery_albums
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage gallery items" ON public.gallery_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage gallery orders" ON public.gallery_orders
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage gallery order items" ON public.gallery_order_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins view gallery downloads" ON public.gallery_downloads
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins view gallery visits" ON public.gallery_visits
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Public read access to active galleries (metadata only — password validated in edge function)
CREATE POLICY "Public views active galleries" ON public.gallery_galleries
  FOR SELECT TO anon, authenticated
  USING (status = 'active' AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Public views albums of active galleries" ON public.gallery_albums
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.gallery_galleries g
    WHERE g.id = gallery_id AND g.status = 'active'
      AND (g.expires_at IS NULL OR g.expires_at > now())
  ));

CREATE POLICY "Public views items of active galleries" ON public.gallery_items
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.gallery_galleries g
    WHERE g.id = gallery_id AND g.status = 'active'
      AND (g.expires_at IS NULL OR g.expires_at > now())
  ));

-- Anonymous can log a visit (increments happen via RPC too)
CREATE POLICY "Anyone can log gallery visit" ON public.gallery_visits
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- updated_at triggers
CREATE TRIGGER trg_gallery_galleries_updated
  BEFORE UPDATE ON public.gallery_galleries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_gallery_orders_updated
  BEFORE UPDATE ON public.gallery_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Secure lookup by slug (does not expose password_hash to anon via the client — front uses this RPC)
CREATE OR REPLACE FUNCTION public.get_gallery_by_slug(_slug text)
RETURNS TABLE (
  id uuid, slug text, name text, client_name text, event_date date,
  cover_url text, title_font text, title_color text, layout text,
  access_type text, has_password boolean, expires_at timestamptz,
  watermark_enabled boolean, watermark_text text, status text,
  price_tiers jsonb
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, slug, name, client_name, event_date, cover_url, title_font, title_color,
         layout, access_type, (password_hash IS NOT NULL) AS has_password, expires_at,
         watermark_enabled, watermark_text, status, price_tiers
  FROM public.gallery_galleries
  WHERE slug = _slug AND status = 'active'
    AND (expires_at IS NULL OR expires_at > now())
  LIMIT 1;
$$;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_galleries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_albums;
