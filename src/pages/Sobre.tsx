import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useEffect, useState } from 'react';
import { ArrowRight, Target, Heart, Zap, Users, Send, MessageCircle, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useSobreContent } from '@/hooks/useSobreContent';
import GlobalCTA from '@/components/cta/GlobalCTA';
import TeamSection from '@/components/TeamSection';
import SEO from '@/components/seo/SEO';
import { useContactForm } from '@/hooks/useContactForm';
import { useSiteSettings as useSiteSettingsForContact } from '@/hooks/useSiteSettings';

const iconMap = [Target, Heart, Zap, Users];

const Sobre = () => {
  const { content, isLoading } = useSobreContent();
  const { settings } = useSiteSettingsForContact();
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', company: '', service: '', message: '' });
  const { submit, isSubmitting, isSubmitted, errors } = useContactForm({
    onSuccess: () => setFormData({ name: '', email: '', whatsapp: '', company: '', service: '', message: '' }),
  });

  useEffect(() => {
    if (window.location.hash === '#contato') {
      setTimeout(() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({
      name: formData.name, email: formData.email, phone: formData.whatsapp,
      company: formData.company, service: formData.service, message: formData.message,
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div className="min-h-screen bg-background"><Header /><div className="flex items-center justify-center h-96"><p className="text-muted-foreground">Carregando...</p></div><Footer /></div>;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Sobre a Racun · Agência e Produtora Audiovisual"
        description="Quem somos: agência de marketing e produtora audiovisual movida por estratégia, criatividade e resultado."
        path="/sobre"
      />
      <Header />
      
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-30" />
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                {content.hero.title} <span className="text-gradient-neon">{content.hero.titleHighlight}</span>
              </h1>
              <p className="text-xl text-muted-foreground">{content.hero.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
                  {content.story.label}
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  {content.story.title}{' '}
                  <span className="text-gradient-neon">{content.story.titleHighlight}</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  {content.story.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                    {content.story.stats.map((stat, i) => (
                      <div key={i} className="text-center p-6 rounded-xl bg-white/5">
                        <div className="text-4xl font-display font-bold text-primary">{stat.value}</div>
                        <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                {content.values.title} <span className="text-gradient-neon">{content.values.titleHighlight}</span>
              </h2>
              <p className="text-muted-foreground text-lg">{content.values.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.values.items.map((value, i) => {
                const Icon = iconMap[i % iconMap.length];
                return (
                  <div key={i} className="glass-card-hover p-8 flex items-start gap-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-xl mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Equipe */}
        <TeamSection />

        {/* Contato integrado */}
        <section id="contato" className="section-padding scroll-mt-24 border-t border-white/5">
          <div className="container-custom">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-[0.25em] mb-4 block">Fale com a gente</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold">Vamos <span className="text-gradient-neon italic">conversar.</span></h2>
              <p className="text-muted-foreground mt-4">Preencha o formulário abaixo ou chame no WhatsApp. Retornamos em até 24h úteis.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <div className="space-y-4">
                <a href={`mailto:${settings.email}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Mail className="w-6 h-6 text-primary" /></div>
                  <div><p className="text-sm text-muted-foreground">E-mail</p><p className="font-medium">{settings.email}</p></div>
                </a>
                <a href={`tel:+${settings.whatsapp}`} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Phone className="w-6 h-6 text-primary" /></div>
                  <div><p className="text-sm text-muted-foreground">Telefone</p><p className="font-medium">{settings.phone}</p></div>
                </a>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><MapPin className="w-6 h-6 text-primary" /></div>
                  <div><p className="text-sm text-muted-foreground">Localização</p><p className="font-medium">{settings.address}</p></div>
                </div>
                <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-6 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-[#25D366] flex items-center justify-center"><MessageCircle className="w-7 h-7 text-white" /></div>
                  <div><p className="font-display font-semibold text-lg">Falar pelo WhatsApp</p><p className="text-muted-foreground text-sm">Resposta rápida em horário comercial</p></div>
                </a>
              </div>

              <div className="glass-card p-6 md:p-8">
                {isSubmitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 neon-glow"><CheckCircle className="w-10 h-10 text-primary" /></div>
                    <h3 className="font-display font-semibold text-2xl mb-2">Mensagem enviada!</h3>
                    <p className="text-muted-foreground">Recebemos seu contato e retornaremos em até 24 horas úteis.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <input required name="name" value={formData.name} onChange={handleChange} placeholder="Nome completo *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50" />
                    {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50" />
                    {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
                    <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="WhatsApp" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50" />
                    <input name="company" value={formData.company} onChange={handleChange} placeholder="Empresa" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50" />
                    <select required name="service" value={formData.service} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50">
                      <option value="" className="bg-background">Qual serviço tem interesse? *</option>
                      <option value="Marketing Digital" className="bg-background">Marketing Digital</option>
                      <option value="Produtora Audiovisual" className="bg-background">Produtora Audiovisual</option>
                      <option value="Todos os serviços" className="bg-background">Todos os serviços</option>
                    </select>
                    <textarea required name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Conte um pouco sobre o projeto *" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-primary/50 resize-none" />
                    {errors.message && <p className="text-destructive text-xs">{errors.message}</p>}
                    <button disabled={isSubmitting} type="submit" className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                      <Send className="w-4 h-4" /> {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Premium */}
        <GlobalCTA
          context="Sobre"
          title={<>{content.cta.title} <span className="text-gradient-neon italic">{content.cta.titleHighlight}</span></>}
          subtitle={content.cta.subtitle || 'Fale com a Racun e descubra o que podemos construir juntos.'}
        />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Sobre;
