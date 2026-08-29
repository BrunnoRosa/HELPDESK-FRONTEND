import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function ChamadoCard({ chamado, atendimento, ticket }) {
  // Garantia de compatibilidade: tenta ler da API (chamado) ou do mock antigo (ticket)
  const id = chamado?.id || ticket?.id;
  const titulo = chamado?.tituloChamado || ticket?.title || 'Sem título';
  const descricao = chamado?.descricaoChamado || ticket?.description || `Solicitante: ${ticket?.requester?.name || 'Não informado'}`;
  const status = atendimento?.status || ticket?.status || 'ABERTO';
  const prioridade = chamado?.prioridadeChamado || ticket?.priority || 'Normal';
  const nivel = atendimento?.nivelSuporte || ticket?.supportLevel || 'N1';
  const data = chamado?.dataAbertura || ticket?.createdAt;
  const ocorrencia = chamado?.ocorrenciaChamado || '';

  // Formatação de data preservada do HELPDESK-FRONT
  const formatDate = (dateString) => {
    if (!dateString) return 'Data não informada';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <article className="chamado-card">
      <div className="chamado-card__top">
        <span className="chamado-card__id">#{id}</span>
        {/* Lógica do StatusBadge convertida para CSS nativo do projeto */}
        <span className={`status-badge status-${status.toLowerCase()}`}>
          {status}
        </span>
      </div>
      
      <h3 title={titulo}>{titulo}</h3>
      <p className="chamado-card__desc">{descricao}</p>
      
      <div className="chamado-card__meta">
        {ocorrencia && <span className="meta-tag">{ocorrencia}</span>}
        <span className={`priority-text priority-${prioridade.toLowerCase()}`}>
          {prioridade}
        </span>
        <span className="level-badge">{nivel}</span>
        <span className="card-date">{formatDate(data)}</span>
      </div>
      
      <Link className="chamado-card__link" to={`/ticket/${id}`}>
        Ver Detalhes
      </Link>
    </article>
  );
}