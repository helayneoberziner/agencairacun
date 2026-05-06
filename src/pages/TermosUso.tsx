import LegalLayout from '@/components/legal/LegalLayout';

const sections = [
  { id: 'aceitacao', title: 'Aceitação dos termos' },
  { id: 'servicos', title: 'Sobre nossos serviços' },
  { id: 'uso-site', title: 'Uso do site' },
  { id: 'propriedade', title: 'Propriedade intelectual' },
  { id: 'responsabilidades', title: 'Responsabilidades' },
  { id: 'links', title: 'Links externos' },
  { id: 'alteracoes', title: 'Alterações dos termos' },
  { id: 'foro', title: 'Foro e legislação' },
];

const TermosUso = () => (
  <LegalLayout
    title="Termos de Uso"
    subtitle="Regras para utilização do site e dos serviços da Agência Racun."
    updatedAt="Maio de 2026"
    sections={sections}
  >
    <section id="aceitacao" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">1. Aceitação dos termos</h2>
      <p>Ao acessar e usar o site da Agência Racun, você concorda com estes Termos. Caso não concorde, recomendamos não utilizar o site.</p>
    </section>

    <section id="servicos" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">2. Sobre nossos serviços</h2>
      <p>A Racun oferece serviços de marketing digital, produção audiovisual, branding e estratégias de comunicação. Detalhes específicos de cada projeto são definidos em proposta comercial individual.</p>
    </section>

    <section id="uso-site" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">3. Uso do site</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Não utilizar o site para fins ilícitos</li>
        <li>Não tentar acessar áreas restritas sem autorização</li>
        <li>Não reproduzir conteúdo sem permissão</li>
      </ul>
    </section>

    <section id="propriedade" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">4. Propriedade intelectual</h2>
      <p>Todo o conteúdo do site (textos, imagens, vídeos, marcas, layout) pertence à Agência Racun ou a seus licenciantes, sendo protegido pelas leis de propriedade intelectual.</p>
    </section>

    <section id="responsabilidades" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">5. Responsabilidades</h2>
      <p>O site é fornecido no estado em que se encontra. Buscamos a maior disponibilidade possível, mas não garantimos funcionamento ininterrupto ou livre de erros.</p>
    </section>

    <section id="links" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">6. Links externos</h2>
      <p>O site pode conter links para sites de terceiros. Não nos responsabilizamos pelo conteúdo, políticas ou práticas desses sites.</p>
    </section>

    <section id="alteracoes" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">7. Alterações dos termos</h2>
      <p>Podemos atualizar estes Termos a qualquer momento. A versão mais recente estará sempre disponível nesta página.</p>
    </section>

    <section id="foro" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">8. Foro e legislação</h2>
      <p>Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da comarca de Blumenau/SC para dirimir eventuais controvérsias.</p>
    </section>
  </LegalLayout>
);

export default TermosUso;