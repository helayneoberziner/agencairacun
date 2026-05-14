
CREATE TABLE public.segment_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  og_image_url TEXT,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.segment_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view segment pages"
ON public.segment_pages FOR SELECT
USING (true);

CREATE POLICY "Admins can manage segment pages"
ON public.segment_pages FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_segment_pages_updated_at
BEFORE UPDATE ON public.segment_pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.segment_pages (slug, name, display_order, seo_title, seo_description, content) VALUES
('imobiliario', 'Imobiliário', 1,
 'Marketing e Audiovisual para Imobiliário | Agência Racun',
 'Estratégias premium de marketing digital e produção audiovisual para construtoras, incorporadoras e imobiliárias. Vendas, valorização visual e tours cinematográficos.',
 jsonb_build_object(
   'hero', jsonb_build_object(
     'title', 'Transformamos empreendimentos em',
     'highlight', 'experiências de venda',
     'subtitle', 'Marketing estratégico e produção audiovisual cinematográfica para construtoras, incorporadoras e imobiliárias que querem vender mais e posicionar projetos como referência de mercado.',
     'ctaText', 'Quero vender meu empreendimento',
     'mediaType', 'image', 'mediaUrl', ''),
   'intro', jsonb_build_object(
     'title', 'Imóvel não se vende. Se apresenta.',
     'description', 'Cada empreendimento tem uma história única. Captamos a essência arquitetônica, o estilo de vida e o valor real do projeto em peças que conectam o público certo ao imóvel certo.'),
   'marketing', jsonb_build_object(
     'title', 'Marketing Digital',
     'subtitle', 'Estratégia de performance focada em captação qualificada de leads.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Target','title','Gestão de tráfego pago','description','Meta Ads e Google Ads segmentados por perfil de comprador.'),
       jsonb_build_object('icon','MapPin','title','Google Meu Negócio','description','Posicionamento local para construtoras e plantões de venda.'),
       jsonb_build_object('icon','Users','title','Captação de leads','description','Funis e landing pages para cada empreendimento.'),
       jsonb_build_object('icon','Repeat','title','Remarketing','description','Reconquista de visitantes interessados em estágio avançado.'),
       jsonb_build_object('icon','MessageSquare','title','Social Media','description','Conteúdo estratégico para Instagram, TikTok e YouTube.'),
       jsonb_build_object('icon','LineChart','title','Funil de vendas','description','Integração com CRM e acompanhamento de oportunidades.'))),
   'audiovisual', jsonb_build_object(
     'title', 'Audiovisual',
     'subtitle', 'Produção cinematográfica que valoriza cada metro quadrado.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Video','title','Vídeo Tour do imóvel','description','Visita virtual em alta resolução com direção de arte.'),
       jsonb_build_object('icon','Plane','title','Captação aérea com drone','description','Vistas externas e contexto urbano em 4K.'),
       jsonb_build_object('icon','Camera','title','Fotografia profissional','description','Imagens com iluminação cinematográfica para portfólio.'),
       jsonb_build_object('icon','Film','title','Vídeo institucional','description','Storytelling da construtora e do conceito do projeto.'),
       jsonb_build_object('icon','Sparkles','title','Reels e conteúdo curto','description','Cortes verticais para redes sociais e campanhas pagas.'),
       jsonb_build_object('icon','Building2','title','Cobertura de eventos','description','Lançamentos, feirões e showrooms registrados em vídeo e foto.'))),
   'portfolio', jsonb_build_object('title','Empreendimentos que assinamos','projectIds', jsonb_build_array()),
   'gallery', jsonb_build_object('title','Galeria','images', jsonb_build_array()),
   'videoFeatured', jsonb_build_object('title','Veja em movimento','youtubeId',''),
   'testimonialIds', jsonb_build_array(),
   'faq', jsonb_build_object('title','Dúvidas frequentes','items', jsonb_build_array(
     jsonb_build_object('question','Vocês atendem construtoras de qualquer porte?','answer','Sim. Atendemos desde lançamentos boutique até grandes incorporações com múltiplos empreendimentos simultâneos.'),
     jsonb_build_object('question','O contrato é por empreendimento ou mensal?','answer','Trabalhamos nos dois formatos. Projetos pontuais por empreendimento e contratos contínuos para incorporadoras com pipeline ativo.'))),
   'finalCta', jsonb_build_object('title','Pronto para vender mais imóveis?','subtitle','Vamos conversar sobre o seu próximo lançamento.','buttonText','Falar com a Racun','whatsappMessage','Olá! Gostaria de uma proposta para o segmento Imobiliário.'))),
('empresas', 'Empresas', 2,
 'Marketing e Branding para Empresas | Agência Racun',
 'Posicionamento, autoridade e branding cinematográfico para empresas que querem se destacar como referência no seu mercado.',
 jsonb_build_object(
   'hero', jsonb_build_object('title','Construímos','highlight','autoridade de marca','subtitle','Branding, posicionamento e comunicação institucional para empresas que querem ser percebidas como líderes no seu setor.','ctaText','Quero posicionar minha empresa','mediaType','image','mediaUrl',''),
   'intro', jsonb_build_object('title','Sua empresa precisa parecer do tamanho que ela é.','description','Empresas sérias precisam de comunicação à altura. Criamos identidade, narrativa e presença digital coerentes com a maturidade do seu negócio.'),
   'marketing', jsonb_build_object('title','Marketing Digital','subtitle','Estratégia para fortalecer marca e gerar negócios B2B.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Target','title','Gestão de tráfego','description','Campanhas focadas em geração de leads qualificados.'),
       jsonb_build_object('icon','Search','title','SEO institucional','description','Presença orgânica para termos estratégicos do seu setor.'),
       jsonb_build_object('icon','MessageSquare','title','Social Media','description','Conteúdo de autoridade no LinkedIn, Instagram e YouTube.'),
       jsonb_build_object('icon','FileText','title','Estratégia de conteúdo','description','Materiais ricos, blog e newsletter institucional.'),
       jsonb_build_object('icon','Globe','title','Landing pages','description','Páginas de conversão para serviços e produtos B2B.'),
       jsonb_build_object('icon','LineChart','title','Relatórios e dados','description','Acompanhamento mensal de KPIs e ROI.'))),
   'audiovisual', jsonb_build_object('title','Audiovisual','subtitle','Produções que comunicam credibilidade e visão.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Film','title','Vídeo institucional','description','Apresentação da empresa, propósito e diferenciais.'),
       jsonb_build_object('icon','Video','title','Vídeos de cases','description','Histórias reais de clientes que contam o impacto do seu trabalho.'),
       jsonb_build_object('icon','Camera','title','Fotografia corporativa','description','Banco de imagens autoral da equipe, sede e operação.'),
       jsonb_build_object('icon','Mic','title','Entrevistas e depoimentos','description','Captação profissional de lideranças e especialistas.'),
       jsonb_build_object('icon','Sparkles','title','Reels corporativos','description','Conteúdo curto para LinkedIn e Instagram.'),
       jsonb_build_object('icon','Plane','title','Imagens aéreas','description','Drone para fachadas, plantas industriais e operações.'))),
   'portfolio', jsonb_build_object('title','Empresas que confiaram na Racun','projectIds', jsonb_build_array()),
   'gallery', jsonb_build_object('title','Galeria','images', jsonb_build_array()),
   'videoFeatured', jsonb_build_object('title','Vídeo institucional em destaque','youtubeId',''),
   'testimonialIds', jsonb_build_array(),
   'faq', jsonb_build_object('title','Dúvidas frequentes','items', jsonb_build_array(
     jsonb_build_object('question','Trabalham com empresas de qualquer segmento?','answer','Atendemos empresas de tecnologia, indústria, serviços, varejo e setor financeiro, sempre com estratégia personalizada.'),
     jsonb_build_object('question','Vocês cuidam só de marketing ou também da parte audiovisual?','answer','Os dois. Operamos como uma agência integrada, do planejamento à produção.'))),
   'finalCta', jsonb_build_object('title','Vamos posicionar sua empresa?','subtitle','Conte sobre o seu projeto e vamos construir uma estratégia sob medida.','buttonText','Falar com a Racun','whatsappMessage','Olá! Quero falar sobre marketing e audiovisual para minha empresa.'))),
('restaurantes', 'Restaurantes', 3,
 'Marketing e Audiovisual para Restaurantes | Agência Racun',
 'Posicionamento gastronômico, vendas, delivery e branding visual para restaurantes que querem encher a casa todos os dias.',
 jsonb_build_object(
   'hero', jsonb_build_object('title','Comida boa também','highlight','se vende com imagem','subtitle','Estratégia de marketing e produção audiovisual gastronômica para restaurantes, bares, cafés e marcas de food service.','ctaText','Quero atrair mais clientes','mediaType','image','mediaUrl',''),
   'intro', jsonb_build_object('title','O cliente come com os olhos antes de sentar à mesa.','description','Cuidamos da imagem, do conteúdo e das campanhas para que seu restaurante ocupe o lugar de desejo na sua cidade.'),
   'marketing', jsonb_build_object('title','Marketing Digital','subtitle','Conversão local e fidelização de clientes.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Target','title','Tráfego pago local','description','Campanhas geolocalizadas para encher casa e delivery.'),
       jsonb_build_object('icon','MapPin','title','Google Meu Negócio','description','Avaliações, fotos e visibilidade nas buscas locais.'),
       jsonb_build_object('icon','MessageSquare','title','Social Media gastronômico','description','Conteúdo apetitoso para Instagram e TikTok.'),
       jsonb_build_object('icon','ShoppingBag','title','Estratégia de delivery','description','Campanhas para iFood, Rappi e delivery próprio.'),
       jsonb_build_object('icon','Globe','title','Cardápio digital','description','Páginas otimizadas para reservas e pedidos.'),
       jsonb_build_object('icon','Repeat','title','Fidelização','description','Estratégias de recorrência e clube de clientes.'))),
   'audiovisual', jsonb_build_object('title','Audiovisual','subtitle','Imagem gastronômica que dá água na boca.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Camera','title','Fotografia gastronômica','description','Pratos, ambiente e bebidas com direção de arte.'),
       jsonb_build_object('icon','Video','title','Vídeos de pratos','description','Captação macro e cortes hipnóticos para redes sociais.'),
       jsonb_build_object('icon','Sparkles','title','Reels e TikTok','description','Conteúdo curto, viralizável e com identidade.'),
       jsonb_build_object('icon','Film','title','Vídeo institucional','description','História do restaurante, chef e proposta da casa.'),
       jsonb_build_object('icon','Mic','title','Entrevistas com o chef','description','Storytelling humanizado da cozinha.'),
       jsonb_build_object('icon','Building2','title','Cobertura de eventos','description','Jantares, harmonizações e lançamentos de menu.'))),
   'portfolio', jsonb_build_object('title','Casas que assinamos','projectIds', jsonb_build_array()),
   'gallery', jsonb_build_object('title','Galeria','images', jsonb_build_array()),
   'videoFeatured', jsonb_build_object('title','Veja a casa em movimento','youtubeId',''),
   'testimonialIds', jsonb_build_array(),
   'faq', jsonb_build_object('title','Dúvidas frequentes','items', jsonb_build_array(
     jsonb_build_object('question','Atendem restaurantes de qualquer porte?','answer','Sim. De casas autorais a redes com múltiplas unidades.'),
     jsonb_build_object('question','Como funciona a sessão de fotos?','answer','Planejamos cardápio, montagem, iluminação e direção de arte. Tudo entregue editado e pronto para uso.'))),
   'finalCta', jsonb_build_object('title','Vamos lotar a sua casa?','subtitle','Solicite uma proposta personalizada para o seu restaurante.','buttonText','Falar com a Racun','whatsappMessage','Olá! Tenho um restaurante e quero falar sobre marketing e audiovisual.'))),
('eventos', 'Eventos', 4,
 'Marketing e Audiovisual para Eventos | Agência Racun',
 'Cobertura de eventos, aftermovies, fotos e campanhas promocionais com qualidade cinematográfica.',
 jsonb_build_object(
   'hero', jsonb_build_object('title','Eventos que viram','highlight','memória e marca','subtitle','Captação cinematográfica, aftermovies e campanhas para eventos corporativos, festivais, lançamentos e experiências.','ctaText','Quero registrar meu evento','mediaType','image','mediaUrl',''),
   'intro', jsonb_build_object('title','Cada evento tem um pico. Nós capturamos.','description','Da pré produção à entrega final, traduzimos a energia do momento em peças que vão viver muito além do dia do evento.'),
   'marketing', jsonb_build_object('title','Marketing Digital','subtitle','Pré evento, durante e pós evento com estratégia.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Target','title','Campanhas de venda de ingressos','description','Tráfego pago para Sympla, Eventbrite e plataformas próprias.'),
       jsonb_build_object('icon','Globe','title','Landing pages do evento','description','Páginas de alta conversão para inscrições e ingressos.'),
       jsonb_build_object('icon','MessageSquare','title','Social Media do evento','description','Aquecimento, contagem regressiva e conteúdo durante o rolê.'),
       jsonb_build_object('icon','Users','title','Captação de leads','description','Cadastro de público para próximas edições e remarketing.'),
       jsonb_build_object('icon','Repeat','title','Pós evento','description','Distribuição estratégica do conteúdo gerado.'),
       jsonb_build_object('icon','LineChart','title','Relatório de campanha','description','Métricas claras de alcance, ingressos e ROI.'))),
   'audiovisual', jsonb_build_object('title','Audiovisual','subtitle','Cobertura completa com olhar autoral.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Video','title','Aftermovie','description','Edição cinematográfica do que rolou no evento.'),
       jsonb_build_object('icon','Camera','title','Cobertura fotográfica','description','Fotojornalismo do evento entregue rápido para divulgação.'),
       jsonb_build_object('icon','Plane','title','Drone','description','Captação aérea da estrutura, público e ambientação.'),
       jsonb_build_object('icon','Sparkles','title','Reels diários','description','Cortes verticais para subir ainda durante o evento.'),
       jsonb_build_object('icon','Mic','title','Entrevistas','description','Depoimentos de público, artistas e patrocinadores.'),
       jsonb_build_object('icon','Film','title','Vídeo promocional','description','Material para venda de patrocínio nas próximas edições.'))),
   'portfolio', jsonb_build_object('title','Eventos que registramos','projectIds', jsonb_build_array()),
   'gallery', jsonb_build_object('title','Galeria','images', jsonb_build_array()),
   'videoFeatured', jsonb_build_object('title','Aftermovie em destaque','youtubeId',''),
   'testimonialIds', jsonb_build_array(),
   'faq', jsonb_build_object('title','Dúvidas frequentes','items', jsonb_build_array(
     jsonb_build_object('question','Em quanto tempo entregam o aftermovie?','answer','Entregamos uma versão teaser em até 48h e o aftermovie completo em até 10 dias úteis.'),
     jsonb_build_object('question','Trabalham com eventos fora da região?','answer','Sim. Atendemos em todo o Brasil mediante orçamento de logística.'))),
   'finalCta', jsonb_build_object('title','Vamos registrar o seu evento?','subtitle','Solicite uma proposta com cobertura completa.','buttonText','Falar com a Racun','whatsappMessage','Olá! Quero falar sobre cobertura de evento.'))),
('marcas', 'Marcas', 5,
 'Marketing e Audiovisual para Marcas | Agência Racun',
 'Branding, posicionamento e produção audiovisual para marcas que querem ser desejadas, lembradas e amadas.',
 jsonb_build_object(
   'hero', jsonb_build_object('title','Construímos','highlight','marcas inesquecíveis','subtitle','Branding, conteúdo e produção audiovisual para marcas que querem ocupar lugar real na cabeça e no coração do consumidor.','ctaText','Quero fortalecer minha marca','mediaType','image','mediaUrl',''),
   'intro', jsonb_build_object('title','Marca é percepção. E percepção se constrói.','description','Trabalhamos identidade, narrativa, conteúdo e mídia paga em uma única estratégia coerente, do conceito à campanha.'),
   'marketing', jsonb_build_object('title','Marketing Digital','subtitle','Branding e performance trabalhando juntos.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Target','title','Mídia paga','description','Meta Ads, Google Ads, TikTok Ads e YouTube Ads.'),
       jsonb_build_object('icon','MessageSquare','title','Social Media','description','Linha editorial coerente com a personalidade da marca.'),
       jsonb_build_object('icon','FileText','title','Estratégia de conteúdo','description','Conteúdo de topo, meio e fundo de funil.'),
       jsonb_build_object('icon','Globe','title','Landing pages','description','Páginas de conversão para campanhas e lançamentos.'),
       jsonb_build_object('icon','Users','title','Influência e parcerias','description','Curadoria e gestão de creators alinhados à marca.'),
       jsonb_build_object('icon','LineChart','title','Métricas de marca','description','Brand awareness, share of voice e performance.'))),
   'audiovisual', jsonb_build_object('title','Audiovisual','subtitle','Conteúdo cinematográfico que vira ativo de marca.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Film','title','Filme de marca','description','Vídeo manifesto que define o tom e o propósito.'),
       jsonb_build_object('icon','Video','title','Campanhas','description','Conteúdo para lançamentos sazonais e ativações.'),
       jsonb_build_object('icon','Camera','title','Fotografia de produto','description','Direção de arte e produção em estúdio ou locação.'),
       jsonb_build_object('icon','Sparkles','title','Reels e TikTok','description','Conteúdo nativo das plataformas com identidade.'),
       jsonb_build_object('icon','Mic','title','Storytelling','description','Roteiros que conectam a marca ao consumidor.'),
       jsonb_build_object('icon','Plane','title','Captação aérea','description','Imagens aéreas para reforçar escala e contexto.'))),
   'portfolio', jsonb_build_object('title','Marcas que acreditaram na Racun','projectIds', jsonb_build_array()),
   'gallery', jsonb_build_object('title','Galeria','images', jsonb_build_array()),
   'videoFeatured', jsonb_build_object('title','Filme de marca em destaque','youtubeId',''),
   'testimonialIds', jsonb_build_array(),
   'faq', jsonb_build_object('title','Dúvidas frequentes','items', jsonb_build_array(
     jsonb_build_object('question','Vocês fazem rebranding?','answer','Sim. Conduzimos do diagnóstico estratégico ao novo manual de marca.'),
     jsonb_build_object('question','Trabalham com marcas pequenas?','answer','Sim. O critério é maturidade e ambição, não tamanho.'))),
   'finalCta', jsonb_build_object('title','Vamos construir uma marca inesquecível?','subtitle','Conte sobre o seu projeto.','buttonText','Falar com a Racun','whatsappMessage','Olá! Quero falar sobre branding e audiovisual para minha marca.'))),
('politica', 'Política e Eleição', 6,
 'Marketing e Audiovisual para Política e Eleição | Agência Racun',
 'Posicionamento, comunicação estratégica e produção audiovisual para campanhas eleitorais e mandatos.',
 jsonb_build_object(
   'hero', jsonb_build_object('title','Comunicação política','highlight','que conecta e converte voto','subtitle','Estratégia, conteúdo e audiovisual cinematográfico para pré candidatos, candidatos, mandatos e partidos.','ctaText','Quero falar sobre minha campanha','mediaType','image','mediaUrl',''),
   'intro', jsonb_build_object('title','Política se ganha com narrativa.','description','Construímos posicionamento claro, comunicação coerente e presença digital estratégica em todas as fases da jornada eleitoral.'),
   'marketing', jsonb_build_object('title','Marketing Digital','subtitle','Estratégia data driven para pré campanha, campanha e mandato.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Target','title','Tráfego pago segmentado','description','Campanhas geolocalizadas e segmentadas por perfil de eleitor.'),
       jsonb_build_object('icon','MessageSquare','title','Social Media','description','Conteúdo diário coerente com o posicionamento.'),
       jsonb_build_object('icon','FileText','title','Estratégia de conteúdo','description','Pautas, narrativas e linha editorial da campanha.'),
       jsonb_build_object('icon','Users','title','Engajamento e mobilização','description','Gestão de comunidade, voluntários e bases.'),
       jsonb_build_object('icon','Repeat','title','Resposta rápida','description','Monitoramento e gestão de crise em tempo real.'),
       jsonb_build_object('icon','LineChart','title','Pesquisa e dados','description','Análise de cenário, percepção e indicadores eleitorais.'))),
   'audiovisual', jsonb_build_object('title','Audiovisual','subtitle','Conteúdo audiovisual para todas as fases da jornada.',
     'items', jsonb_build_array(
       jsonb_build_object('icon','Film','title','Vídeos de campanha','description','Programa eleitoral, manifestos e propostas.'),
       jsonb_build_object('icon','Video','title','Vídeos de rua','description','Captação de agendas, caminhadas e atos públicos.'),
       jsonb_build_object('icon','Sparkles','title','Reels e cortes','description','Conteúdo curto para distribuição diária.'),
       jsonb_build_object('icon','Mic','title','Entrevistas e depoimentos','description','Apoiadores, eleitores e lideranças.'),
       jsonb_build_object('icon','Camera','title','Fotografia oficial','description','Banco de imagens da campanha e do mandato.'),
       jsonb_build_object('icon','Plane','title','Drone','description','Cobertura aérea de atos, comícios e eventos.'))),
   'portfolio', jsonb_build_object('title','Campanhas que assinamos','projectIds', jsonb_build_array()),
   'gallery', jsonb_build_object('title','Galeria','images', jsonb_build_array()),
   'videoFeatured', jsonb_build_object('title','Vídeo de campanha em destaque','youtubeId',''),
   'testimonialIds', jsonb_build_array(),
   'faq', jsonb_build_object('title','Dúvidas frequentes','items', jsonb_build_array(
     jsonb_build_object('question','Atendem pré candidatos?','answer','Sim. Atuamos desde o pré lançamento, construção de imagem e posicionamento até o dia da eleição.'),
     jsonb_build_object('question','Trabalham com qualquer espectro político?','answer','Selecionamos projetos com base em alinhamento ético e viabilidade estratégica.'))),
   'finalCta', jsonb_build_object('title','Sua campanha precisa de estratégia.','subtitle','Vamos conversar com discrição e seriedade.','buttonText','Falar com a Racun','whatsappMessage','Olá! Quero falar sobre comunicação política e eleitoral.')));
