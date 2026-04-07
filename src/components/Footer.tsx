import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, Phone } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();

  const services = [
    { name: 'Marketing Digital', path: '/marketing' },
    { name: 'Produtora Audiovisual', path: '/produtora' },
    { name: 'Cases', path: '/cases' },
  ];

  const company = [
    { name: 'Sobre nós', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
    { name: 'Produtora', path: '/produtora' },
    { name: 'Área do Cliente', path: 'https://app.racun.com.br', external: true },
  ];

  const socials = [
    { name: 'Instagram', icon: Instagram, url: settings.instagram },
    { name: 'YouTube', icon: Youtube, url: settings.youtube },
  ];

  return (
    <footer className="bg-secondary/30 border-t border-white/5">
      <div className="container-custom py-8 md:py-12 px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-8">
          {/* Brand + Socials */}
          <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
            <Link to="/" className="inline-block shrink-0">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Racun" className="h-8 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-display font-bold text-gradient-neon">RACUN</span>
              )}
            </Link>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services - hidden on mobile */}
          <div className="hidden md:block">
            <h4 className="font-display font-semibold text-foreground text-sm mb-3">Serviços</h4>
            <ul className="space-y-1.5">
              {services.map((service) => (
                <li key={service.name}>
                  <Link to={service.path} className="text-muted-foreground text-xs hover:text-primary transition-colors duration-300">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company - hidden on mobile */}
          <div className="hidden md:block">
            <h4 className="font-display font-semibold text-foreground text-sm mb-3">Empresa</h4>
            <ul className="space-y-1.5">
              {company.map((item) => (
                <li key={item.name}>
                  {'external' in item && item.external ? (
                    <a href={item.path} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-xs hover:text-primary transition-colors duration-300">
                      {item.name}
                    </a>
                  ) : (
                    <Link to={item.path} className="text-muted-foreground text-xs hover:text-primary transition-colors duration-300">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-wrap gap-4 md:flex-col md:gap-2">
            <a href={`mailto:${settings.email}`}
              className="flex items-center gap-2 text-muted-foreground text-xs hover:text-primary transition-colors duration-300">
              <Mail className="w-3.5 h-3.5" />
              {settings.email}
            </a>
            <a href={`tel:+${settings.whatsapp}`}
              className="flex items-center gap-2 text-muted-foreground text-xs hover:text-primary transition-colors duration-300">
              <Phone className="w-3.5 h-3.5" />
              {settings.phone}
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">
            © {currentYear} Agência Racun. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacidade" className="text-muted-foreground text-xs hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/termos" className="text-muted-foreground text-xs hover:text-primary transition-colors">Termos</Link>
            <Link to="/admin/login" className="text-muted-foreground/50 text-[10px] hover:text-muted-foreground transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
