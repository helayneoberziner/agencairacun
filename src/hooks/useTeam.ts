import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  display_order: number;
  is_active: boolean;
  social_links: any;
}

export function useTeam(opts: { onlyActive?: boolean } = {}) {
  return useQuery({
    queryKey: ['team_members', opts.onlyActive ? 'active' : 'all'],
    queryFn: async () => {
      let q = supabase.from('team_members').select('*').order('display_order', { ascending: true });
      if (opts.onlyActive) q = q.eq('is_active', true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as TeamMember[];
    },
  });
}

export function useTeamMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['team_members'] });

  const create = useMutation({
    mutationFn: async (m: Partial<TeamMember>) => {
      const { error } = await supabase.from('team_members').insert([{
        name: m.name || '',
        role: m.role || '',
        bio: m.bio || null,
        photo_url: m.photo_url || null,
        display_order: m.display_order ?? 0,
        is_active: m.is_active ?? true,
      }]);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async (m: TeamMember) => {
      const { error } = await supabase.from('team_members').update({
        name: m.name, role: m.role, bio: m.bio, photo_url: m.photo_url,
        display_order: m.display_order, is_active: m.is_active,
      }).eq('id', m.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { create, update, remove };
}