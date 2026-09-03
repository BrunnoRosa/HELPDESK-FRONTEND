import { useAuth } from "../../../context/AuthContext";
import './style.css';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="main-header">
      <div className="header-breadcrumbs">
        <h2>Portal de Atendimento</h2>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Olá, <strong>{user?.name || user?.nome || 'Usuário'}</strong>
        </span>
        <span className="user-badge" style={{
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontSize: '0.75rem',
          padding: '2px 8px',
          borderRadius: '12px',
          fontWeight: '600'
        }}>
          {user?.role || user?.perfil || 'CLIENTE'}
        </span>
      </div>
    </header>
  );
}