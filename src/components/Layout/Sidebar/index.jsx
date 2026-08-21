import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './style.css';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation(); // Ajuda a saber em qual tela estamos para pintar o menu ativo

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>GLPI Desk</h2>
        <span>IT Service Management</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">MENU PRINCIPAL</span>
        
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          Dashboard
        </Link>

        {/* Todos podem abrir chamados, mas no futuro você pode restringir se quiser */}
        <Link 
          to="/novo-chamado" 
          className={`nav-item ${location.pathname === '/novo-chamado' ? 'active' : ''}`}
        >
          Novo Chamado
        </Link>

        {/* Exemplo de menu restrito: Apenas N2 e N3 veem a área de relatórios/gestão */}
        {(user?.role === 'N2' || user?.role === 'N3') && (
          <Link 
            to="/relatorios" 
            className={`nav-item ${location.pathname === '/relatorios' ? 'active' : ''}`}
          >
            Relatórios e SLA
          </Link>
        )}
      </nav>
    </aside>
  );
}