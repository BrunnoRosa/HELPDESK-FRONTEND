import React from 'react';
import './style.css';

const LABELS = {
  ABERTO: 'Aberto',
  EM_TRIAGEM: 'Em Triagem',
  EM_ATENDIMENTO: 'Em Atendimento',
  PENDENTE_EVIDENCIA: 'Pendente Evidência',
  RESOLVIDO: 'Resolvido',
  FECHADO: 'Fechado'
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  
  const normalizedStatus = String(status).toUpperCase();
  const badgeClass = normalizedStatus.toLowerCase().replace('_', '-');

  return (
    <span className={`status-badge status-badge--${badgeClass}`}>
      {LABELS[normalizedStatus] || status}
    </span>
  );
}