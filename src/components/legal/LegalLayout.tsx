import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Section {
  id: string;
  title: string;
}

interface LegalLayoutProps {
  title: string;
  subtitle?: string;
  updatedAt?: string;
  sections: Section[];
  children: React.ReactNode;
}

const LegalLayout = ({ title, subtitle, updatedAt, sections, children }: LegalLayoutProps) => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container-custom max-w-4xl">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-lg">{subtitle}</p>}
            {updatedAt && <p className="text-xs text-muted-foreground mt-3">Última atualização: {updatedAt}</p>}
          </header>

          <nav className="glass-card p-6 mb-12">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">Índice</h2>
            <ol className="space-y-2 list-decimal list-inside">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-foreground hover:text-primary transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="prose prose-invert max-w-none space-y-12 text-foreground/90 leading-relaxed">
            {children}
          </article>
        </div>
      </main>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default LegalLayout;