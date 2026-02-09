import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Marketing Digital', path: '/marketing', external: false },
    { name: 'Produtora Audiovisual', path: 'https://racunfilmes.lovable.app', external: true },
    { name: 'Cases', path: '/cases', external: false },
  ];

  const company = [
    { name: 'Sobre nós', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
    { name: 'Cases', path: '/cases' },
  ];

  const socials = [
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/racunagency' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/racun' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@racun' },
  ];

  return (
    <footer className="bg-secondary/30 border-t border-white/5">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-display font-bold text-gradient-neon">
                RACUN
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Agência de marketing, produtora audiovisual e especialistas em restaurantes. 
              Transformamos marcas em experiências memoráveis.
            </p>
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Serviços</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  {service.external ? (
                    <a
                      href={service.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                    >
                      {service.name}
                    </a>
                  ) : (
                    <Link
                      to={service.path}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                    >
                      {service.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Empresa</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-6">Contato</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contato@racun.com.br"
                  className="flex items-center gap-3 text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                >
                  <Mail className="w-4 h-4" />
                  contato@racun.com.br
                </a>
              </li>
              <li>
                <a
                  href="tel:+554732096098"
                  className="flex items-center gap-3 text-muted-foreground text-sm hover:text-primary transition-colors duration-300"
                >
                  <Phone className="w-4 h-4" />
                  (47) 3209-6098
                </a>
              </li>
              <li>
                <span className="flex items-center gap-3 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4" />
                  Rua Pontes de Miranda, 22 – Blumenau, SC
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Agência Racun. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacidade" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Privacidade
            </Link>
            <Link to="/termos" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Termos
            </Link>
            <Link 
              to="/admin/login" 
              className="text-muted-foreground/50 text-xs hover:text-muted-foreground transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
