import { useState } from 'react';
import { Send, MessageCircle, CheckCircle } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    company: '',
    service: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const services = [
    'Marketing Digital',
    'Produtora Audiovisual',
    'Marketing para Restaurantes',
    'Todos os serviços',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Meu nome é ${formData.name}. Empresa: ${formData.company}. Tenho interesse em: ${formData.service}. ${formData.message}`
  );
  const whatsappLink = `https://wa.me/554732096098?text=${whatsappMessage}`;

  return (
    <section id="contato" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Content */}
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
              Contato
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Vamos conversar sobre o{' '}
              <span className="text-gradient-neon">seu projeto?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Preencha o formulário ou fale diretamente conosco pelo WhatsApp. 
              Respondemos em até 24 horas úteis.
            </p>

            {/* WhatsApp shortcut */}
            <a
              href="https://wa.me/554732096098?text=Olá! Gostaria de saber mais sobre os serviços da Racun."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 p-4 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <div>
                <p className="font-medium">Falar pelo WhatsApp</p>
                <p className="text-sm opacity-80">(47) 3209-6098</p>
              </div>
            </a>
          </div>

          {/* Right - Form */}
          <div className="glass-card p-8">
            {isSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 neon-glow">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-2xl mb-2">Mensagem enviada!</h3>
                <p className="text-muted-foreground">
                  Recebemos seu contato e retornaremos em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="(11) 99999 9999"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium mb-2">
                    Qual serviço tem interesse?
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  >
                    <option value="" className="bg-background">Selecione um serviço</option>
                    {services.map((service) => (
                      <option key={service} value={service} className="bg-background">
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors resize-none"
                    placeholder="Conte um pouco sobre seu projeto..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Enviar mensagem
                  </button>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
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

export default ContactSection;
