import React from 'react';
import './style.css';

const LABELS = {
  ABERTO: 'Aberto',
  EM_TRIAGEM: 'Em triagem',
  EM_ATENDIMENTO: 'Em atendimento',
  PENDENTE_EVIDENCIA: 'Pendente evidência',
  RESOLVIDO: 'Resolvido',
  FECHADO: 'Fechado'
};

export default function StatusBadge({ status }) {
  if (!status) return null;
  
  // Normaliza o texto para evitar erros caso a API envie 'Aberto' ou 'ABERTO'
  const normalizedStatus = status.toUpperCase();
  const badgeClass = status.toLowerCase();

  return (
    <span className={`status-badge status-badge--${badgeClass}`}>
      {LABELS[normalizedStatus] || status}
    </span>
  );
}