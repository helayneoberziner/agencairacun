import { Link } from 'react-router-dom';
import { Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();

  const serviceLinks = [
    { name: 'Marketing Digital', path: '/marketing' },
    { name: 'Produtora Audiovisual', path: '/produtora' },
    { name: 'Cases', path: '/cases' },
  ];

  const companyLinks = [
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
    <footer className="border-t border-border" style={{ background: '#040d28' }}>
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Racun" className="h-10 w-auto object-contain" />
              ) : (
                <span className="text-3xl font-display" style={{ color: '#FF00CC' }}>RACUN</span>
              )}
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Agência de marketing, produtora audiovisual e especialistas em restaurantes.
              Transformamos marcas em experiências memoráveis.
            </p>
            <div className="flex gap-4">
              {socials.map((social) => (
                <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-foreground mb-6" style={{ fontSize: '18px' }}>Serviços</h4>
            <ul className="space-y-3">
              {serviceLinks.map((s) => (
                <li key={s.name}>
                  <Link to={s.path} className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-foreground mb-6" style={{ fontSize: '18px' }}>Empresa</h4>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  {item.external ? (
                    <a href={item.path} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200">{item.name}</a>
                  ) : (
                    <Link to={item.path} className="text-muted-foreground text-sm hover:text-primary transition-colors duration-200">{item.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-foreground mb-6" style={{ fontSize: '18px' }}>Contato</h4>
            <ul className="space-y-4">
              <li><a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-muted-foreground text-sm hover:text-primary transition-colors"><Mail className="w-4 h-4" />{settings.email}</a></li>
              <li><a href={`tel:+${settings.whatsapp}`} className="flex items-center gap-3 text-muted-foreground text-sm hover:text-primary transition-colors"><Phone className="w-4 h-4" />{settings.phone}</a></li>
              <li><span className="flex items-center gap-3 text-muted-foreground text-sm"><MapPin className="w-4 h-4" />{settings.address}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">© {currentYear} Agência Racun. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacidade" className="text-muted-foreground text-sm hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/termos" className="text-muted-foreground text-sm hover:text-primary transition-colors">Termos</Link>
            <Link to="/admin/login" className="text-muted-foreground/50 text-xs hover:text-muted-foreground transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
