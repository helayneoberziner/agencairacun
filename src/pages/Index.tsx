import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroSection from '@/components/home/HeroSection';
import ServicesSection from '@/components/home/ServicesSection';
import SocialProofSection from '@/components/home/SocialProofSection';
import ProdutoraTeaser from '@/components/home/ProdutoraTeaser';
import PortfolioGrid from '@/components/PortfolioGrid';
import MarketsSection from '@/components/home/MarketsSection';
import ProcessSection from '@/components/home/ProcessSection';
import ContactSection from '@/components/home/ContactSection';
import LocationMap from '@/components/home/LocationMap';
import { useHomeContent } from '@/hooks/useHomeContent';

const Index = () => {
  const { content } = useHomeContent();
  const c = content.casesPreview;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <SocialProofSection />
        <ProdutoraTeaser />
        <PortfolioGrid
          featuredOnly
          showFilters
          badge={c.badge}
          title={c.title}
          titleHighlight={c.titleHighlight}
          subtitle={c.subtitle}
        />
        <MarketsSection />
        <ProcessSection />
        <ContactSection />
        <LocationMap />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
