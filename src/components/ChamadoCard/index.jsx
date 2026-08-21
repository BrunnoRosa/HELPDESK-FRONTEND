import { useNavigate } from 'react-router-dom';
import './style.css';

export default function ChamadoCard({ ticket }) {
  const navigate = useNavigate();

  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="chamado-card">
      <div className="card-header">
        <h4 className="card-title" title={ticket.title}>
          #{ticket.id} - {ticket.title}
        </h4>
        <span className={`status-badge status-${ticket.status?.toLowerCase() || 'aberto'}`}>
          {ticket.status || 'ABERTO'}
        </span>
      </div>

      <div className="card-body">
        <p><strong>Solicitante:</strong> {ticket.requester?.name || 'Não informado'}</p>
        <p>
          <strong>Prioridade:</strong> 
          <span className={`priority-text priority-${ticket.priority?.toLowerCase()}`}>
            {ticket.priority || 'Normal'}
          </span>
        </p>
        <p><strong>Nível de Suporte:</strong> <span className="level-badge">{ticket.supportLevel || 'N1'}</span></p>
      </div>

      <div className="card-footer">
        <span className="card-date">Criado em: {formatDate(ticket.createdAt)}</span>
        <button 
          className="btn-details"
          onClick={() => navigate(`/ticket/${ticket.id}`)}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}