import LegalLayout from '@/components/legal/LegalLayout';
import LgpdRequestForm from '@/components/legal/LgpdRequestForm';

const sections = [
  { id: 'introducao', title: 'Introdução' },
  { id: 'dados-coletados', title: 'Dados que coletamos' },
  { id: 'uso-dados', title: 'Como usamos seus dados' },
  { id: 'compartilhamento', title: 'Compartilhamento de dados' },
  { id: 'cookies', title: 'Cookies e tecnologias similares' },
  { id: 'direitos', title: 'Seus direitos (LGPD)' },
  { id: 'seguranca', title: 'Segurança da informação' },
  { id: 'retencao', title: 'Retenção de dados' },
  { id: 'contato', title: 'Como falar conosco' },
  { id: 'solicitacao-lgpd', title: 'Formulário de solicitação' },
];

const PoliticaPrivacidade = () => (
  <LegalLayout
    title="Política de Privacidade"
    subtitle="Sua privacidade é prioridade na Agência Racun."
    updatedAt="Maio de 2026"
    sections={sections}
  >
    <section id="introducao" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">1. Introdução</h2>
      <p>A Agência Racun valoriza a privacidade dos visitantes e clientes. Esta Política descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei nº 13.709/2018 (LGPD).</p>
    </section>

    <section id="dados-coletados" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">2. Dados que coletamos</h2>
      <h3 className="text-lg font-semibold mt-6 mb-2">Informações fornecidas por você</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Nome completo, e-mail, telefone e empresa ao preencher formulários</li>
        <li>Mensagens enviadas pelos canais de contato</li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 mb-2">Informações coletadas automaticamente</h3>
      <ul className="list-disc list-inside space-y-1">
        <li>Endereço IP, tipo de navegador e dispositivo</li>
        <li>Páginas visitadas, tempo de navegação e origem do acesso</li>
      </ul>
    </section>

    <section id="uso-dados" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">3. Como usamos seus dados</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Responder a contatos e solicitações de orçamento</li>
        <li>Fornecer e melhorar nossos serviços</li>
        <li>Enviar comunicações relevantes (com seu consentimento)</li>
        <li>Cumprir obrigações legais e contratuais</li>
      </ul>
    </section>

    <section id="compartilhamento" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">4. Compartilhamento de dados</h2>
      <p>Não vendemos seus dados. Podemos compartilhar informações com fornecedores de tecnologia que nos apoiam (hospedagem, análise, e-mail), sempre sob contrato e em conformidade com a LGPD.</p>
    </section>

    <section id="cookies" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">5. Cookies e tecnologias similares</h2>
      <p>Utilizamos cookies para melhorar sua experiência, lembrar preferências e exibir anúncios personalizados.</p>
      <h3 className="text-lg font-semibold mt-6 mb-2">Tipos de cookies utilizados</h3>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Essenciais:</strong> necessários para o funcionamento do site</li>
        <li><strong>Desempenho:</strong> ajudam a entender como você navega para melhorar o serviço</li>
        <li><strong>Funcionais:</strong> lembram suas preferências</li>
        <li><strong>Publicidade:</strong> usados para exibir anúncios relevantes</li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 mb-2">Como gerenciar</h3>
      <p>Você pode aceitar, recusar ou apagar cookies pelas configurações do seu navegador. Ao continuar navegando, você concorda com o uso conforme esta Política.</p>
    </section>

    <section id="direitos" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">6. Seus direitos (LGPD)</h2>
      <p>Como titular dos dados, você pode solicitar:</p>
      <ul className="list-disc list-inside space-y-1 mt-2">
        <li>Confirmação da existência de tratamento</li>
        <li>Acesso, correção ou exclusão de dados</li>
        <li>Portabilidade a outro fornecedor</li>
        <li>Revogação do consentimento</li>
      </ul>
      <p className="mt-3">Use o formulário ao final desta página para exercer seus direitos.</p>
    </section>

    <section id="seguranca" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">7. Segurança da informação</h2>
      <p>Adotamos medidas técnicas e administrativas adequadas para proteger seus dados contra acessos não autorizados, perda, alteração ou divulgação indevida.</p>
    </section>

    <section id="retencao" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">8. Retenção de dados</h2>
      <p>Mantemos seus dados pelo tempo necessário ao atendimento das finalidades descritas, ou conforme exigido por obrigações legais.</p>
    </section>

    <section id="contato" className="scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4">9. Como falar conosco</h2>
      <p>Dúvidas sobre esta Política podem ser enviadas para nosso encarregado de dados pelo e-mail de contato disponibilizado no site.</p>
    </section>

    <LgpdRequestForm />
  </LegalLayout>
);

export default PoliticaPrivacidade;