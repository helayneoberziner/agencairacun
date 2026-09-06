import { useState } from 'react';
import { Send, MessageCircle, CheckCircle, MapPin, ExternalLink } from 'lucide-react';
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
    <section id="contato" className="section-padding relative overflow-hidden">
      <SiteBackdrop section="contato" intensity={25} />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      
      <div className="container-custom relative z-10">
        <div className="grid-split">
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">{ct.badge}</span>
            <h2 className="text-2xl md:text-5xl font-display font-bold mb-4 md:mb-6">
              {ct.title}{' '}
              <span className="text-primary">{ct.titleHighlight}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">{ct.subtitle}</p>

            <a href={whatsappGenericLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-colors">
              <MessageCircle className="w-6 h-6" />
              <div>
                <p className="font-medium">Falar pelo WhatsApp</p>
                <p className="text-sm opacity-80">{settings.phone}</p>
              </div>
            </a>

            {/* Mapa integrado abaixo do WhatsApp */}
            <div className="mt-8 glass-card overflow-hidden">
              <div className="relative h-56 md:h-72">
                <iframe
                  src={mapEmbed}
                  title="Localização Agência Racun"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full border-0"
                  style={{ filter: 'invert(0.92) hue-rotate(180deg) grayscale(0.4) contrast(0.95)' }}
                />
              </div>
              <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 justify-between border-t border-white/5">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{settings.address}</span>
                </div>
                <a href={mapOpen} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm inline-flex items-center gap-2 self-start">
                  Abrir no Google Maps <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card p-5 md:p-8">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-2xl mb-2">Mensagem enviada!</h3>
                <p className="text-muted-foreground">Recebemos seu contato e retornaremos em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="home-name" className="block text-sm font-medium mb-2">Nome *</label>
                  <input type="text" id="home-name" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="Seu nome completo" />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="home-email" className="block text-sm font-medium mb-2">E-mail *</label>
                  <input type="email" id="home-email" name="email" value={formData.email} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="seu@email.com" />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="home-whatsapp" className="block text-sm font-medium mb-2">WhatsApp</label>
                  <input type="tel" id="home-whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="(11) 99999 9999" />
                </div>
                <div>
                  <label htmlFor="home-service" className="block text-sm font-medium mb-2">Qual serviço tem interesse? *</label>
                  <select id="home-service" name="service" value={formData.service} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors">
                    <option value="" className="bg-background">Selecione um serviço</option>
                    {services.map((service) => (
                      <option key={service} value={service} className="bg-background">{service}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="home-message" className="block text-sm font-medium mb-2">Mensagem *</label>
                  <textarea id="home-message" name="message" value={formData.message} onChange={handleChange} required rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
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
