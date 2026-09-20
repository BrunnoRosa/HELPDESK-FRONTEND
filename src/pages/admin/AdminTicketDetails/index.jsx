import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { chamadoApi, adminApi, atendimentoApi } from '../../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';

// Componente Modal para Visualização do Anexo / Evidência
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
  
  const [selectedAttachment, setSelectedAttachment] = useState(null);

  const [editData, setEditData] = useState({ 
    status: '', 
    prioridade: '', 
    nivelSuporte: '', 
    tecnicoId: '' 
  });

  // Normalização do Enum de Status
  const normalizeStatus = (s) => {
    if (!s) return 'ABERTO';
    if (s === 'EM_ANDAMENTO') return 'EM_ATENDIMENTO';
    if (s === 'AGUARDANDO_CLIENTE') return 'PENDENTE_EVIDENCIA';
    return s;
  };

  const statusLabels = {
    ABERTO: 'Aberto',
    EM_TRIAGEM: 'Em Triagem',
    EM_ATENDIMENTO: 'Em Atendimento',
    PENDENTE_EVIDENCIA: 'Aguardando Cliente',
    RESOLVIDO: 'Resolvido'
  };

  const nivelLabels = {
    N1: 'N1 - Triagem e Básico',
    N2: 'N2 - Especializado',
    N3: 'N3 - Engenharia'
  };

  const prioridadeLabels = {
    BAIXA: 'Baixa',
    MEDIA: 'Média',
    ALTA: 'Alta',
    URGENTE: 'Urgente'
  };

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
      
      const statusAtual = normalizeStatus(atendimentoRes?.status || chamadoRes.statusChamado || 'ABERTO');
      const nivelAtual = atendimentoRes?.nivelSuporte || chamadoRes.nivelSuporte || 'N1';
      const tecAtualId = atendimentoRes?.tecnicoResponsavelId || chamadoRes.tecnicoResponsavel?.id || '';

      setEditData({
        status: statusAtual,
        prioridade: chamadoRes.prioridadeChamado || 'BAIXA',
        nivelSuporte: nivelAtual,
        tecnicoId: tecAtualId ? String(tecAtualId) : ''
      });
    } catch (error) {
      toast.error('Erro ao carregar dados do chamado.');
      navigate('/admin');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const nomeUsuario = user?.name || user?.nome || 'Administração';
      
      const agora = new Date();
      const dia = String(agora.getDate()).padStart(2, '0');
      const mes = String(agora.getMonth() + 1).padStart(2, '0');
      const ano = agora.getFullYear();
      const horas = String(agora.getHours()).padStart(2, '0');
      const minutos = String(agora.getMinutes()).padStart(2, '0');
      const dataHora = `[${dia}/${mes}/${ano} ${horas}:${minutos}]`;

      const rawLogs = [];

      // 1. Verificação de Mudança no Status
      const statusAnteriorNorm = normalizeStatus(atendimento?.status || chamado?.statusChamado);
      const statusNovoNorm = normalizeStatus(editData.status);

      if (statusAnteriorNorm !== statusNovoNorm) {
        const labelAnt = statusLabels[statusAnteriorNorm] || statusAnteriorNorm;
        const labelNovo = statusLabels[statusNovoNorm] || statusNovoNorm;
        rawLogs.push(`${nomeUsuario}: Status alterado de "${labelAnt}" para "${labelNovo}"`);
      }

      // 2. Verificação de Mudança na Prioridade
      const prioridadeAnterior = chamado?.prioridadeChamado || 'BAIXA';
      if (editData.prioridade && editData.prioridade !== prioridadeAnterior) {
        const labelAntPrio = prioridadeLabels[prioridadeAnterior] || prioridadeAnterior;
        const labelNovaPrio = prioridadeLabels[editData.prioridade] || editData.prioridade;
        rawLogs.push(`${nomeUsuario}: Prioridade alterada de "${labelAntPrio}" para "${labelNovaPrio}"`);
      }

      // 3. Verificação de Mudança no Nível de Suporte (Fila)
      const nivelAnterior = atendimento?.nivelSuporte || chamado?.nivelSuporte || 'N1';
      if (editData.nivelSuporte && editData.nivelSuporte !== nivelAnterior) {
        const labelNivelAnt = nivelLabels[nivelAnterior] || nivelAnterior;
        const labelNivelNovo = nivelLabels[editData.nivelSuporte] || editData.nivelSuporte;
        rawLogs.push(`${nomeUsuario}: Fila (Nível) alterada de "${labelNivelAnt}" para "${labelNivelNovo}"`);
      }

      // 4. Verificação de Mudança na Atribuição do Técnico
      const tecAnteriorId = atendimento?.tecnicoResponsavelId || chamado?.tecnicoResponsavel?.id || null;
      const tecNovoId = editData.tecnicoId ? Number(editData.tecnicoId) : null;

      if (String(tecAnteriorId ?? '') !== String(tecNovoId ?? '')) {
        const tecAnteriorObj = tecnicos.find(t => String(t.id) === String(tecAnteriorId));
        const tecAnteriorNome = tecAnteriorObj ? tecAnteriorObj.nome : (chamado.tecnicoResponsavel?.nome || 'Fila Geral');
        
        const tecNovoObj = tecnicos.find(t => String(t.id) === String(tecNovoId));
        const tecNovoNome = tecNovoObj ? tecNovoObj.nome : 'Fila Geral';

        rawLogs.push(`${nomeUsuario}: Atribuição alterada de "${tecAnteriorNome}" para "${tecNovoNome}"`);
      }

      // Formatação final: A 1ª linha deixa o timestamp por conta do Backend. 
      // As linhas seguintes adicionam o timestamp para manter a coerência visual.
      if (rawLogs.length > 0) {
        const logsFormatados = rawLogs.map((log, index) => {
          return index === 0 ? log : `${dataHora} ${log}`;
        });

        const novosLogsTexto = logsFormatados.join('\n');

        await chamadoApi.atualizar(id, {
          id: Number(id),
          tituloChamado: chamado.tituloChamado,
          ocorrenciaChamado: chamado.ocorrenciaChamado,
          descricaoChamado: novosLogsTexto,
          prioridadeChamado: editData.prioridade,
        });
      }

      // Atualização do fluxo de atendimento
      const atendimentoPayload = (statusPasso, tecnicoResponsavelId = atendimento?.tecnicoResponsavelId) => ({
        chamadoId: Number(id),
        status: statusPasso,
        nivelSuporte: editData.nivelSuporte,
        usuarioVinculado: atendimento?.usuarioVinculado ?? null,
        equipamentoVinculado: atendimento?.equipamentoVinculado ?? null,
        tecnicoResponsavelId,
      });

      let statusAtualLoop = normalizeStatus(atendimento?.status || 'ABERTO');
      const estadosVisitados = new Set();

      while (statusAtualLoop !== statusNovoNorm && !estadosVisitados.has(statusAtualLoop)) {
        estadosVisitados.add(statusAtualLoop);
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
        }[statusNovoNorm]?.[statusAtualLoop];

        if (!proximoStatus) break;
        await atendimentoApi.atualizar(atendimentoPayload(proximoStatus));
        statusAtualLoop = proximoStatus;
      }

      await atendimentoApi.atualizar(
        atendimentoPayload(statusNovoNorm, tecNovoId),
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
      <ToastContainer autoClose={3000} position="top-right" />

      {/* MODAL DE VISUALIZAÇÃO DO ANEXO */}
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

              {/* SEÇÃO DO ANEXO / EVIDÊNCIA */}
              <div className="attachment-section">
                <p><strong>Anexo / Evidência:</strong></p>
                {urlAnexo ? (
                  <div className="attachment-preview">
                    <img 
                      src={urlAnexo} 
                      alt="Anexo do Chamado" 
                      style={{ maxWidth: '100%', maxHeight: '350px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer' }} 
                      onClick={() => setSelectedAttachment(urlAnexo)} 
                    />
                    <button 
                      onClick={() => setSelectedAttachment(urlAnexo)} 
                      className="btn-text"
                    >
                      Visualizar imagem em tamanho real
                    </button>
                  </div>
                ) : (
                  <p className="empty-text">Nenhum anexo enviado para este chamado.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <aside className="admin-ticket-sidebar">
          <div className="admin-card">
            <h3 className="admin-card-title">Intervenção Administrativa</h3>
            <form onSubmit={handleUpdate} className="admin-form-vertical">
              <div className="form-group">
                <label>FORÇAR STATUS:</label>
                <select 
                  value={editData.status} 
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                >
                  <option value="ABERTO">Aberto</option>
                  <option value="EM_TRIAGEM">Em Triagem</option>
                  <option value="EM_ATENDIMENTO">Em Atendimento</option>
                  <option value="PENDENTE_EVIDENCIA">Aguardando Cliente</option>
                  <option value="RESOLVIDO">Resolvido</option>
                </select>
              </div>

              <div className="form-group">
                <label>PRIORIDADE:</label>
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
                <label>FILA (NÍVEL):</label>
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
                <label>ATRIBUIÇÃO DIRETA:</label>
                <select 
                  value={editData.tecnicoId} 
                  onChange={(e) => setEditData({...editData, tecnicoId: e.target.value})}
                >
                  <option value="">Desatribuir (Fila Geral)</option>
                  {tecnicos.map(tec => (
                    <option key={tec.id} value={String(tec.id)}>
                      {tec.nome} {tec.nivelSuporte ? `(${tec.nivelSuporte})` : ''}
                    </option>
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