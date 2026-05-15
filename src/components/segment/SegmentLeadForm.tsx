import { useState } from 'react';
import { Send, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useContactForm } from '@/hooks/useContactForm';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface Props {
  segmentName: string;
  title?: string;
  subtitle?: string;
}

const services = [
  'Marketing Digital',
  'Produtora Audiovisual',
  'Estratégia de Conteúdo',
  'Branding e Identidade',
  'Tudo combinado',
];

const SegmentLeadForm = ({ segmentName, title, subtitle }: Props) => {
  const { settings } = useSiteSettings();
  const [data, setData] = useState({
    name: '', company: '', whatsapp: '', email: '', service: '', message: '',
  });
  const { submit, isSubmitting, isSubmitted, errors } = useContactForm({
    onSuccess: () => setData({ name: '', company: '', whatsapp: '', email: '', service: '', message: '' }),
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({
      name: data.name,
      email: data.email,
      phone: data.whatsapp,
      company: data.company,
      service: data.service,
      segment: segmentName,
      message: data.message,
    });
  };

  const waMessage = encodeURIComponent(
    `Olá! Sou ${data.name || '[nome]'} da ${data.company || 'minha empresa'}. Tenho interesse em ${data.service || 'conversar'} para o segmento ${segmentName}. ${data.message}`
  );
  const waLink = `https://wa.me/${settings.whatsapp}?text=${waMessage}`;

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[140px]" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-14 items-start">
          <div className="lg:col-span-2">
            <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-[0.25em] mb-4 block">
              Vamos conversar
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
              {title || (
                <>Pronto para crescer no <span className="text-gradient-neon italic">{segmentName}?</span></>
              )}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8">
              {subtitle || 'Conte um pouco sobre seu projeto. Nosso time entra em contato com uma proposta sob medida para o seu negócio.'}
            </p>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <div>
                <p className="font-medium">Prefere o WhatsApp?</p>
                <p className="text-sm opacity-80">{settings.phone}</p>
              </div>
            </a>
          </div>

          <div className="lg:col-span-3 glass-card p-6 md:p-10 relative">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-16 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 neon-glow">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-2xl md:text-3xl mb-3">Recebido com sucesso!</h3>
                <p className="text-muted-foreground max-w-md">
                  Seu contato chegou no nosso time. Em breve um especialista da Racun fala com você.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground">Nome *</label>
                    <input
                      name="name" value={data.name} onChange={onChange} required
                      placeholder="Seu nome completo"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 hover:border-white/20 transition-all"
                    />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground">Empresa</label>
                    <input
                      name="company" value={data.company} onChange={onChange}
                      placeholder="Nome da sua empresa"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 hover:border-white/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground">WhatsApp</label>
                    <input
                      name="whatsapp" value={data.whatsapp} onChange={onChange} type="tel"
                      placeholder="(00) 00000 0000"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 hover:border-white/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground">E-mail *</label>
                    <input
                      name="email" value={data.email} onChange={onChange} type="email" required
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 hover:border-white/20 transition-all"
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground">Segmento</label>
                    <input
                      value={segmentName} disabled
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-primary/30 text-primary cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground">Serviço de interesse *</label>
                    <select
                      name="service" value={data.service} onChange={onChange} required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 hover:border-white/20 transition-all"
                    >
                      <option value="" className="bg-background">Selecione</option>
                      {services.map(s => <option key={s} value={s} className="bg-background">{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground">Mensagem *</label>
                  <textarea
                    name="message" value={data.message} onChange={onChange} required rows={4}
                    placeholder="Conte um pouco sobre seu projeto, momento e objetivos..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/40 hover:border-white/20 transition-all resize-none"
                  />
                  {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit" disabled={isSubmitting}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Enviar mensagem</>
                    )}
                  </button>
                  <a
                    href={waLink} target="_blank" rel="noopener noreferrer"
                    className="btn-outline flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SegmentLeadForm;