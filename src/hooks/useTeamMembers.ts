import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SocialLink {
  platform: string;
  url: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
  social_links: SocialLink[];
  display_order: number;
  is_active: boolean;
}

export function useTeamMembers(activeOnly = false) {
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['team-members', activeOnly],
    queryFn: async () => {
      let query = supabase.from('team_members').select('*').order('display_order', { ascending: true });
      if (activeOnly) query = query.eq('is_active', true);
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []).map((m: any) => ({
        ...m,
        social_links: Array.isArray(m.social_links) ? m.social_links : [],
      })) as TeamMember[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (member: Partial<TeamMember> & { id?: string }) => {
      const payload: any = { ...member, social_links: member.social_links ?? [] };
      if (member.id) {
        const { error } = await supabase.from('team_members').update(payload).eq('id', member.id);
        if (error) throw error;
      } else {
        delete payload.id;
        const { error } = await supabase.from('team_members').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team-members'] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team-members'] }),
  });

  return { members, isLoading, upsert: upsert.mutateAsync, remove: remove.mutateAsync };
}