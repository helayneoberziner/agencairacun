import { Navigate } from 'react-router-dom';

// Página de Contato unificada com Sobre. Redireciona para /sobre#contato.
const Contato = () => <Navigate to="/sobre#contato" replace />;

export default Contato;
