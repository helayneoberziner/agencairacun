import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HomeContent {
  hero: {
    badge: string;
    headline1: string;
    headlineHighlight: string;
    headline2: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    pillars: { title: string; description: string }[];
    backgroundImage: string;
  };
  services: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    items: { title: string; description: string; features: string[] }[];
    cta: string;
  };
  socialProof: {
    badge: string;
    title: string;
    titleHighlight: string;
    proofs: string[];
    cta: string;
  };
  produtoraTeaser: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    tags: string[];
    showreelLabel: string;
    cta: string;
    ctaLink: string;
    image: string;
  };
  restaurantesTeaser: {
    badge: string;
    title: string;
    titleHighlight: string;
    description: string;
    features: { title: string; description: string }[];
    cta: string;
    floatingStat: string;
    floatingLabel: string;
    badgeText: string;
    image: string;
  };
  casesPreview: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    cta: string;
  };
  process: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    steps: { number: string; title: string; description: string }[];
  };
  contact: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
  };
}

const defaultContent: HomeContent = {
  hero: {
    badge: 'Marketing • Produtora',
    headline1: 'Crescimento real com',
    headlineHighlight: 'estratégia, conteúdo',
    headline2: 'e performance',
    subtitle: 'Somos uma agência de marketing digital e produtora audiovisual. Transformamos atenção em vendas.',
    ctaPrimary: 'Solicitar proposta',
    ctaSecondary: 'Ver cases',
    pillars: [
      { title: 'Estratégia e posicionamento', description: 'Posicionamos sua marca para dominar o mercado' },
      { title: 'Conteúdo que conecta', description: 'Criamos narrativas que engajam e convertem' },
      { title: 'Tráfego pago que escala', description: 'Campanhas otimizadas para máximo retorno' },
    ],
    backgroundImage: '',
  },
  services: {
    badge: 'O que fazemos',
    title: 'Marketing de',
    titleHighlight: 'alta performance',
    subtitle: 'Combinamos estratégia, criatividade e dados para entregar resultados reais. Cada ação é pensada para gerar crescimento.',
    items: [
      { title: 'Tráfego Pago', description: 'Campanhas em Meta, Google e TikTok com foco em leads e vendas. Otimização contínua para máximo ROI.', features: ['Meta Ads', 'Google Ads', 'TikTok Ads'] },
      { title: 'Criação de Conteúdo', description: 'Reels, fotos, vídeos curtos e roteiros. Conteúdo estratégico que conecta e engaja seu público.', features: ['Reels e Stories', 'Vídeos curtos', 'Roteiros'] },
      { title: 'Funil e Campanha', description: 'Landing pages, criativos e testes A/B. Estruturas de funil que convertem visitantes em clientes.', features: ['Landing Pages', 'Criativos', 'Testes A/B'] },
      { title: 'Branding e Social', description: 'Linha editorial, calendário de conteúdo e identidade visual. Posicionamento que diferencia.', features: ['Linha Editorial', 'Calendário', 'Identidade'] },
    ],
    cta: 'Saiba mais sobre marketing',
  },
  socialProof: {
    badge: 'Por que escolher a Racun',
    title: 'Resultados que você pode',
    titleHighlight: 'acompanhar',
    proofs: [
      'Resultados acompanhados semanalmente',
      'Criativos feitos para performance',
      'Rotina de otimização e testes',
      'Relatórios transparentes e claros',
    ],
    cta: 'Quero um diagnóstico',
  },
  produtoraTeaser: {
    badge: 'Produtora Audiovisual',
    title: 'Filmes, campanhas e histórias com',
    titleHighlight: 'estética de cinema',
    description: 'Produzimos conteúdo audiovisual premium para marcas que querem se destacar. De filmes institucionais a reels criativos, cada projeto é tratado com a qualidade e atenção de uma produção cinematográfica.',
    tags: ['Filmes Institucionais', 'Campanhas Publicitárias', 'Reels Premium', 'Eventos'],
    showreelLabel: 'Showreel Racun',
    cta: 'Ver Produtora',
    ctaLink: 'https://racunfilmes.lovable.app',
    image: '',
  },
  restaurantesTeaser: {
    badge: 'Marketing para Restaurantes',
    title: 'Lote a casa e aumente os',
    titleHighlight: 'pedidos delivery',
    description: 'Marketing especializado para restaurantes com foco em criação de conteúdo que dá fome e tráfego pago que traz clientes para a mesa e para o app.',
    features: [
      { title: 'Conteúdo semanal e cobertura', description: 'Fotos e vídeos que dão água na boca' },
      { title: 'Anúncios para promoções', description: 'Campanhas para lotar a casa' },
      { title: 'Campanhas sazonais', description: 'Cardápio, ofertas e datas especiais' },
    ],
    cta: 'Quero vender mais',
    floatingStat: '+180%',
    floatingLabel: 'Engajamento',
    badgeText: '📍 Alcance local + Delivery',
    image: '',
  },
  casesPreview: {
    badge: 'Cases',
    title: 'Projetos que',
    titleHighlight: 'entregam resultados',
    subtitle: 'Conheça alguns dos nossos trabalhos e veja como ajudamos marcas a crescer.',
    cta: 'Ver todos os cases',
  },
  process: {
    badge: 'Nosso processo',
    title: 'Simples, direto e',
    titleHighlight: 'eficiente',
    subtitle: 'Um processo claro para transformar sua marca em uma máquina de resultados.',
    steps: [
      { number: '01', title: 'Diagnóstico', description: 'Entendemos seu negócio, público, concorrência e objetivos para criar uma estratégia personalizada.' },
      { number: '02', title: 'Estratégia', description: 'Desenvolvemos o plano de ação com canais, conteúdos e campanhas alinhados às suas metas.' },
      { number: '03', title: 'Execução', description: 'Colocamos a mão na massa com criação, produção e gestão de campanhas de alta qualidade.' },
      { number: '04', title: 'Otimização e escala', description: 'Analisamos os dados, otimizamos o que funciona e escalamos os resultados.' },
    ],
  },
  contact: {
    badge: 'Contato',
    title: 'Vamos conversar sobre o',
    titleHighlight: 'seu projeto?',
    subtitle: 'Preencha o formulário ou fale diretamente conosco pelo WhatsApp. Respondemos em até 24 horas úteis.',
  },
};

export function useHomeContent() {
  const queryClient = useQueryClient();

  const { data: content = defaultContent, isLoading } = useQuery({
    queryKey: ['home-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'home_content')
        .maybeSingle();

      if (error) throw error;
      if (!data) return defaultContent;

      const saved = data.content as unknown as Partial<HomeContent>;
      return {
        hero: { ...defaultContent.hero, ...saved.hero },
        services: { ...defaultContent.services, ...saved.services },
        socialProof: { ...defaultContent.socialProof, ...saved.socialProof },
        produtoraTeaser: { ...defaultContent.produtoraTeaser, ...saved.produtoraTeaser },
        restaurantesTeaser: { ...defaultContent.restaurantesTeaser, ...saved.restaurantesTeaser },
        casesPreview: { ...defaultContent.casesPreview, ...saved.casesPreview },
        process: { ...defaultContent.process, ...saved.process },
        contact: { ...defaultContent.contact, ...saved.contact },
      };
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: async (newContent: HomeContent) => {
      const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('section_key', 'home_content')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_content')
          .update({ content: JSON.parse(JSON.stringify(newContent)), updated_at: new Date().toISOString() })
          .eq('section_key', 'home_content');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_content')
          .insert({ section_key: 'home_content', content: JSON.parse(JSON.stringify(newContent)) });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-content'] });
    },
  });

  return { content, isLoading, updateContent: updateMutation.mutateAsync, isUpdating: updateMutation.isPending };
}
