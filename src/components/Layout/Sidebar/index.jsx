import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './style.css';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  // Verifica se o usuário é técnico
  const isTech = user?.role === 'N1' || user?.role === 'N2' || user?.role === 'N3';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>GLPI Desk</h2>
        <span>IT Service Management</span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">MENU PRINCIPAL</span>
        
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          Dashboard
        </Link>

        {/* Clientes veem a opção de abrir chamados */}
        {!isTech && (
          <Link to="/cliente/novo-chamado" className={`nav-item ${location.pathname === '/cliente/novo-chamado' ? 'active' : ''}`}>
            Novo Chamado
          </Link>
        )}

        {/* Apenas Técnicos N2 e N3 veem a área de relatórios e SLAs */}
        {(user?.role === 'N2' || user?.role === 'N3') && (
          <Link to="/tecnico/relatorios" className={`nav-item ${location.pathname === '/tecnico/relatorios' ? 'active' : ''}`}>
            Relatórios e SLA
          </Link>
        )}
      </nav>
    </aside>
  );
}