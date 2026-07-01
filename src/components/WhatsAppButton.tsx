import { MessageCircle } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useLocation } from 'react-router-dom';

const WhatsAppButton = () => {
  const { settings } = useSiteSettings();
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Racun.')}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden lg:flex fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#25D366] rounded-full items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 group"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />
      <span className="absolute right-16 bg-background/90 backdrop-blur-sm text-foreground text-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-white/10">
        Fale conosco
      </span>
    </a>
  );
};

export default WhatsAppButton;
