import { Link } from 'react-router-dom';
import { UtensilsCrossed, Camera, Megaphone, Calendar, ArrowRight } from 'lucide-react';

const RestaurantesTeaser = () => {
  const features = [
    {
      icon: Camera,
      title: 'Conteúdo semanal e cobertura',
      description: 'Fotos e vídeos que dão água na boca',
    },
    {
      icon: Megaphone,
      title: 'Anúncios para promoções',
      description: 'Campanhas para lotar a casa',
    },
    {
      icon: Calendar,
      title: 'Campanhas sazonais',
      description: 'Cardápio, ofertas e datas especiais',
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-secondary/20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <UtensilsCrossed className="w-4 h-4" />
              Marketing para Restaurantes
            </span>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Lote a casa e aumente os{' '}
              <span className="text-gradient-neon">pedidos delivery</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Marketing especializado para restaurantes com foco em criação de conteúdo 
              que dá fome e tráfego pago que traz clientes para a mesa e para o app.
            </p>

            {/* Feature cards */}
            <div className="space-y-4 mb-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/restaurantes" className="btn-primary inline-flex items-center gap-2">
              Quero vender mais
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Image Placeholder */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/50 border border-white/10 relative">
                {/* Placeholder gradient - food colors */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-yellow-500/10" />
                
                {/* Decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <UtensilsCrossed className="w-24 h-24 text-white/10" />
                </div>

                {/* Badge */}
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-white/10 text-sm">
                  📍 Alcance local + Delivery
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -top-4 -right-4 glass-card p-4 animate-float">
                <div className="text-2xl font-display font-bold text-primary">+180%</div>
                <div className="text-xs text-muted-foreground">Engajamento</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantesTeaser;
