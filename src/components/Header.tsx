import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Racun.')}`;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-background/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="container-custom px-4 md:px-8">
        <nav className="flex items-center justify-between h-16 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Racun" className="h-9 md:h-16 w-auto object-contain" />
            ) : (
              <span className="text-xl md:text-3xl font-display font-bold text-gradient-neon">RACUN</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/cases" className={`text-sm font-medium transition-all duration-300 hover:text-primary ${isActive('/cases') ? 'text-primary' : 'text-muted-foreground'}`}>
              Cases
            </Link>
            <Link to="/marketing" className={`text-sm font-medium transition-all duration-300 hover:text-primary ${isActive('/marketing') ? 'text-primary' : 'text-muted-foreground'}`}>
              Marketing
            </Link>
            <Link to="/produtora" className={`text-sm font-medium transition-all duration-300 hover:text-primary ${isActive('/produtora') ? 'text-primary' : 'text-muted-foreground'}`}>
              Produtora
            </Link>
            <Link to="/sobre" className={`text-sm font-medium transition-all duration-300 hover:text-primary ${isActive('/sobre') ? 'text-primary' : 'text-muted-foreground'}`}>
              Sobre & Contato
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={settings.clientAreaUrl || 'https://app.racun.com.br'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Área do Cliente
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
