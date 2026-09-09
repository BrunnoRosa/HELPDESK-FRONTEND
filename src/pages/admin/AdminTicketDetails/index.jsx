import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chamadoApi, adminApi, atendimentoApi } from '../../../services/api';
import './style.css';

export default function AdminTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [chamado, setChamado] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  
  const [editData, setEditData] = useState({ status: '', prioridade: '', nivelSuporte: '', tecnicoId: '' });

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      const [chamadoRes, tecnicosRes, atendimentosRes] = await Promise.all([
        chamadoApi.buscar(id),
        adminApi.listarTecnicos(),
        atendimentoApi.buscarPorChamado(id).catch(() => []) // Evita quebrar se não houver endpoint ainda
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
      alert('Erro ao carregar dados do chamado.');
      navigate('/admin');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await chamadoApi.atualizar(id, editData);
      alert('Chamado atualizado com sucesso pela Administração!');
      carregarDados();
    } catch (error) {
      alert(error.message || 'Erro ao atualizar chamado.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('ATENÇÃO: Deseja EXCLUIR este chamado? Ação irreversível.')) {
      try {
        await chamadoApi.deletar(id);
        navigate('/admin');
      } catch (error) {
        alert(error.message || 'Erro ao excluir o chamado.');
      }
    }
  };

  if (!chamado) return <div className="loading-state">Carregando...</div>;

  return (
    <div className="ticket-detail-container">
      <div className="ticket-header-bar">
        <div>
          <h2>Chamado #{chamado.id}</h2>
          <span className={`badge badge-${chamado.statusChamado?.toLowerCase()}`}>{chamado.statusChamado}</span>
        </div>
        <button className="btn-danger" onClick={handleDelete}>Excluir Chamado</button>
      </div>
      
      <div className="ticket-grid">
        <div className="ticket-main">
          <div className="white-panel mb-4">
            <h3>Detalhes da Solicitação</h3>
            <p><strong>Título:</strong> {chamado.tituloChamado}</p>
            <p><strong>Solicitante:</strong> {chamado.solicitante?.nome}</p>
            <p><strong>Descrição:</strong></p>
            <div className="description-box">{chamado.descricaoChamado}</div>
          </div>

          <div className="white-panel timeline-panel">
            <h3>Linha do Tempo (Atendimentos)</h3>
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

        <aside className="ticket-sidebar">
          <div className="white-panel">
            <h3>Intervenção Administrativa</h3>
            <form onSubmit={handleUpdate} className="admin-form">
              <label>Forçar Status:</label>
              <select value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value})}>
                <option value="ABERTO">Aberto</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
                <option value="AGUARDANDO_CLIENTE">Aguardando Cliente</option>
                <option value="RESOLVIDO">Resolvido</option>
                <option value="FECHADO">Fechado</option>
              </select>

              <label>Prioridade:</label>
              <select value={editData.prioridade} onChange={(e) => setEditData({...editData, prioridade: e.target.value})}>
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
                <option value="URGENTE">Urgente</option>
              </select>

              <label>Fila (Nível):</label>
              <select value={editData.nivelSuporte} onChange={(e) => setEditData({...editData, nivelSuporte: e.target.value})}>
                <option value="N1">N1 - Triagem e Básico</option>
                <option value="N2">N2 - Especializado</option>
                <option value="N3">N3 - Engenharia</option>
              </select>

              <label>Atribuição Direta:</label>
              <select value={editData.tecnicoId} onChange={(e) => setEditData({...editData, tecnicoId: e.target.value})}>
                <option value="">Desatribuir (Fila Geral)</option>
                {tecnicos.map(tec => (
                  <option key={tec.id} value={tec.id}>{tec.nome} ({tec.nivelSuporte})</option>
                ))}
              </select>

              <button type="submit" className="btn-primary" style={{marginTop: '1.5rem'}}>Aplicar Intervenção</button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}