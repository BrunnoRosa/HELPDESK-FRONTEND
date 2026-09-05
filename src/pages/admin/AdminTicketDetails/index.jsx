import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { chamadoApi, adminApi } from '../../../services/api';
import './style.css';

export default function AdminTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [chamado, setChamado] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  
  // Estados para edição forçada
  const [editData, setEditData] = useState({
    status: '',
    prioridade: '',
    nivelSuporte: '',
    tecnicoId: ''
  });

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      // Busca o chamado e a lista de técnicos para o dropdown de reatribuição
      const [chamadoRes, tecnicosRes] = await Promise.all([
        chamadoApi.buscar(id),
        adminApi.listarTecnicos()
      ]);
      
      setChamado(chamadoRes);
      setTecnicos(tecnicosRes);
      
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
      // Envia a atualização forçada ignorando restrições comuns
      await chamadoApi.atualizar(id, editData);
      alert('Chamado atualizado com sucesso pela Administração!');
      carregarDados(); // Recarrega para mostrar os dados novos
    } catch (error) {
      alert(error.message || 'Erro ao atualizar chamado.');
    }
  };

  const handleDelete = async () => {
    const confirmacao = window.confirm('ATENÇÃO: Tem certeza que deseja EXCLUIR este chamado permanentemente? Essa ação não pode ser desfeita.');
    
    if (confirmacao) {
      try {
        await chamadoApi.deletar(id);
        alert('Chamado excluído com sucesso.');
        navigate('/admin');
      } catch (error) {
        alert(error.message || 'Erro ao excluir o chamado.');
      }
    }
  };

  if (!chamado) return <div className="admin-ticket-container"><p>Carregando...</p></div>;

  return (
    <div className="admin-ticket-container">
      <header className="ticket-header">
        <h2>Painel de Controle do Chamado #{chamado.id}</h2>
        <button className="btn-danger" onClick={handleDelete}>Excluir Chamado</button>
      </header>
      
      <div className="ticket-info">
        <p><strong>Título:</strong> {chamado.tituloChamado}</p>
        <p><strong>Solicitante:</strong> {chamado.solicitante?.nome}</p>
        <p><strong>Descrição:</strong> {chamado.descricaoChamado}</p>
      </div>

      <section className="admin-section">
        <h3>Intervenção Administrativa</h3>
        <form onSubmit={handleUpdate} className="admin-form">
          
          <label>Forçar Status:</label>
          <select value={editData.status} onChange={(e) => setEditData({...editData, status: e.target.value})}>
            <option value="ABERTO">Aberto</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="AGUARDANDO_CLIENTE">Aguardando Cliente</option>
            <option value="RESOLVIDO">Resolvido</option>
            <option value="FECHADO">Fechado (Finalizado)</option>
          </select>

          <label>Alterar Prioridade:</label>
          <select value={editData.prioridade} onChange={(e) => setEditData({...editData, prioridade: e.target.value})}>
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="URGENTE">Urgente</option>
          </select>

          <label>Escalonamento (Nível de Suporte):</label>
          <select value={editData.nivelSuporte} onChange={(e) => setEditData({...editData, nivelSuporte: e.target.value})}>
            <option value="N1">N1 - Triagem e Básico</option>
            <option value="N2">N2 - Especializado</option>
            <option value="N3">N3 - Engenharia</option>
          </select>

          <label>Reatribuir Técnico:</label>
          <select value={editData.tecnicoId} onChange={(e) => setEditData({...editData, tecnicoId: e.target.value})}>
            <option value="">Desatribuir (Fila Geral)</option>
            {tecnicos.map(tec => (
              <option key={tec.id} value={tec.id}>{tec.nome} ({tec.nivelSuporte})</option>
            ))}
          </select>

          <button type="submit" className="btn-update">Aplicar Intervenção</button>
        </form>
      </section>
    </div>
  );
}