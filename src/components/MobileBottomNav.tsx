import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, Grid3x3, User, MessageCircle, Megaphone, Film, Layers, ExternalLink, X } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

/**
 * Instagram-style bottom navigation for mobile.
 * Hidden on desktop and on admin routes.
 */
const MobileBottomNav = () => {
  const location = useLocation();
  const { settings } = useSiteSettings();
  const [sheetOpen, setSheetOpen] = useState(false);

  if (location.pathname.startsWith('/admin')) return null;

  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Racun.')}`;
  const isActive = (p: string) => location.pathname === p;

  const tabs = [
    { to: '/', icon: Home, label: 'Início' },
    { to: '/cases', icon: Briefcase, label: 'Cases' },
    { to: '/produtora', icon: Film, label: 'Produtora' },
    { to: '/sobre', icon: User, label: 'Sobre' },
  ];

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-background/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 h-14">
          {tabs.map(t => (
            <Link
              key={t.to}
              to={t.to}
              className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${isActive(t.to) ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <t.icon className="w-5 h-5" strokeWidth={isActive(t.to) ? 2.4 : 1.8} />
              <span>{t.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setSheetOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-muted-foreground"
          >
            <Grid3x3 className="w-5 h-5" strokeWidth={1.8} />
            <span>Mais</span>
          </button>
        </div>
      </nav>

      {sheetOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSheetOpen(false)} />
          <div className="relative bg-background border-t border-white/10 rounded-t-3xl p-6 pb-8 animate-slide-up">
            <div className="mx-auto w-10 h-1 rounded-full bg-white/20 mb-6" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg">Menu</h3>
              <button onClick={() => setSheetOpen(false)} className="p-2 rounded-full hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <MenuItem to="/marketing" icon={Megaphone} label="Marketing" onClick={() => setSheetOpen(false)} />
              <MenuItem to="/produtora" icon={Film} label="Produtora" onClick={() => setSheetOpen(false)} />
              <MenuItem to="/cases" icon={Briefcase} label="Cases" onClick={() => setSheetOpen(false)} />
              <MenuItem to="/sobre" icon={User} label="Sobre & Contato" onClick={() => setSheetOpen(false)} />
              <MenuItem to="/imobiliario" icon={Layers} label="Segmentos" onClick={() => setSheetOpen(false)} />
              <MenuItem to="/sobre#contato" icon={MessageCircle} label="Contato" onClick={() => setSheetOpen(false)} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-center flex items-center justify-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a href={settings.clientAreaUrl || 'https://app.racun.com.br'} target="_blank" rel="noopener noreferrer" className="btn-outline text-center flex items-center justify-center gap-2 text-sm">
                <ExternalLink className="w-4 h-4" /> Cliente
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const MenuItem = ({ to, icon: Icon, label, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition"
  >
    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <span className="text-xs font-medium text-center">{label}</span>
  </Link>
);

export default MobileBottomNav;