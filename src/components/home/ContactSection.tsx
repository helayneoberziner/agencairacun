import { useState } from 'react';
import { Send, MessageCircle, CheckCircle, MapPin, ExternalLink, Mail } from 'lucide-react';
import { useContactForm } from '@/hooks/useContactForm';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useHomeContent } from '@/hooks/useHomeContent';
import SiteBackdrop from '@/components/SiteBackdrop';

const ContactSection = () => {
  const { settings } = useSiteSettings();
  const { content } = useHomeContent();
  const ct = content.contact;
  const [formData, setFormData] = useState({
    name: '', email: '', whatsapp: '', company: '', service: '', message: '',
  });

  const { submit, isSubmitting, isSubmitted, errors } = useContactForm({
    onSuccess: () => {
      setFormData({ name: '', email: '', whatsapp: '', company: '', service: '', message: '' });
    },
  });

  const services = ['Marketing Digital', 'Produtora Audiovisual', 'Todos os serviços'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({
      name: formData.name, email: formData.email, phone: formData.whatsapp,
      company: formData.company, service: formData.service, message: formData.message,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Meu nome é ${formData.name}. Empresa: ${formData.company}. Tenho interesse em: ${formData.service}. ${formData.message}`
  );
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`;
  const whatsappGenericLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Racun.')}`;

  const mapQuery = encodeURIComponent(settings.address || 'Agência Racun, Blumenau, SC');
  const mapEmbed = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  const mapOpen = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <section id="contato" className="section-padding relative overflow-hidden border-t border-border">
      <SiteBackdrop section="contato" intensity={25} />

      <div className="container-custom relative z-10">
        <div className="grid-split">
          <div>
            <span className="block text-[11px] md:text-xs font-medium uppercase tracking-[0.28em] text-primary mb-3 md:mb-5">{ct.badge}</span>
            <h2 className="font-display font-bold tracking-tight text-[1.75rem] leading-[1.1] sm:text-4xl md:text-5xl mb-3 md:mb-6">
              {ct.title}{' '}
              <span className="text-primary">{ct.titleHighlight}</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-lg mb-6 md:mb-8 max-w-xl">{ct.subtitle}</p>

            <div className="flex flex-col gap-3">
              <a href={whatsappGenericLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 md:p-4 rounded-xl border border-border hover:border-primary/40 transition-colors">
                <MessageCircle className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
                <div className="min-w-0">
                  <p className="font-medium text-sm md:text-base">Falar pelo WhatsApp</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{settings.phone}</p>
                </div>
              </a>
              {settings.email && (
                <a href={`mailto:${settings.email}`}
                  className="flex items-center gap-3 p-3.5 md:p-4 rounded-xl border border-border hover:border-primary/40 transition-colors">
                  <Mail className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm md:text-base">Enviar e-mail</p>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{settings.email}</p>
                  </div>
                </a>
              )}
            </div>

            {/* Mapa integrado abaixo dos contatos */}
            <div className="mt-6 md:mt-8 rounded-xl border border-border overflow-hidden">
              <div className="relative h-40 md:h-72">
                <iframe
                  src={mapEmbed}
                  title="Localização Agência Racun"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full border-0"
                  style={{ filter: 'invert(0.92) hue-rotate(180deg) grayscale(0.4) contrast(0.95)' }}
                />
              </div>
              <div className="p-3.5 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between border-t border-border">
                <div className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                  <span>{settings.address}</span>
                </div>
                <a href={mapOpen} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs md:text-sm inline-flex items-center gap-2 self-start">
                  Abrir no Google Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 md:p-8">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-2xl mb-2">Mensagem enviada!</h3>
                <p className="text-muted-foreground">Recebemos seu contato e retornaremos em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <label htmlFor="home-name" className="block text-sm font-medium mb-2">Nome *</label>
                  <input type="text" id="home-name" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="Seu nome completo" />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="home-email" className="block text-sm font-medium mb-2">E-mail *</label>
                  <input type="email" id="home-email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="seu@email.com" />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="home-whatsapp" className="block text-sm font-medium mb-2">WhatsApp</label>
                  <input type="tel" id="home-whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                    className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="(11) 99999 9999" />
                </div>
                <div>
                  <label htmlFor="home-service" className="block text-sm font-medium mb-2">Qual serviço tem interesse? *</label>
                  <select id="home-service" name="service" value={formData.service} onChange={handleChange} required
                    className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors">
                    <option value="" className="bg-background">Selecione um serviço</option>
                    {services.map((service) => (
                      <option key={service} value={service} className="bg-background">{service}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="home-message" className="block text-sm font-medium mb-2">Mensagem *</label>
                  <textarea id="home-message" name="message" value={formData.message} onChange={handleChange} required rows={4}
                    className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
                    placeholder="Conte um pouco sobre seu projeto..." />
                  {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button type="submit" disabled={isSubmitting}
                    className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                  </button>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                    className="btn-outline flex items-center justify-center gap-2">
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

export default ContactSection;
