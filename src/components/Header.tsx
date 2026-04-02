import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, ChevronDown, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const { settings } = useSiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 80);
      setIsHidden(y > 80 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: isScrolled ? '#040d28cc' : 'transparent',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        padding: isScrolled ? '12px 0' : '20px 0',
        transition: 'all 300ms ease',
        transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Racun" className="h-10 w-auto object-contain" />
            ) : (
              <span className="text-2xl font-display" style={{ color: '#FF00CC' }}>RACUN</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Trabalho', path: '/cases' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-link relative text-sm font-medium"
                style={{ color: isActive(item.path) ? '#FF00CC' : 'hsl(215 16% 55%)' }}
              >
                {item.label}
                <span className="nav-underline" />
              </Link>
            ))}

            {/* Serviços Dropdown */}
            <div ref={servicesRef} className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="nav-link relative text-sm font-medium flex items-center gap-1"
                style={{ color: isActive('/marketing') || isActive('/produtora') ? '#FF00CC' : 'hsl(215 16% 55%)' }}
              >
                Serviços
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} />
                <span className="nav-underline" />
              </button>
              {isServicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 border border-border rounded-sm overflow-hidden" style={{ background: '#080f2e' }}>
                  <Link
                    to="/marketing"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-5 py-3.5 text-sm transition-colors hover:bg-white/5"
                    style={{ color: isActive('/marketing') ? '#FF00CC' : 'hsl(215 16% 55%)' }}
                  >
                    Marketing Digital
                  </Link>
                  <div className="border-t border-border" />
                  <Link
                    to="/produtora"
                    onClick={() => setIsServicesOpen(false)}
                    className="block px-5 py-3.5 text-sm transition-colors hover:bg-white/5"
                    style={{ color: isActive('/produtora') ? '#FF00CC' : 'hsl(215 16% 55%)' }}
                  >
                    Produtora Audiovisual
                  </Link>
                </div>
              )}
            </div>

            {[
              { label: 'Sobre', path: '/sobre' },
              { label: 'Contato', path: '/contato' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="nav-link relative text-sm font-medium"
                style={{ color: isActive(item.path) ? '#FF00CC' : 'hsl(215 16% 55%)' }}
              >
                {item.label}
                <span className="nav-underline" />
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="https://app.racun.com.br" target="_blank" rel="noopener noreferrer" className="btn-ghost flex items-center gap-2 text-sm">
              <ExternalLink className="w-3.5 h-3.5" /> Área do Cliente
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-foreground">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 border-b border-border" style={{ background: '#040d28f5' }}>
            <div className="container-custom py-6 flex flex-col gap-4">
              <Link to="/cases" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-2" style={{ color: isActive('/cases') ? '#FF00CC' : 'hsl(215 16% 55%)' }}>
                Trabalho
              </Link>
              <div className="space-y-2">
                <span className="text-lg font-medium py-2" style={{ color: 'hsl(215 16% 55%)' }}>Serviços</span>
                <div className="pl-4 space-y-2 border-l border-border">
                  <Link to="/marketing" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-base" style={{ color: isActive('/marketing') ? '#FF00CC' : 'hsl(215 16% 55%)' }}>
                    Marketing Digital
                  </Link>
                  <Link to="/produtora" onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-base" style={{ color: isActive('/produtora') ? '#FF00CC' : 'hsl(215 16% 55%)' }}>
                    Produtora Audiovisual
                  </Link>
                </div>
              </div>
              <Link to="/sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-2" style={{ color: isActive('/sobre') ? '#FF00CC' : 'hsl(215 16% 55%)' }}>
                Sobre
              </Link>
              <Link to="/contato" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium py-2" style={{ color: isActive('/contato') ? '#FF00CC' : 'hsl(215 16% 55%)' }}>
                Contato
              </Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <a href="https://app.racun.com.br" target="_blank" rel="noopener noreferrer" className="btn-outline text-center flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Área do Cliente
                </a>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-center flex items-center justify-center gap-2 justify-center">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .nav-link { position: relative; transition: color 200ms; }
        .nav-link:hover { color: #FF00CC !important; }
        .nav-underline {
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 1px;
          background: #FF00CC;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 200ms ease;
        }
        .nav-link:hover .nav-underline { transform: scaleX(1); }
      `}</style>
    </header>
  );
};

export default Header;
