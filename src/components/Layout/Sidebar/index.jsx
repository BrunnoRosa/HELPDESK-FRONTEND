import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './style.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(() => window.innerWidth > 900);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsOpen(window.innerWidth > 900);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estado para controlar o Tema (Light/Dark)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Aplica o tema no atributo global data-theme da tag <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    if (user?.email) {
      const savedAvatar = localStorage.getItem(`user_avatar_${user.email}`);
      setAvatarUrl(savedAvatar);
    }
  }, [user?.email, location.pathname]);

  const isTech = user?.role === 'TECNICO' || user?.role === 'ADMINISTRADOR';

  const getDashboardRoute = () => {
    if (user?.role === 'ADMINISTRADOR') return '/admin';
    if (user?.role === 'TECNICO') return '/tecnico';
    return '/';
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const dashboardRoute = getDashboardRoute();

  return (
    <>
      {/* Barra superior fixa com Botão + Logo + Alternador de Tema */}
      <header className="sidebar-top-header">
        <button 
          className="sidebar-toggle-btn" 
          onClick={() => setIsOpen(!isOpen)}
          title={isOpen ? "Recolher menu" : "Expandir menu"}
          aria-label="Alternar menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div className="header-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="logo-text">
            <h2>GLPI Desk</h2>
            <span>IT Service Management</span>
          </div>
        </div>

        {/* Botão de alternar tema com Ícones SVG (Lua / Sol) */}
        <button 
          onClick={toggleTheme} 
          className="sidebar-toggle-btn theme-toggle-btn" 
          title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
          aria-label="Alternar tema"
        >
          {theme === 'light' ? (
            /* Ícone de Lua */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            /* Ícone de Sol */
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          )}
        </button>
      </header>

      {/* Menu Lateral Deslizante */}
      <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <nav className="sidebar-nav">
          <span className="nav-label">Menu Principal</span>
          
          <Link to={dashboardRoute} className={`nav-item ${location.pathname === dashboardRoute ? 'active' : ''}`}>
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

          {user?.role === 'ADMINISTRADOR' && (
            <>
              <Link to="/admin/usuarios" className={`nav-item ${location.pathname === '/admin/usuarios' ? 'active' : ''}`}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Gestão de Usuários
              </Link>

              <Link to="/tecnico/relatorios" className={`nav-item ${location.pathname === '/tecnico/relatorios' ? 'active' : ''}`}>
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                </svg>
                Relatórios e SLA
              </Link>
            </>
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
          <div className="user-profile-wrapper">
            <div className="user-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Foto do usuário" className="sidebar-avatar-img" />
              ) : (
                getUserInitials(user?.name)
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Usuário'}</span>
              <span className="user-role">{user?.role || 'USUARIO'}</span>
            </div>
          </div>

          <button 
            onClick={logout} 
            className="btn-sidebar-logout" 
            title="Sair do sistema"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}