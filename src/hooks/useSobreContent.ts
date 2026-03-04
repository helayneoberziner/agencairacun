import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SobreContent {
  hero: {
    title: string;
    titleHighlight: string;
    subtitle: string;
  };
  story: {
    label: string;
    title: string;
    titleHighlight: string;
    paragraphs: string[];
    stats: { value: string; label: string }[];
  };
  values: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  cta: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaText: string;
  };
}

export const defaultSobreContent: SobreContent = {
  hero: {
    title: 'Sobre a',
    titleHighlight: 'Racun',
    subtitle: 'Somos uma agência de marketing digital, produtora audiovisual e especialistas em restaurantes. Unimos estratégia, criatividade e performance para transformar marcas em experiências memoráveis.',
  },
  story: {
    label: 'Nossa história',
    title: 'Nascemos da vontade de fazer',
    titleHighlight: 'diferente',
    paragraphs: [
      'A Racun nasceu da união de profissionais apaixonados por marketing, audiovisual e resultados. Cansados de ver empresas investindo em ações que não geram retorno, decidimos criar uma agência que entrega o que promete.',
      'Hoje, atendemos empresas de diversos segmentos com uma proposta clara: marketing que funciona, conteúdo que conecta e campanhas que convertem.',
      'Nossa especialização em restaurantes surgiu da paixão pelo setor e da percepção de que faltava um parceiro que entendesse as particularidades do negócio de alimentação.',
    ],
    stats: [
      { value: '50+', label: 'Clientes atendidos' },
      { value: '3', label: 'Frentes de atuação' },
      { value: '100%', label: 'Foco em resultados' },
      { value: '∞', label: 'Ideias por projeto' },
    ],
  },
  values: {
    title: 'Nossos',
    titleHighlight: 'valores',
    subtitle: 'Os princípios que guiam cada projeto e cada decisão.',
    items: [
      { title: 'Resultados primeiro', description: 'Cada ação é pensada para gerar impacto real no seu negócio. Métricas e dados guiam nossas decisões.' },
      { title: 'Parceria de verdade', description: 'Não somos só fornecedores, somos parte do seu time. Seu sucesso é o nosso sucesso.' },
      { title: 'Execução ágil', description: 'Processos enxutos e comunicação direta para entregar com qualidade e velocidade.' },
      { title: 'Time especializado', description: 'Cada área com profissionais dedicados: estratégia, conteúdo, tráfego e produção.' },
    ],
  },
  cta: {
    title: 'Vamos trabalhar',
    titleHighlight: 'juntos?',
    subtitle: 'Conte sobre seu projeto e descubra como podemos ajudar sua marca a crescer.',
    ctaText: 'Entrar em contato',
  },
};

const SECTION_KEY = 'sobre_content';

export const useSobreContent = () => {
  const queryClient = useQueryClient();

  const { data: content = defaultSobreContent, isLoading } = useQuery({
    queryKey: ['sobre-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', SECTION_KEY)
        .maybeSingle();
      if (error) throw error;
      if (!data) return defaultSobreContent;
      return { ...defaultSobreContent, ...(data.content as unknown as Partial<SobreContent>) };
    },
  });

  const { mutateAsync: updateContent, isPending: isUpdating } = useMutation({
    mutationFn: async (newContent: SobreContent) => {
      const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('section_key', SECTION_KEY)
        .maybeSingle();

      const payload = JSON.parse(JSON.stringify(newContent));
      if (existing) {
        const { error } = await supabase.from('site_content').update({ content: payload }).eq('section_key', SECTION_KEY);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_content').insert([{ section_key: SECTION_KEY, content: payload }]);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sobre-content'] }),
  });

  return { content, isLoading, updateContent, isUpdating };
};
