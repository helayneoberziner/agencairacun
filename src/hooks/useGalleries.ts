import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useGalleries() {
  return useQuery({
    queryKey: ['galleries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_galleries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGallery(id: string | undefined) {
  return useQuery({
    queryKey: ['gallery', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_galleries')
        .select('*')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useGalleryItems(galleryId: string | undefined) {
  return useQuery({
    queryKey: ['gallery-items', galleryId],
    enabled: !!galleryId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('gallery_id', galleryId!)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGalleryAlbums(galleryId: string | undefined) {
  return useQuery({
    queryKey: ['gallery-albums', galleryId],
    enabled: !!galleryId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .eq('gallery_id', galleryId!)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export interface GalleryStats {
  visits: number;
  favorites: number;
  totalSold: number;
  downloads: number;
  orders: number;
  topFavorites: { id: string; preview_url: string | null; favorite_count: number }[];
}

export function useGalleryStats(galleryId: string | undefined) {
  return useQuery<GalleryStats>({
    queryKey: ['gallery-stats', galleryId],
    enabled: !!galleryId,
    queryFn: async () => {
      const [visits, favorites, downloads, orders, gallery, top] = await Promise.all([
        supabase.from('gallery_visits').select('*', { count: 'exact', head: true }).eq('gallery_id', galleryId!),
        supabase.from('gallery_favorites').select('*', { count: 'exact', head: true }).eq('gallery_id', galleryId!),
        supabase.from('gallery_downloads').select('*', { count: 'exact', head: true }).eq('gallery_id', galleryId!),
        supabase.from('gallery_orders').select('total, status').eq('gallery_id', galleryId!),
        supabase.from('gallery_galleries').select('total_sold, visit_count').eq('id', galleryId!).maybeSingle(),
        supabase.from('gallery_items').select('id, preview_url, favorite_count').eq('gallery_id', galleryId!)
          .order('favorite_count', { ascending: false }).limit(5),
      ]);
      const paid = (orders.data ?? []).filter((o: any) => o.status === 'paid');
      return {
        visits: visits.count ?? (gallery.data as any)?.visit_count ?? 0,
        favorites: favorites.count ?? 0,
        downloads: downloads.count ?? 0,
        orders: (orders.data ?? []).length,
        totalSold: paid.reduce((s: number, o: any) => s + Number(o.total ?? 0), 0) || Number((gallery.data as any)?.total_sold ?? 0),
        topFavorites: ((top.data ?? []) as any[]).filter(i => (i.favorite_count ?? 0) > 0),
      };
    },
  });
}

/**
 * Live refresh of gallery stats (visits, favorites, orders).
 * These tables hold client PII (emails, IP addresses) and are no longer part of
 * the realtime publication, so the admin panel polls instead of subscribing.
 */
export function useGalleryStatsRealtime(galleryId: string | undefined) {
  const qc = useQueryClient();
  useEffect(() => {
    if (!galleryId) return;
    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ['gallery-stats', galleryId] });
      qc.invalidateQueries({ queryKey: ['gallery-items', galleryId] });
    };
    const timer = window.setInterval(invalidate, 15000);
    return () => window.clearInterval(timer);
  }, [galleryId, qc]);
}
