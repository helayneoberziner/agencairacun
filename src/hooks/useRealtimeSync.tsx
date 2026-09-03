import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Global realtime bridge: listens to changes on cases, case_media and
 * segment_pages and invalidates the React Query caches that render them
 * on the public site. This keeps home, cases, portfolio galleries and
 * segment pages in sync without a page reload.
 */
export const useRealtimeSync = () => {
  const qc = useQueryClient();

  useEffect(() => {
    const invalidateCases = () => {
      qc.invalidateQueries({ queryKey: ['cases'] });
      qc.invalidateQueries({ queryKey: ['case'] });
      qc.invalidateQueries({ queryKey: ['segment-gallery'] });
      qc.invalidateQueries({ queryKey: ['segment-clients'] });
      qc.invalidateQueries({ queryKey: ['home-audiovisual-projects'] });
    };
    const invalidateSegments = () => {
      qc.invalidateQueries({ queryKey: ['segment-pages'] });
      qc.invalidateQueries({ queryKey: ['segment-page'] });
      qc.invalidateQueries({ queryKey: ['segment-gallery'] });
    };

    const channel = supabase
      .channel('public:realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cases' }, invalidateCases)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'case_media' }, invalidateCases)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'segment_pages' }, invalidateSegments)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_content' }, () => {
        qc.invalidateQueries({ queryKey: ['site-settings'] });
        qc.invalidateQueries({ queryKey: ['home-content'] });
        qc.invalidateQueries({ queryKey: ['sobre-content'] });
        qc.invalidateQueries({ queryKey: ['produtora-content'] });
        qc.invalidateQueries({ queryKey: ['marketing-content'] });
        qc.invalidateQueries({ queryKey: ['restaurantes-content'] });
        qc.invalidateQueries({ queryKey: ['client-logos'] });
        qc.invalidateQueries({ queryKey: ['testimonials'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        qc.invalidateQueries({ queryKey: ['home-audiovisual-projects'] });
        qc.invalidateQueries({ queryKey: ['portfolio-projects'] });
        qc.invalidateQueries({ queryKey: ['segment-gallery'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [qc]);
};

const RealtimeSyncProvider = ({ children }: { children: React.ReactNode }) => {
  useRealtimeSync();
  return <>{children}</>;
};

export default RealtimeSyncProvider;