import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
