import { useGalleryStats, useGalleryStatsRealtime } from '@/hooks/useGalleries';
import { brl } from '@/lib/galleryPricing';
import { Eye, Heart, DollarSign, Download, ShoppingBag, Radio } from 'lucide-react';

const Card = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="rounded-xl border border-border bg-background p-4">
    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="w-3.5 h-3.5" /> {label}</div>
    <div className="text-2xl font-display mt-1">{value}</div>
  </div>
);

const GalleryStatsPanel = ({ galleryId }: { galleryId: string }) => {
  const { data, isLoading } = useGalleryStats(galleryId);
  useGalleryStatsRealtime(galleryId);

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Estatísticas</h3>
        <span className="text-[11px] text-primary flex items-center gap-1"><Radio className="w-3 h-3 animate-pulse" /> tempo real</span>
      </div>
      {isLoading || !data ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <Card icon={Eye} label="Visitas" value={String(data.visits)} />
            <Card icon={Heart} label="Favoritos" value={String(data.favorites)} />
            <Card icon={DollarSign} label="Total vendido" value={brl(data.totalSold)} />
            <Card icon={Download} label="Downloads" value={String(data.downloads)} />
            <Card icon={ShoppingBag} label="Pedidos" value={String(data.orders)} />
          </div>
          {data.topFavorites.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Mais favoritadas</p>
              <div className="flex gap-2">
                {data.topFavorites.map(i => (
                  <div key={i.id} className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img src={i.preview_url ?? ''} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 px-1 text-[10px] bg-primary text-primary-foreground rounded-tl">{i.favorite_count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GalleryStatsPanel;
