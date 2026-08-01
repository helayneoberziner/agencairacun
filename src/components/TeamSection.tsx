import { useTeam } from '@/hooks/useTeam';

const TeamSection = () => {
  const { data: team = [] } = useTeam({ onlyActive: true });
  if (team.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-[0.25em] mb-4 block">Equipe</span>
          <h2 className="text-[1.6rem] md:text-5xl font-display font-bold">
            Pessoas por trás da <span className="text-gradient-neon italic">Racun.</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {team.map(m => (
            <div key={m.id} className="group w-[calc(50%-0.75rem)] sm:w-56 md:w-60 lg:w-64">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-secondary border border-white/5 mb-4">
                {m.photo_url ? (
                  <img
                    src={m.photo_url}
                    alt={m.name}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/10" />
                )}
              </div>
              <h3 className="font-display font-semibold text-lg">{m.name}</h3>
              <p className="text-primary text-sm uppercase tracking-wider">{m.role}</p>
              {m.bio && <p className="text-muted-foreground text-sm mt-2 line-clamp-3">{m.bio}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;