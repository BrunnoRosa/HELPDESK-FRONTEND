import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Ajuste o caminho se necessário
import { useAuth } from '../../contexts/AuthContext'; // Ajuste o caminho se necessário
import './style.css'; // Importação do CSS

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [supportLevel, setSupportLevel] = useState('');
  const [file, setFile] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/tickets/${id}`);
      setTicket(res.data);
      setStatus(res.data.status);
      setSupportLevel(res.data.supportLevel);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/tickets/${id}/status`, {
        status,
        supportLevel,
        comment,
      });
      setComment('');
      fetchTicket();
    } catch (err) {
      alert('Erro ao atualizar chamado');
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post(`/tickets/${id}/attachments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFile(null);
      fetchTicket();
    } catch (err) {
      alert('Erro ao enviar imagem');
    }
  };

  if (!ticket) {
    return <div className="loading-text">Carregando detalhes...</div>;
  }

  return (
    <div className="ticket-details-container">
      <div className="ticket-details-wrapper">
        
        <button onClick={() => navigate('/')} className="btn-back">
          ← Voltar para o Painel
        </button>

        {/* Informações Principais do Chamado */}
        <div className="ticket-card">
          <div className="ticket-header">
            <div>
              <h1 className="ticket-title">{ticket.title}</h1>
              <p className="ticket-requester">
                Solicitado por <strong>{ticket.requester?.name}</strong> ({ticket.requester?.company || 'Sem empresa'})
              </p>
            </div>
            <span className="status-badge">
              {ticket.status}
            </span>
          </div>

          <p className="ticket-description">{ticket.description}</p>

          {ticket.equipment && (
            <div className="equipment-badge">
              📌 Equipamento Vinculado: <strong>{ticket.equipment.name}</strong> (S/N: {ticket.equipment.serialNumber}) - Local: {ticket.equipment.location}
            </div>
          )}

          {/* Controle de Fluxo N1/N2/N3 */}
          {user.role !== 'CLIENTE' && (
            <form onSubmit={handleUpdateStatus} className="update-form-section">
              <h3 className="section-title">Transição de Status & Nível de Suporte</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Status Atual</label>
                  <select
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="ABERTO">ABERTO</option>
                    <option value="EM_TRIAGEM">EM_TRIAGEM</option>
                    <option value="EM_ATENDIMENTO">EM_ATENDIMENTO</option>
                    <option value="PENDENTE_EVIDENCIA">PENDENTE_EVIDENCIA</option>
                    <option value="RESOLVIDO">RESOLVIDO</option>
                    <option value="FECHADO">FECHADO</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Nível Responsável</label>
                  <select
                    className="form-control"
                    value={supportLevel}
                    onChange={(e) => setSupportLevel(e.target.value)}
                  >
                    <option value="N1">Nível 1 (Triagem/Básico)</option>
                    <option value="N2">Nível 2 (Especializado)</option>
                    <option value="N3">Nível 3 (Engenharia/Dev)</option>
                  </select>
                </div>
              </div>

              <textarea
                placeholder="Adicionar parecer técnico ou nota de evolução..."
                className="form-control"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              
              <button type="submit" className="btn-update">
                Atualizar Estado
              </button>
            </form>
          )}
        </div>

        {/* Anexos de Evidência Fotográfica */}
        <div className="ticket-card">
          <h3 className="section-title">Evidências Fotográficas</h3>
          
          <div className="attachments-grid">
            {ticket.attachments?.map((att) => (
              <a
                key={att.id}
                href={`http://localhost:3333/uploads/${att.filename}`}
                target="_blank"
                rel="noreferrer"
                className="attachment-item"
              >
                <img
                  src={`http://localhost:3333/uploads/${att.filename}`}
                  alt="Evidência"
                  className="attachment-img"
                />
                <span className="attachment-name">{att.filename}</span>
              </a>
            ))}
          </div>

          <form onSubmit={handleFileUpload} className="upload-form">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="upload-input"
            />
            <button type="submit" className="btn-upload">
              Enviar Foto
            </button>
          </form>
        </div>

        {/* Histórico Auditável */}
        <div className="ticket-card">
          <h3 className="section-title">Histórico do Chamado</h3>
          
          <div className="history-list">
            {ticket.histories?.map((h) => (
              <div key={h.id} className="history-item">
                <div className="history-header">
                  <span className="history-author">{h.author?.name} (Nível {h.supportLevel})</span>
                  <span>{new Date(h.createdAt).toLocaleString('pt-BR')}</span>
                </div>
                <p className="history-message">{h.message}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}