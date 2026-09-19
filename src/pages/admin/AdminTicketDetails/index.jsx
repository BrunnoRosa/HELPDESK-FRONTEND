import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { chamadoApi, adminApi, atendimentoApi } from '../../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css'; // Certifique-se de adicionar os estilos da modal abaixo

// Componente Modal Simples
const ImageModal = ({ imageUrl, onClose, ticketId }) => {
  if (!imageUrl) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Visualização da Evidência - Chamado #{ticketId}</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <img 
            src={imageUrl} 
            alt="Anexo do Chamado" 
            className="modal-image"
          />
        </div>
      </div>
    </div>
  );
};

export default function AdminTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [chamado, setChamado] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [atendimento, setAtendimento] = useState(null);
  
  // Estado para controlar a modal
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const [editData, setEditData] = useState({ status: '', prioridade: '', nivelSuporte: '', tecnicoId: '' });

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      const [chamadoRes, tecnicosRes, atendimentoRes] = await Promise.all([
        chamadoApi.buscar(id),
        adminApi.listarTecnicos(),
        atendimentoApi.buscarPorChamado(id)
      ]);
      
      setChamado(chamadoRes);
      setTecnicos(tecnicosRes);
      setAtendimento(atendimentoRes);
      
      setEditData({
        status: chamadoRes.statusChamado || '',
        prioridade: chamadoRes.prioridadeChamado || '',
        nivelSuporte: chamadoRes.nivelSuporte || '',
        tecnicoId: chamadoRes.tecnicoResponsavel?.id || ''
      });
    } catch (error) {
      toast.error('Erro ao carregar dados do chamado.');
      navigate('/admin');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const status = {
        EM_ANDAMENTO: 'EM_ATENDIMENTO',
        AGUARDANDO_CLIENTE: 'PENDENTE_EVIDENCIA',
      }[editData.status] || editData.status;

      if (editData.prioridade !== chamado.prioridadeChamado) {
        const notaPrioridade = `${user?.name ?? 'Administração'}: Prioridade alterada de ${chamado.prioridadeChamado} para ${editData.prioridade}`;
        await chamadoApi.atualizar(id, {
          id: Number(id),
          tituloChamado: chamado.tituloChamado,
          ocorrenciaChamado: chamado.ocorrenciaChamado,
          descricaoChamado: notaPrioridade,
          prioridadeChamado: editData.prioridade,
        });
      }

      const atendimentoPayload = (statusAtual, tecnicoResponsavelId = atendimento?.tecnicoResponsavelId) => ({
        chamadoId: Number(id),
        status: statusAtual,
        nivelSuporte: editData.nivelSuporte,
        usuarioVinculado: atendimento?.usuarioVinculado ?? null,
        equipamentoVinculado: atendimento?.equipamentoVinculado ?? null,
        tecnicoResponsavelId,
      });

      let statusAtual = atendimento?.status || 'ABERTO';
      const estadosVisitados = new Set();

      while (statusAtual !== status && !estadosVisitados.has(statusAtual)) {
        estadosVisitados.add(statusAtual);
        const proximoStatus = {
          EM_TRIAGEM: { ABERTO: 'EM_TRIAGEM' },
          EM_ATENDIMENTO: { ABERTO: 'EM_TRIAGEM', EM_TRIAGEM: 'EM_ATENDIMENTO' },
          PENDENTE_EVIDENCIA: {
            ABERTO: 'EM_TRIAGEM',
            EM_TRIAGEM: 'EM_ATENDIMENTO',
            EM_ATENDIMENTO: 'PENDENTE_EVIDENCIA',
          },
          RESOLVIDO: {
            ABERTO: 'EM_TRIAGEM',
            EM_TRIAGEM: 'EM_ATENDIMENTO',
            EM_ATENDIMENTO: 'RESOLVIDO',
            PENDENTE_EVIDENCIA: 'RESOLVIDO',
          },
        }[status]?.[statusAtual];

        if (!proximoStatus) break;
        await atendimentoApi.atualizar(atendimentoPayload(proximoStatus));
        statusAtual = proximoStatus;
      }

      if (statusAtual !== status) {
        throw new Error(`Não foi possível avançar o status de ${statusAtual} para ${status}.`);
      }

      await atendimentoApi.atualizar(
        atendimentoPayload(status, editData.tecnicoId ? Number(editData.tecnicoId) : null),
      );

      toast.success('Chamado atualizado com sucesso pela Administração!');
      carregarDados();
    } catch (error) {
      toast.error(error.message || 'Erro ao atualizar chamado.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('ATENÇÃO: Deseja EXCLUIR este chamado? Ação irreversível.')) {
      try {
        await chamadoApi.deletar(id);
        toast.success('Chamado excluído com sucesso!');
        navigate('/admin');
      } catch (error) {
        toast.error(error.message || 'Erro ao excluir o chamado.');
      }
    }
  };

  const formatarTexto = (texto) => {
    if (!texto) return '';
    return texto.replace(/[•●*\s]+/g, ' ').replace(/_/g, ' ').trim();
  };

  if (!chamado) return <div className="loading-state">Carregando...</div>;

  const urlAnexo = chamado.imagemChamado || chamado.imagem_chamado;

  return (
    <div className="admin-ticket-container">
      {/* COMPONENTE RESPONSÁVEL POR RENDERIZAR OS TOASTS */}
      <ToastContainer autoClose={3000} position="top-right" />

      {/* COMPONENTE MODAL DE IMAGEM */}
      <ImageModal 
        imageUrl={selectedAttachment} 
        ticketId={chamado.id} 
        onClose={() => setSelectedAttachment(null)} 
      />

      <div className="admin-ticket-header">
        <div className="admin-ticket-title-group">
          <h2>Chamado #{chamado.id}</h2>
          <span className={`badge badge-${chamado.statusChamado?.toLowerCase() || 'gray'}`}>
            {formatarTexto(chamado.statusChamado)}
          </span>
        </div>
        <button className="btn-danger" onClick={handleDelete}>Excluir Chamado</button>
      </div>

      <div className="admin-ticket-grid">
        <div className="admin-ticket-main">
          <div className="admin-card">
            <h3 className="admin-card-title">Detalhes da Solicitação</h3>
            <div className="admin-card-content">
              <p><strong>Título:</strong> {chamado.tituloChamado}</p>
              <p><strong>Solicitante:</strong> {chamado.solicitante?.nome || 'Não informado'}</p>
              <p><strong>Descrição:</strong></p>
              <div className="description-box">{chamado.descricaoChamado}</div>

              {/* ÁREA DO ANEXO / EVIDÊNCIA */}
              <div className="attachment-section" style={{ marginTop: '20px' }}>
                <p><strong>Anexo / Evidência:</strong></p>
                {urlAnexo ? (
                  <div className="attachment-preview" style={{ marginTop: '8px' }}>
                    <img 
                      src={urlAnexo} 
                      alt="Anexo do Chamado" 
                      style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer' }} 
                      onClick={() => setSelectedAttachment(urlAnexo)} // Abre a modal ao clicar na imagem
                    />
                    <br />
                    <button 
                      onClick={() => setSelectedAttachment(urlAnexo)} // Abre a modal ao clicar no botão
                      className="btn-text"
                      style={{ display: 'inline-block', marginTop: '8px', color: '#2563eb', padding: '0', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      Visualizar imagem em tamanho real
                    </button>
                  </div>
                ) : (
                  <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Nenhum anexo enviado para este chamado.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="admin-ticket-sidebar">
          {/* ... formulário de intervenção permanece o mesmo ... */}
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