import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type SuggestionCategory = 'marketing' | 'audiovisual' | 'complete';

export interface ProposalSuggestion {
  id: string;
  category: SuggestionCategory;
  text: string;
  usage_count: number;
}

export function useProposalSuggestions(category: SuggestionCategory) {
  const queryClient = useQueryClient();

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['proposal-suggestions', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('proposal_suggestions')
        .select('*')
        .eq('category', category)
        .order('usage_count', { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProposalSuggestion[];
    },
  });

  const addSuggestion = useMutation({
    mutationFn: async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      await supabase
        .from('proposal_suggestions')
        .insert({ category, text: trimmed })
        .select()
        .maybeSingle();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['proposal-suggestions', category] }),
  });

  return { suggestions, isLoading, addSuggestion: addSuggestion.mutateAsync };
}