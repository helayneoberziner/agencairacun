import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Check, MessageCircle, HelpCircle, Printer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const defaultConfig = {
  clientName: '[Nome do Cliente]',
  validityDays: 7,
  whatsappNumber: '5547999999999',
  marketing: {
    price: '[VALOR]',
    includes: [
      'Gestão de redes sociais (Instagram + Facebook)',
      'Planejamento de conteúdo mensal',
      'Criação de artes e copies',
      'Relatório mensal de performance',
      'Gestão de tráfego pago',
    ],
    differentials: [
      'Estratégia personalizada baseada em dados reais da sua marca.',
      'Equipe dedicada com reuniões quinzenais de alinhamento.',
      'Acesso a relatórios transparentes e métricas reais.',
    ],
    bonus: ['Consultoria inicial de posicionamento', 'Análise de concorrência'],
  },
  audiovisual: {
    price: '[VALOR]',
    includes: [
      'Roteiro criativo alinhado ao briefing',
      'Captação em alta resolução (4K)',
      'Direção de arte e fotografia',
      'Edição e pós-produção profissional',
      'Entrega otimizada para cada plataforma',
    ],
    differentials: [
      'Produção cinematográfica com equipamento profissional.',
      'Processo criativo colaborativo do briefing à entrega.',
      'Revisões ilimitadas até a aprovação final.',
    ],
    bonus: ['Making of do projeto incluso', 'Versão vertical para stories/reels'],
  },
  complete: {
    price: '[VALOR]',
    includes: [
      'Tudo do plano Marketing Digital',
      'Tudo do plano Audiovisual',
      'Estratégia integrada de conteúdo',
      'Planejamento de campanhas completas',
      'Suporte prioritário',
    ],
    differentials: [
      'Solução 360° que une marketing e audiovisual.',
      'Um único ponto de contato para toda a comunicação.',
      'Resultados mensuráveis com relatórios integrados.',
    ],
    bonus: ['Sessão fotográfica trimestral', 'Vídeo institucional incluso no primeiro mês'],
  },
};

type TabKey = 'marketing' | 'audiovisual' | 'complete';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'marketing', label: 'Marketing Digital' },
  { key: 'audiovisual', label: 'Audiovisual' },
  { key: 'complete', label: 'Solução Completa' },
];

const Proposta = () => {
  const { slug } = useParams<{ slug?: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('marketing');
  const [config, setConfig] = useState(defaultConfig);
  const [loading, setLoading] = useState(!!slug);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchProposal = async () => {
      const { data, error } = await supabase
        .rpc('get_proposal_by_slug', { _slug: slug });

      const row = Array.isArray(data) ? data[0] : data;
      if (error || !row) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setConfig({
        clientName: row.client_name,
        validityDays: row.validity_days,
        whatsappNumber: row.whatsapp_number,
        marketing: {
          price: row.marketing_price,
          includes: row.marketing_includes,
          differentials: row.marketing_differentials,
          bonus: row.marketing_bonus,
        },
        audiovisual: {
          price: row.audiovisual_price,
          includes: row.audiovisual_includes,
          differentials: row.audiovisual_differentials,
          bonus: row.audiovisual_bonus,
        },
        complete: {
          price: row.complete_price,
          includes: row.complete_includes,
          differentials: row.complete_differentials,
          bonus: row.complete_bonus,
        },
      });
      setLoading(false);
    };

    fetchProposal();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">Carregando proposta...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Proposta não encontrada</p>
          <p className="text-gray-500">Verifique o link e tente novamente.</p>
        </div>
      </div>
    );
  }

  const data = config[activeTab];
  const whatsAccept = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de aceitar a proposta de ${tabs.find(t => t.key === activeTab)?.label}.`)}`;
  const whatsQuestion = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Olá! Tenho dúvidas sobre a proposta enviada.')}`;
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + config.validityDays);

  return (
    <div className="min-h-screen bg-white text-gray-900 print:bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 print:border-gray-300">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-tight" style={{ color: '#e600ac' }}>RACUN</span>
          <div className="text-right text-sm text-gray-500">
            <p>{new Date().toLocaleDateString('pt-BR')}</p>
            <p>Válida por {config.validityDays} dias</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6 pt-8 print:hidden">
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {tabs.find(t => t.key === activeTab)?.label}
        </h1>
        <p className="text-gray-500 mb-10">
          Preparada para <strong className="text-gray-900">{config.clientName}</strong>
        </p>

        {/* Incluso */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4">O que está incluso</h3>
          <ul className="space-y-3">
            {data.includes.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Diferenciais */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4">Diferenciais</h3>
          <div className="space-y-4">
            {data.differentials.map((d, i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-gray-700 pt-1">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Investimento */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 mb-10 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Investimento</p>
          <p className="text-4xl md:text-5xl font-bold" style={{ color: '#e600ac' }}>
            R$ {data.price}
          </p>
          <p className="text-sm text-gray-400 mt-3">
            Válida até {validUntil.toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Bônus */}
        {data.bonus.length > 0 && (
          <div className="mb-10 bg-pink-50 border border-pink-100 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-pink-700">Bônus inclusos</h3>
            <ul className="space-y-2">
              {data.bonus.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-pink-500" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <a
            href={whatsAccept}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-semibold transition-colors"
            style={{ backgroundColor: '#e600ac' }}
          >
            <MessageCircle className="w-5 h-5" />
            Aceitar pelo WhatsApp
          </a>
          <a
            href={whatsQuestion}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Tenho dúvidas
          </a>
        </div>

        {/* Salvar PDF */}
        <div className="mt-6 text-center print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Salvar como PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Proposta;
