import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Protected({ children }) {
  const { signed, loading } = useAuth();

  // Enquanto o contexto descobre se o usuário tá salvo no navegador, mostra uma telinha de loading
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h2>Carregando sistema...</h2>
      </div>
    );
  }

  // Se não estiver logado, redireciona para a tela de login
  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, libera o acesso para a tela que ele quer ver
  return children;
}