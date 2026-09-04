import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './style.css';

export default function Sidebar() {
  // 1. ACRESCENTADO: Puxamos a função logout do contexto
  const { user, logout } = useAuth();
  const location = useLocation();

  const isTech = user?.role === 'N1' || user?.role === 'N2' || user?.role === 'N3' || user?.role === 'admin';

  return (
    <aside className="sidebar">
      {/* Cabeçalho / Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>
        <div>
          <h2>GLPI Desk</h2>
          <span>IT Service Management</span>
        </div>
      </div>

      {/* Navegação */}
      <nav className="sidebar-nav">
        <span className="nav-label">Menu Principal</span>
        
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Dashboard
        </Link>

        {!isTech && (
          <Link to="/cliente/novo-chamado" className={`nav-item ${location.pathname === '/cliente/novo-chamado' ? 'active' : ''}`}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Novo Chamado
          </Link>
        )}

        {(user?.role === 'N2' || user?.role === 'N3' || user?.role === 'admin') && (
          <Link to="/tecnico/relatorios" className={`nav-item ${location.pathname === '/tecnico/relatorios' ? 'active' : ''}`}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
            </svg>
            Relatórios e SLA
          </Link>
        )}

        <span className="nav-label" style={{ marginTop: '1.5rem' }}>Configurações</span>

        <Link to="/perfil" className={`nav-item ${location.pathname === '/perfil' ? 'active' : ''}`}>
          <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Meu Perfil
        </Link>
      </nav>

      {/* Rodapé com identificação e Logout */}
      <div className="sidebar-footer">
        {/* 2. ACRESCENTADO: Uma div wrapper para agrupar avatar e textos */}
        <div className="user-profile-wrapper">
          <div className="user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Usuário'}</span>
            <span className="user-role">{user?.role || 'CLIENTE'}</span>
          </div>
        </div>

        {/* 3. ACRESCENTADO: Botão de sair com ícone */}
        <button onClick={logout} className="btn-sidebar-logout" title="Sair do sistema">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </aside>
  );
}