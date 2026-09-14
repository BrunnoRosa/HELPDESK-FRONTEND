import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chamadoApi, adminApi, atendimentoApi } from '../../../services/api';
import Notification from '../../../components/Notification';
import './style.css';

export default function AdminTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [chamado, setChamado] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  
  const [editData, setEditData] = useState({ status: '', prioridade: '', nivelSuporte: '', tecnicoId: '' });

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      const [chamadoRes, tecnicosRes, atendimentosRes] = await Promise.all([
        chamadoApi.buscar(id),
        adminApi.listarTecnicos(),
        atendimentoApi.buscarPorChamado(id).catch(() => [])
      ]);
      
      setChamado(chamadoRes);
      setTecnicos(tecnicosRes);
      setAtendimentos(Array.isArray(atendimentosRes) ? atendimentosRes : []);
      
      setEditData({
        status: chamadoRes.statusChamado || '',
        prioridade: chamadoRes.prioridadeChamado || '',
        nivelSuporte: chamadoRes.nivelSuporte || '',
        tecnicoId: chamadoRes.tecnicoResponsavel?.id || ''
      });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Erro ao carregar dados do chamado.' });
      navigate('/admin');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    try {
      await chamadoApi.atualizar(id, editData);
      setFeedback({ type: 'success', message: 'Chamado atualizado com sucesso pela Administração!' });
      carregarDados();
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Erro ao atualizar chamado.' });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('ATENÇÃO: Deseja EXCLUIR este chamado? Ação irreversível.')) {
      try {
        await chamadoApi.deletar(id);
        navigate('/admin');
      } catch (error) {
        setFeedback({ type: 'error', message: error.message || 'Erro ao excluir o chamado.' });
      }
    }
  };

  const formatarTexto = (texto) => {
    if (!texto) return '';
    return texto.replace(/[•●*\s]+/g, ' ').replace(/_/g, ' ').trim();
  };

  if (!chamado) return <div className="loading-state">Carregando...</div>;

  return (
    <div className="admin-ticket-container">
      <div className="admin-ticket-header">
        <div className="admin-ticket-title-group">
          <h2>Chamado #{chamado.id}</h2>
          <span className={`badge badge-${chamado.statusChamado?.toLowerCase() || 'gray'}`}>
            {formatarTexto(chamado.statusChamado)}
          </span>
        </div>
        <button className="btn-danger" onClick={handleDelete}>Excluir Chamado</button>
      </div>

      {feedback.message && <Notification type={feedback.type} message={feedback.message} />}
      
      <div className="admin-ticket-grid">
        <div className="admin-ticket-main">
          <div className="admin-card">
            <h3 className="admin-card-title">Detalhes da Solicitação</h3>
            <div className="admin-card-content">
              <p><strong>Título:</strong> {chamado.tituloChamado}</p>
              <p><strong>Solicitante:</strong> {chamado.solicitante?.nome || 'Não informado'}</p>
              <p><strong>Descrição:</strong></p>
              <div className="description-box">{chamado.descricaoChamado}</div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="admin-card-title">Linha do Tempo (Atendimentos)</h3>
            {atendimentos.length === 0 ? (
              <p className="empty-text">Nenhuma interação registrada ainda.</p>
            ) : (
              <div className="timeline">
                {atendimentos.map(atd => (
                  <div key={atd.id} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <span className="timeline-date">{new Date(atd.dataCriacao).toLocaleString()}</span>
                      <p className="timeline-author">{atd.autor?.nome || 'Sistema'}</p>
                      <p className="timeline-text">{atd.mensagem}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="admin-ticket-sidebar">
          <div className="admin-card">
            <h3 className="admin-card-title">Intervenção Administrativa</h3>
            <form onSubmit={handleUpdate} className="admin-form-vertical">
              <div className="form-group">
                <label>Forçar Status:</label>
                <select 
                  value={editData.status} 
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                >
                  <option value="ABERTO">Aberto</option>
                  <option value="EM_TRIAGEM">Em Triagem</option>
                  <option value="EM_ATENDIMENTO">Em Atendimento</option>
                  <option value="EM_ANDAMENTO">Em Andamento</option>
                  <option value="AGUARDANDO_CLIENTE">Aguardando Cliente</option>
                  <option value="RESOLVIDO">Resolvido</option>
                  <option value="FECHADO">Fechado</option>
                </select>
              </div>

              <div className="form-group">
                <label>Prioridade:</label>
                <select 
                  value={editData.prioridade} 
                  onChange={(e) => setEditData({...editData, prioridade: e.target.value})}
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                  <option value="URGENTE">Urgente</option>
                </select>
              </div>

              <div className="form-group">
                <label>Fila (Nível):</label>
                <select 
                  value={editData.nivelSuporte} 
                  onChange={(e) => setEditData({...editData, nivelSuporte: e.target.value})}
                >
                  <option value="N1">N1 - Triagem e Básico</option>
                  <option value="N2">N2 - Especializado</option>
                  <option value="N3">N3 - Engenharia</option>
                </select>
              </div>

              <div className="form-group">
                <label>Atribuição Direta:</label>
                <select 
                  value={editData.tecnicoId} 
                  onChange={(e) => setEditData({...editData, tecnicoId: e.target.value})}
                >
                  <option value="">Desatribuir (Fila Geral)</option>
                  {tecnicos.map(tec => (
                    <option key={tec.id} value={tec.id}>{tec.nome} ({tec.nivelSuporte})</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn-primary-block">Aplicar Intervenção</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}