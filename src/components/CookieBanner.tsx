import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'racun_cookie_consent';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'accepted', date: new Date().toISOString() }));
    setVisible(false);
  };

  const manage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ status: 'managed', date: new Date().toISOString() }));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 left-3 right-3 lg:bottom-6 md:left-6 md:right-auto md:bottom-6 md:max-w-md z-[100] animate-fade-in">
      <div className="bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-3.5 md:p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
            <Cookie className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm text-foreground leading-relaxed">
              Utilizamos cookies para melhorar sua experiência e exibir anúncios personalizados.{' '}
              <Link to="/politica-de-privacidade" className="text-primary hover:underline">Saiba mais</Link>.
            </p>
            <div className="flex gap-2 mt-3">
              <button onClick={accept} className="btn-primary text-xs md:text-sm py-1.5 md:py-2 px-3 md:px-4">Aceitar</button>
              <button onClick={manage} className="btn-ghost text-xs md:text-sm py-1.5 md:py-2 px-3 md:px-4">Gerenciar</button>
            </div>
          </div>
          <button onClick={manage} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Fechar">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;