import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api'; 
import { useAuth } from '../../contexts/AuthContext';
import './style.css'; 

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTickets();
  }, [user, navigate]);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // Função adaptada para retornar as classes do nosso CSS
  const getPriorityClass = (priority) => {
    const classes = {
      BAIXA: 'priority-baixa',
      MEDIA: 'priority-media',
      ALTA: 'priority-alta',
      CRITICA: 'priority-critica',
    };
    return classes[priority] || 'priority-baixa';
  };

  return (
    <div className="dashboard-container">
      {/* Cabeçalho - No futuro, moveremos isso para o componente de Layout! */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo-title">GLPI Desk</h1>
          <span className="user-role">{user?.role}</span>
        </div>
        <div className="header-right">
          <span className="user-name">{user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="main-header">
          <div>
            <h2 className="page-title">Painel de Chamados</h2>
            <p className="page-subtitle">Gestão e acompanhamento de incidentes</p>
          </div>
          <Link to="/novo-chamado" className="btn-new-ticket">
            + Registrar Novo Chamado
          </Link>
        </div>

        {loading ? (
          <div className="loading">Carregando chamados...</div>
        ) : (
          <div className="table-container">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Solicitante</th>
                  <th>Prioridade</th>
                  <th>Nível</th>
                  <th>Status</th>
                  <th className="text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="font-medium">{t.title}</td>
                    <td className="text-muted">{t.requester?.name}</td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(t.priority)}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="font-semibold">{t.supportLevel}</td>
                    <td className="text-blue">{t.status}</td>
                    <td className="text-right">
                      <Link to={`/chamados/${t.id}`} className="btn-details">
                        Detalhes →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}