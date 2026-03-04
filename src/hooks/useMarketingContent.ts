import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MarketingContent {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaText: string;
    secondaryCtaText: string;
  };
  services: {
    sectionTitle: string;
    sectionTitleHighlight: string;
    sectionSubtitle: string;
    items: { title: string; description: string; features: string[] }[];
  };
  results: {
    label: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    items: string[];
    dashboardTitle: string;
    dashboardSubtitle: string;
  };
  modalities: {
    sectionTitle: string;
    sectionTitleHighlight: string;
    sectionSubtitle: string;
    items: { title: string; description: string }[];
  };
  faqs: {
    sectionTitle: string;
    sectionTitleHighlight: string;
    items: { question: string; answer: string }[];
  };
  cta: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaText: string;
  };
}

export const defaultMarketingContent: MarketingContent = {
  hero: {
    badge: 'Marketing Digital',
    title: 'Marketing de performance para',
    titleHighlight: 'escalar seu negócio',
    subtitle: 'Estratégia, conteúdo e tráfego pago integrados para transformar sua marca em uma máquina de aquisição e vendas.',
    ctaText: 'Solicitar proposta',
    secondaryCtaText: 'Ver serviços',
  },
  services: {
    sectionTitle: 'Serviços de',
    sectionTitleHighlight: 'marketing digital',
    sectionSubtitle: 'Soluções completas para cada etapa da sua estratégia digital.',
    items: [
      { title: 'Tráfego Pago', description: 'Gestão completa de campanhas em Meta Ads, Google Ads e TikTok Ads. Foco em leads qualificados e vendas com otimização constante.', features: ['Meta Ads (Facebook e Instagram)', 'Google Ads (Search e Display)', 'TikTok Ads', 'Remarketing inteligente'] },
      { title: 'Estratégia Digital', description: 'Diagnóstico completo, definição de persona, posicionamento de marca e planejamento de canais.', features: ['Análise de mercado', 'Definição de persona', 'Posicionamento', 'Planejamento de canais'] },
      { title: 'Criação de Conteúdo', description: 'Produção de conteúdo para redes sociais: reels, fotos, vídeos curtos, roteiros e legendas.', features: ['Reels e Stories', 'Sessões de fotos', 'Vídeos curtos', 'Roteiros e copies'] },
      { title: 'Funil e Conversão', description: 'Criação de landing pages, criativos, testes A/B e otimização de funis para maximizar conversões.', features: ['Landing pages', 'Criativos para ads', 'Testes A/B', 'Otimização de funil'] },
    ],
  },
  results: {
    label: 'Transparência',
    title: 'Como medimos',
    titleHighlight: 'resultados',
    subtitle: 'Você acompanha tudo em tempo real. Sem surpresas, sem achismos. Dados claros para decisões inteligentes.',
    items: [
      'Painel de acompanhamento em tempo real',
      'Relatórios semanais e mensais',
      'Reuniões de alinhamento periódicas',
      'Otimização contínua baseada em dados',
      'Transparência total nos resultados',
    ],
    dashboardTitle: 'Dashboard em tempo real',
    dashboardSubtitle: 'Acesso 24/7 aos seus dados',
  },
  modalities: {
    sectionTitle: 'Formatos de',
    sectionTitleHighlight: 'trabalho',
    sectionSubtitle: 'Escolha o modelo que melhor se adapta às suas necessidades.',
    items: [
      { title: 'Gestão de Tráfego', description: 'Foco exclusivo em campanhas pagas com otimização constante e relatórios detalhados.' },
      { title: 'Conteúdo Mensal', description: 'Produção recorrente de conteúdo para redes sociais com planejamento editorial.' },
      { title: 'Combo Conteúdo + Tráfego', description: 'A solução completa: conteúdo estratégico integrado com campanhas de performance.' },
    ],
  },
  faqs: {
    sectionTitle: 'Perguntas',
    sectionTitleHighlight: 'frequentes',
    items: [
      { question: 'Quanto tempo leva para ver resultados?', answer: 'Depende do seu mercado e objetivo, mas geralmente começamos a ver resultados consistentes entre 30 e 90 dias. Campanhas de tráfego pago podem trazer resultados mais rápidos, enquanto estratégias de conteúdo orgânico levam mais tempo para maturar.' },
      { question: 'Vocês trabalham com qualquer segmento?', answer: 'Trabalhamos com diversos segmentos, mas temos expertise especial em e-commerce, serviços, restaurantes e empresas B2B. Analisamos cada caso para garantir que podemos entregar resultados.' },
      { question: 'Qual o investimento mínimo em mídia?', answer: 'Recomendamos um investimento mínimo em mídia que varia conforme o objetivo e mercado. Isso é definido durante o diagnóstico inicial para garantir que o investimento seja adequado aos seus objetivos.' },
      { question: 'Como funciona o acompanhamento?', answer: 'Você terá acesso a um painel em tempo real, relatórios semanais, reuniões de alinhamento e um canal direto de comunicação com nosso time. Transparência é fundamental.' },
    ],
  },
  cta: {
    title: 'Pronto para',
    titleHighlight: 'escalar?',
    subtitle: 'Vamos conversar sobre como podemos ajudar seu negócio a crescer com estratégias de marketing de alta performance.',
    ctaText: 'Solicitar proposta',
  },
};

const SECTION_KEY = 'marketing_content';

export const useMarketingContent = () => {
  const queryClient = useQueryClient();

  const { data: content = defaultMarketingContent, isLoading } = useQuery({
    queryKey: ['marketing-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', SECTION_KEY)
        .maybeSingle();
      if (error) throw error;
      if (!data) return defaultMarketingContent;
      return { ...defaultMarketingContent, ...(data.content as unknown as Partial<MarketingContent>) };
    },
  });

  const { mutateAsync: updateContent, isPending: isUpdating } = useMutation({
    mutationFn: async (newContent: MarketingContent) => {
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketing-content'] }),
  });

  return { content, isLoading, updateContent, isUpdating };
};
