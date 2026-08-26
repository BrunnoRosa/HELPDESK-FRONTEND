import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import './style.css';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTicket() {
      try {
        const response = await api.get(`/tickets/${id}`);
        setTicket(response.data);
      } catch (error) {
        alert('Chamado não encontrado');
        navigate('/');
      } finally {
        setLoading(false);
      }
    }
    loadTicket();
  }, [id, navigate]);

  // Função dinâmica para escalonar para qualquer nível
  const handleEscalate = async (nextLevel) => {
    if (!window.confirm(`Tem certeza que deseja escalonar para ${nextLevel}?`)) return;
    
    try {
      await api.patch(`/tickets/${id}/escalate`, { level: nextLevel });
      alert(`Chamado escalonado para ${nextLevel}!`);
      // Atualiza o estado local para refletir a mudança sem precisar recarregar a página
      setTicket((prev) => ({ ...prev, supportLevel: nextLevel }));
    } catch (error) {
      alert('Erro ao escalonar o chamado.');
    }
  };

  // Função para resolver/fechar o chamado
  const handleResolve = async () => {
    if (!window.confirm('Confirmar resolução deste chamado?')) return;

    try {
      await api.patch(`/tickets/${id}/resolve`);
      alert('Chamado resolvido com sucesso!');
      setTicket((prev) => ({ ...prev, status: 'Resolvido' }));
    } catch (error) {
      alert('Erro ao resolver o chamado.');
    }
  };

  if (loading) return <p className="loading-message">Carregando detalhes do chamado...</p>;
  if (!ticket) return null;

  return (
    <div className="details-container">
      <div className="details-main">
        {/* CABEÇALHO DO CHAMADO */}
        <div className="ticket-header">
          <h2>{ticket.title}</h2>
          <span className={`badge priority-${ticket.priority?.toLowerCase()}`}>
            Prioridade: {ticket.priority} {/* Ex: Alta, Média, Baixa */}
          </span>
        </div>

        {/* DESCRIÇÃO E DADOS TÉCNICOS */}
        <div className="ticket-section">
          <h3>Descrição do Incidente</h3>
          <p className="details-desc">{ticket.description}</p>
        </div>

        {/* EVIDÊNCIAS FOTOGRÁFICAS (Req. 2 e 9) */}
        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="ticket-section">
            <h3>Evidências (Fotos)</h3>
            <div className="evidence-gallery">
              {ticket.attachments.map((foto, index) => (
                <img key={index} src={foto.url} alt={`Evidência ${index + 1}`} className="evidence-img" />
              ))}
            </div>
          </div>
        )}

        {/* HISTÓRICO DE ATENDIMENTO (Req. 2) */}
        <div className="ticket-section history-section">
          <h3>Histórico de Atendimento</h3>
          <ul>
            {ticket.history?.map((log, index) => (
              <li key={index}>
                <strong>{new Date(log.date).toLocaleString()}</strong> - {log.user}: {log.action}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="details-sidebar">
        {/* INFORMAÇÕES GERAIS */}
        <div className="info-box">
          <h3>Detalhes</h3>
          <p><strong>Status:</strong> <span className="status-text">{ticket.status}</span></p>
          <p><strong>Nível Atual:</strong> {ticket.supportLevel}</p>
          <hr />
          
          {/* IDENTIFICAÇÃO DO SOLICITANTE (Req. 9) */}
          <p><strong>Solicitante:</strong> {ticket.requesterName}</p>
          <p><strong>Empresa/Setor:</strong> {ticket.company}</p>
          <hr />

          {/* INFORMAÇÕES DO EQUIPAMENTO (Req. 9) */}
          <p><strong>Equipamento:</strong> {ticket.equipment?.name}</p>
          <p><strong>Patrimônio/Tag:</strong> {ticket.equipment?.tag}</p>
        </div>

        {/* AÇÕES DE ATENDIMENTO (Req. 10) */}
        {ticket.status !== 'Resolvido' && (
          <div className="actions-box">
            <h3>Ações</h3>
            
            {/* Botão de Resolver (Todos os níveis podem resolver) */}
            <button onClick={handleResolve} className="btn-resolve">
              Marcar como Resolvido
            </button>

            {/* Escalonamento N1 -> N2 */}
            {user?.role === 'N1' && ticket.supportLevel === 'N1' && (
              <button onClick={() => handleEscalate('N2')} className="btn-escalate">
                Escalonar para N2 (Especializado)
              </button>
            )}

            {/* Escalonamento N2 -> N3 */}
            {user?.role === 'N2' && ticket.supportLevel === 'N2' && (
              <button onClick={() => handleEscalate('N3')} className="btn-escalate">
                Escalonar para N3 (Engenharia)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}