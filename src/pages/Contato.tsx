import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomCursor from '@/components/CustomCursor';
import RevealSection from '@/components/RevealSection';
import { Send, MessageCircle, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useContactForm } from '@/hooks/useContactForm';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { motion } from 'framer-motion';

const Contato = () => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', company: '', service: '', message: '' });

  const { submit, isSubmitting, isSubmitted, errors } = useContactForm({
    onSuccess: () => setFormData({ name: '', email: '', whatsapp: '', company: '', service: '', message: '' }),
  });

  const services = ['Marketing Digital', 'Produtora Audiovisual', 'Todos os serviços'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit({ name: formData.name, email: formData.email, phone: formData.whatsapp, company: formData.company, service: formData.service, message: formData.message });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const whatsappMessage = encodeURIComponent(`Olá! Meu nome é ${formData.name}. Empresa: ${formData.company}. Tenho interesse em: ${formData.service}. ${formData.message}`);
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${whatsappMessage}`;
  const inputClass = "w-full px-4 py-3 rounded-sm bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="min-h-screen bg-background grain">
      <CustomCursor />
      <Header />

      <main>
        <section className="pt-32 pb-12" style={{ background: '#040d28' }}>
          <div className="container-custom">
            <motion.h1 className="font-display mb-6" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              Entre em <em className="text-gradient-neon">contato</em>
            </motion.h1>
            <motion.p className="text-muted-foreground max-w-2xl" style={{ fontSize: '18px' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              Vamos conversar sobre o seu projeto. Preencha o formulário ou fale diretamente conosco pelo WhatsApp.
            </motion.p>
          </div>
        </section>

        <section className="section-padding pt-8">
          <div className="container-custom">
            <RevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <h2 className="font-display mb-8" style={{ fontSize: 'clamp(20px, 2.5vw, 32px)' }}>Informações de contato</h2>
                  <div className="space-y-4 mb-12">
                    {[
                      { icon: Mail, label: 'E-mail', value: settings.email, href: `mailto:${settings.email}` },
                      { icon: Phone, label: 'Telefone', value: settings.phone, href: `tel:+${settings.whatsapp}` },
                      { icon: MapPin, label: 'Localização', value: settings.address },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 py-4 border-b border-border">
                        <item.icon className="w-5 h-5 flex-shrink-0" style={{ color: '#FF00CC' }} />
                        <div>
                          <p className="text-sm text-muted-foreground">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="font-medium text-foreground hover:text-primary transition-colors">{item.value}</a>
                          ) : (
                            <p className="font-medium">{item.value}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <a
                    href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Racun.')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 p-4 rounded-sm border border-border hover:bg-secondary/60 transition-colors"
                  >
                    <MessageCircle className="w-7 h-7" style={{ color: '#25D366' }} />
                    <div>
                      <p className="font-display">Falar pelo WhatsApp</p>
                      <p className="text-muted-foreground text-sm">Resposta rápida em horário comercial</p>
                    </div>
                  </a>
                </div>

                <div className="border border-border rounded-sm p-8" style={{ background: '#080f2e' }}>
                  {isSubmitted ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-12">
                      <CheckCircle className="w-8 h-8 mb-6" style={{ color: '#FF00CC' }} />
                      <h3 className="font-display mb-2">Mensagem enviada!</h3>
                      <p className="text-muted-foreground">Recebemos seu contato e retornaremos em até 24 horas úteis.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {[
                        { id: 'name', label: 'Nome *', type: 'text', placeholder: 'Seu nome completo', required: true },
                        { id: 'email', label: 'E-mail *', type: 'email', placeholder: 'seu@email.com', required: true },
                        { id: 'whatsapp', label: 'WhatsApp', type: 'tel', placeholder: '(11) 99999 9999' },
                        { id: 'company', label: 'Empresa', type: 'text', placeholder: 'Nome da sua empresa' },
                      ].map((field) => (
                        <div key={field.id}>
                          <label htmlFor={field.id} className="block text-sm font-medium mb-2">{field.label}</label>
                          <input type={field.type} id={field.id} name={field.id} value={(formData as any)[field.id]} onChange={handleChange} required={field.required} className={inputClass} placeholder={field.placeholder} />
                          {(errors as any)[field.id] && <p className="text-destructive text-sm mt-1">{(errors as any)[field.id]}</p>}
                        </div>
                      ))}
                      <div>
                        <label htmlFor="service" className="block text-sm font-medium mb-2">Qual serviço tem interesse? *</label>
                        <select id="service" name="service" value={formData.service} onChange={handleChange} required className={inputClass}>
                          <option value="" className="bg-background">Selecione um serviço</option>
                          {services.map((s) => <option key={s} value={s} className="bg-background">{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">Mensagem *</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={4} className={`${inputClass} resize-none`} placeholder="Conte um pouco sobre seu projeto ou necessidade..." />
                        {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                          <Send className="w-4 h-4" /> {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
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
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contato;
