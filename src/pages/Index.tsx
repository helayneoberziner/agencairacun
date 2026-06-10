import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/seo/SEO';
import WhatsAppButton from '@/components/WhatsAppButton';
import HeroSection from '@/components/home/HeroSection';
import ClientsStrip from '@/components/home/ClientsStrip';
import AudiovisualShowcase from '@/components/home/AudiovisualShowcase';
import ServicesSection from '@/components/home/ServicesSection';
import CasesPreview from '@/components/home/CasesPreview';
import MarketsSection from '@/components/home/MarketsSection';
import SocialProofSection from '@/components/home/SocialProofSection';
import ProcessSection from '@/components/home/ProcessSection';
import ContactSection from '@/components/home/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Racun · Agência de Marketing e Produtora Audiovisual"
        description="Estratégia, conteúdo e performance para marcas que querem crescer. Marketing digital, tráfego pago, branding e produção audiovisual."
        path="/"
      />
      <Header />
      <main>
        <HeroSection />
        <ClientsStrip />
        <AudiovisualShowcase />
        <ServicesSection />
        <CasesPreview />
        <MarketsSection />
        <SocialProofSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
