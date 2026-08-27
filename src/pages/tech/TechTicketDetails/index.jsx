import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './style.css';

export default function TechTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [novoComentario, setNovoComentario] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setTicket({
        id: id,
        titulo: "Erro 500 no ERP",
        prioridade: "Alto",
        descricao: "Sistema trava completamente após inserir a senha e apertar Enter.",
        status: "Aberto",
        nivelSuporte: "N1",
        solicitante: "Maria Souza",
        empresa: "Tech Corp - Setor Financeiro",
        equipamento: { nome: "Desktop Dell Optiplex", patrimonio: "004512" },
        historico: [
          { data: "26/08/2026 09:00", usuario: "Sistema", acao: "Chamado aberto." }
        ]
      });
    }, 400);
  }, [id]);

  const handleEscalar = (proximoNivel) => {
    if (!window.confirm(`Escalonar para ${proximoNivel}?`)) return;
    setTicket(prev => ({
      ...prev,
      nivelSuporte: proximoNivel,
      historico: [...prev.historico, { data: new Date().toLocaleString(), usuario: user.name, acao: `Escalonado para ${proximoNivel}` }]
    }));
  };

  const handleResolver = () => {
    if (!window.confirm('Resolver chamado?')) return;
    setTicket(prev => ({
      ...prev,
      status: "Resolvido",
      historico: [...prev.historico, { data: new Date().toLocaleString(), usuario: user.name, acao: "Chamado resolvido." }]
    }));
  };

  const addComentario = () => {
    if (!novoComentario) return;
    setTicket(prev => ({
      ...prev,
      historico: [...prev.historico, { data: new Date().toLocaleString(), usuario: user.name, acao: novoComentario }]
    }));
    setNovoComentario('');
  };

  if (!ticket) return <p className="loading-text">Carregando...</p>;

  return (
    <div className="ticket-details-page">
      <div className="header-actions">
        <button onClick={() => navigate('/')} className="btn-voltar">← Voltar</button>
        <h2>Chamado #{ticket.id} - {ticket.titulo}</h2>
      </div>

      <div className="details-grid">
        <div className="main-content">
          <div className="card">
            <h3>Descrição e Evidências</h3>
            <p>{ticket.descricao}</p>
            <div className="evidence-box">
              <p className="evidence-title">print_erro_500.png</p>
              <div className="evidence-img-placeholder">[Imagem do Erro Anexada]</div>
            </div>
          </div>

          <div className="card">
            <h3>Histórico de Atendimento</h3>
            <ul className="timeline">
              {ticket.historico.map((log, i) => (
                <li key={i}><strong>{log.data}</strong> - {log.usuario}: {log.acao}</li>
              ))}
            </ul>
            {ticket.status !== 'Resolvido' && (
              <div className="add-comment">
                <input 
                  type="text" 
                  value={novoComentario} 
                  onChange={e => setNovoComentario(e.target.value)} 
                  placeholder="Adicionar nota de atendimento..."
                />
                <button onClick={addComentario}>Enviar</button>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-content">
          <div className="card info-card">
            <h3>Informações Gerais</h3>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Nível Atual:</strong> {ticket.nivelSuporte}</p>
            <p><strong>Prioridade:</strong> <span className={`badge-prio ${ticket.prioridade.toLowerCase()}`}>{ticket.prioridade}</span></p>
            <hr/>
            <p><strong>Cliente:</strong> {ticket.solicitante}</p>
            <p><strong>Empresa:</strong> {ticket.empresa}</p>
            <p><strong>Equipamento:</strong> {ticket.equipamento.nome} ({ticket.equipamento.patrimonio})</p>
          </div>

          {ticket.status !== 'Resolvido' && (
            <div className="card action-card">
              <h3>Ações de Suporte</h3>
              <button onClick={handleResolver} className="btn-resolver">Marcar como Resolvido</button>
              
              {user?.role === 'N1' && ticket.nivelSuporte === 'N1' && (
                <button onClick={() => handleEscalar('N2')} className="btn-escalar">Escalonar para N2 (Especializado)</button>
              )}
              {user?.role === 'N2' && ticket.nivelSuporte === 'N2' && (
                <button onClick={() => handleEscalar('N3')} className="btn-escalar">Escalonar para N3 (Engenharia)</button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}