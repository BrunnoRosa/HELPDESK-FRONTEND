import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './style.css';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    async function loadTicket() {
      try {
        const response = await api.get(`/tickets/${id}`);
        setTicket(response.data);
      } catch (error) {
        alert('Chamado não encontrado');
        navigate('/');
      }
    }
    loadTicket();
  }, [id, navigate]);

  const handleEscalate = async () => {
    try {
      await api.patch(`/tickets/${id}/escalate`, { level: 'N2' });
      alert('Chamado escalonado para N2!');
      // Atualizar dados localmente ou recarregar
    } catch (error) {
      alert('Erro ao escalonar');
    }
  };

  if (!ticket) return <p>Carregando detalhes...</p>;

  return (
    <div className="details-container">
      <div className="details-main">
        <h2>{ticket.title}</h2>
        <p className="details-desc">{ticket.description}</p>
      </div>
      <div className="details-sidebar">
        <div className="info-box">
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Nível Atual:</strong> {ticket.supportLevel}</p>
          {user?.role === 'N1' && (
            <button onClick={handleEscalate} className="btn-escalate">
              Escalonar para N2
            </button>
          )}
        </div>
      </div>
    </div>
  );
}