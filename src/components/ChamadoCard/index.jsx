import { Link } from 'react-router-dom';
import './style.css';

export default function ChamadoCard({ ticket }) {
  // Função para formatar a data mantida para consistência de exibição
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <article className="chamado-card">
      <div className="chamado-card__top">
        <span className="chamado-card__id">#{ticket.id}</span>
        <span className={`status-badge status-${ticket.status?.toLowerCase() || 'aberto'}`}>
          {ticket.status || 'ABERTO'}
        </span>
      </div>
      
      <h3 title={ticket.title}>{ticket.title}</h3>
      
      {/* Exibe a descrição caso exista, ou fallback para o solicitante (padrão antigo) */}
      <p className="chamado-card__desc">
        {ticket.description || `Solicitante: ${ticket.requester?.name || 'Não informado'}`}
      </p>
      
      <div className="chamado-card__meta">
        <span className={`priority-text priority-${ticket.priority?.toLowerCase()}`}>
          {ticket.priority || 'Normal'}
        </span>
        <span className="level-badge">{ticket.supportLevel || 'N1'}</span>
        <span className="card-date">{formatDate(ticket.createdAt)}</span>
      </div>
      
      <Link className="chamado-card__link" to={`/ticket/${ticket.id}`}>
        Ver Detalhes
      </Link>
    </article>
  );
}