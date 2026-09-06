interface SectionHeadingProps {
  /** Rótulo curto acima do título (estilo editorial, maiúsculas) */
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  /** Ação opcional exibida à direita no desktop */
  action?: React.ReactNode;
  className?: string;
}

/**
 * Cabeçalho de seção editorial: rótulo fino em maiúsculas, título grande
 * alinhado à esquerda e subtítulo em coluna estreita para boa leitura.
 */
const SectionHeading = ({ eyebrow, title, highlight, subtitle, action, className = '' }: SectionHeadingProps) => (
  <div className={`mb-10 md:mb-16 ${className}`}>
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div className="max-w-2xl">
        {eyebrow && (
          <span className="block text-[11px] md:text-xs font-medium uppercase tracking-[0.28em] text-primary mb-4 md:mb-5">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display font-bold tracking-tight text-[1.75rem] leading-[1.1] sm:text-4xl md:text-5xl">
          {title}{highlight ? ' ' : ''}
          {highlight && <span className="text-primary">{highlight}</span>}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-lg text-muted-foreground mt-4 md:mt-6 max-w-xl">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  </div>
);

export default SectionHeading;
