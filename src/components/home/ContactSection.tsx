import { useState } from 'react';
import { Send, MessageCircle, CheckCircle } from 'lucide-react';
import { useContactForm } from '@/hooks/useContactForm';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useHomeContent } from '@/hooks/useHomeContent';
import RevealSection from '../RevealSection';

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

  const inputClass = "w-full px-4 py-3 rounded-sm bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <section id="contato" className="section-padding">
      <div className="container-custom">
        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div>
              <span className="text-sm font-medium uppercase tracking-wider mb-4 block" style={{ color: '#FF00CC' }}>{ct.badge}</span>
              <h2 className="font-display mb-6">
                {ct.title}{' '}
                <em className="text-gradient-neon">{ct.titleHighlight}</em>
              </h2>
              <p className="text-muted-foreground mb-8" style={{ fontSize: '18px' }}>{ct.subtitle}</p>

              <a href={whatsappGenericLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 p-4 rounded-sm border border-border hover:bg-secondary/60 transition-colors">
                <MessageCircle className="w-6 h-6" style={{ color: '#25D366' }} />
                <div>
                  <p className="font-medium text-foreground">Falar pelo WhatsApp</p>
                  <p className="text-sm text-muted-foreground">{settings.phone}</p>
                </div>
              </a>
            </div>

            <div className="border border-border rounded-sm p-5 md:p-8" style={{ background: '#080f2e' }}>
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <CheckCircle className="w-8 h-8 mb-6" style={{ color: '#FF00CC' }} />
                  <h3 className="font-display mb-2">Mensagem enviada!</h3>
                  <p className="text-muted-foreground">Recebemos seu contato e retornaremos em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="home-name" className="block text-sm font-medium mb-2">Nome *</label>
                    <input type="text" id="home-name" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Seu nome completo" />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="home-email" className="block text-sm font-medium mb-2">E-mail *</label>
                    <input type="email" id="home-email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="seu@email.com" />
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="home-whatsapp" className="block text-sm font-medium mb-2">WhatsApp</label>
                    <input type="tel" id="home-whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className={inputClass} placeholder="(11) 99999 9999" />
                  </div>
                  <div>
                    <label htmlFor="home-service" className="block text-sm font-medium mb-2">Qual serviço tem interesse? *</label>
                    <select id="home-service" name="service" value={formData.service} onChange={handleChange} required className={inputClass}>
                      <option value="" className="bg-background">Selecione um serviço</option>
                      {services.map((service) => (
                        <option key={service} value={service} className="bg-background">{service}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="home-message" className="block text-sm font-medium mb-2">Mensagem *</label>
                    <textarea id="home-message" name="message" value={formData.message} onChange={handleChange} required rows={4} className={`${inputClass} resize-none`} placeholder="Conte um pouco sobre seu projeto..." />
                    {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                      <Send className="w-4 h-4" />
                      {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
                    </button>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-outline justify-center">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default ContactSection;
