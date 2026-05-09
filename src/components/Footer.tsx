import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { getSocialIcon, getSocialLabel } from '@/lib/socialIcons';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();

  const socials = (settings.socialNetworks ?? [])
    .filter(s => s.isActive && s.url)
    .map(s => ({ name: getSocialLabel(s.platform), icon: getSocialIcon(s.platform), url: s.url }));

  const whatsappLink = `https://wa.me/${settings.whatsapp}`;

  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="container-custom py-16 md:py-24 px-4 md:px-8">
        {/* Tagline editorial */}
        <div className="mb-16 md:mb-24 max-w-3xl">
          <p className="text-eyebrow mb-6">Agência Racun</p>
          <p className="text-display text-3xl md:text-5xl leading-[1.15] text-foreground/95">
            Construímos marcas que <span className="italic text-primary">marcam.</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-white/5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-6">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Racun" className="h-8 w-auto object-contain" />
              ) : (
                <span className="text-2xl font-display text-foreground">RACUN</span>
              )}
            </Link>
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.name + social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="text-foreground/50 hover:text-primary transition-colors duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <FooterCol title="Navegação" items={[
            { name: 'Trabalho', path: '/cases' },
            { name: 'Marketing', path: '/marketing' },
            { name: 'Produtora', path: '/produtora' },
            { name: 'Sobre', path: '/sobre' },
            { name: 'Contato', path: '/contato' },
          ]} />

          {/* Contato */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-5">Contato</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${settings.email}`} className="text-foreground/70 hover:text-primary transition-colors story-link">
                  {settings.email}
                </a>
              </li>
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors story-link">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={settings.clientAreaUrl || 'https://app.racun.com.br'} target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors story-link">
                  Área do cliente
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <FooterCol title="Legal" items={[
            { name: 'Privacidade', path: '/politica-de-privacidade' },
            { name: 'Termos de uso', path: '/termos-de-uso' },
          ]} />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-foreground/40 text-xs">
            © {currentYear} Agência Racun. Todos os direitos reservados.
          </p>
          <Link to="/admin/login" className="text-foreground/30 text-[10px] uppercase tracking-[0.25em] hover:text-foreground/60 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

const FooterCol = ({ title, items }: { title: string; items: { name: string; path: string }[] }) => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/40 mb-5">{title}</p>
    <ul className="space-y-3 text-sm">
      {items.map((item) => (
        <li key={item.name}>
          <Link to={item.path} className="text-foreground/70 hover:text-primary transition-colors story-link">
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
