import { useAuth } from '../../../context/AuthContext';
import './style.css';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="main-header">
      <div className="header-breadcrumbs">
        {/* Aqui podemos colocar o título dinâmico depois, por enquanto um texto fixo */}
        <h3>Portal de Atendimento</h3>
      </div>

      <div className="header-user-area">
        <div className="user-info">
          <span className="user-name">{user?.name || 'Carregando...'}</span>
          {/* Badge mostrando o nível do usuário */}
          <span className={`role-badge role-${user?.role?.toLowerCase()}`}>
            {user?.role || 'CLIENTE'}
          </span>
        </div>
        
        <button onClick={logout} className="btn-logout">
          Sair
        </button>
      </div>
    </header>
  );
}