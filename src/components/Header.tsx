import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, ChevronDown, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Racun.')}`;

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-background/85 backdrop-blur-xl border-b border-white/5 py-0' : 'bg-transparent'}`}>
      <div className="container-custom">
        <nav className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-16' : 'h-24'}`}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Racun" className={`w-auto object-contain transition-all duration-500 ${isScrolled ? 'h-8' : 'h-9'}`} />
            ) : (
              <span className="text-2xl font-display tracking-tight text-foreground">RACUN</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            <Link to="/cases" className={`text-sm transition-all duration-300 story-link ${isActive('/cases') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'}`}>
              Trabalho
            </Link>

            {/* Serviços Dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className={`text-sm transition-all duration-300 hover:text-foreground flex items-center gap-1.5 ${isActive('/marketing') || isActive('/produtora') ? 'text-primary' : 'text-foreground/80'}`}
              >
                Serviços
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isServicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 bg-background/95 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden animate-fade-in">
                  <Link
                    to="/marketing"
                    onClick={() => setIsServicesOpen(false)}
                    className={`block px-6 py-4 text-sm transition-colors hover:bg-white/5 ${isActive('/marketing') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'}`}
                  >
                    Marketing Digital
                  </Link>
                  <div className="border-t border-white/5" />
                  <Link
                    to="/produtora"
                    onClick={() => setIsServicesOpen(false)}
                    className={`block px-6 py-4 text-sm transition-colors hover:bg-white/5 ${isActive('/produtora') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'}`}
                  >
                    Produtora Audiovisual
                  </Link>
                </div>
              )}
            </div>

            <Link to="/sobre" className={`text-sm transition-all duration-300 story-link ${isActive('/sobre') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'}`}>
              Sobre
            </Link>
            <Link to="/contato" className={`text-sm transition-all duration-300 story-link ${isActive('/contato') ? 'text-primary' : 'text-foreground/80 hover:text-foreground'}`}>
              Contato
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href={settings.clientAreaUrl || 'https://app.racun.com.br'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              Área do Cliente
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-foreground">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/5 animate-fade-in">
            <div className="container-custom py-6 flex flex-col gap-4">
              <Link to="/cases" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium py-2 ${isActive('/cases') ? 'text-primary' : 'text-muted-foreground'}`}>
                Trabalho
              </Link>

              <div className="space-y-2">
                <span className="text-lg font-medium py-2 text-muted-foreground">Serviços</span>
                <div className="pl-4 space-y-2 border-l border-white/10">
                  <Link to="/marketing" onClick={() => setIsMobileMenuOpen(false)} className={`block py-1.5 text-base ${isActive('/marketing') ? 'text-primary' : 'text-muted-foreground'}`}>
                    Marketing Digital
                  </Link>
                  <Link to="/produtora" onClick={() => setIsMobileMenuOpen(false)} className={`block py-1.5 text-base ${isActive('/produtora') ? 'text-primary' : 'text-muted-foreground'}`}>
                    Produtora Audiovisual
                  </Link>
                </div>
              </div>

              <Link to="/sobre" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium py-2 ${isActive('/sobre') ? 'text-primary' : 'text-muted-foreground'}`}>
                Sobre
              </Link>
              <Link to="/contato" onClick={() => setIsMobileMenuOpen(false)} className={`text-lg font-medium py-2 ${isActive('/contato') ? 'text-primary' : 'text-muted-foreground'}`}>
                Contato
              </Link>

              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <a href={settings.clientAreaUrl || 'https://app.racun.com.br'} target="_blank" rel="noopener noreferrer" className="btn-outline text-center flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Área do Cliente
                </a>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-center flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
