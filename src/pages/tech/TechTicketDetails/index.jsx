import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { atendimentoApi, chamadoApi } from '../../../services/api'; 
import { notify } from '../../../components/Notification';
import './style.css';

export default function TechTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [chamado, setChamado] = useState(null);
  const [atendimento, setAtendimento] = useState(null);
  const [descricaoAtualizacao, setDescricaoAtualizacao] = useState('');
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  // Controle de estado para exibição do Modal da Evidência Fotográfica
  const [modalAberto, setModalAberto] = useState(false);
  const [imagemSelecionada, setImagemSelecionada] = useState(null);

  const abrirModal = (urlImagem) => {
    setImagemSelecionada(urlImagem);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setImagemSelecionada(null);
  };

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [dadosChamado, dadosAtendimento] = await Promise.all([
        chamadoApi.buscar(id),
        atendimentoApi.buscarPorChamado(id)
      ]);
      setChamado(dadosChamado);
      setAtendimento(dadosAtendimento);
    } catch (error) {
      notify('error', error.message || "Erro ao carregar os dados do chamado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const atualizarAtendimento = async (alteracoes) => {
    setAtualizando(true);
    const payload = {
      chamadoId: atendimento?.chamadoId ?? Number(id),
      status: alteracoes.status ?? atendimento?.status,
      nivelSuporte: alteracoes.nivelSuporte ?? atendimento?.nivelSuporte,
      usuarioVinculado: atendimento?.usuarioVinculado ?? null,
      equipamentoVinculado: atendimento?.equipamentoVinculado ?? null,
      tecnicoResponsavelId: alteracoes.tecnicoResponsavelId ?? atendimento?.tecnicoResponsavelId ?? null, 
    };

    try {
      const atendimentoAtualizado = await atendimentoApi.atualizar(payload);
      setAtendimento(prev => ({ ...prev, ...payload })); 
      return atendimentoAtualizado;
    } finally {
      setAtualizando(false);
    }
  };

  const registrarHistorico = async (textoComplementar) => {
    try {
      const novaLinha = `${user?.name}: ${textoComplementar}`;

      await chamadoApi.atualizar(id, {
        id: Number(id),
        tituloChamado: chamado.tituloChamado,
        ocorrenciaChamado: chamado.ocorrenciaChamado,
        descricaoChamado: novaLinha,
        prioridadeChamado: chamado.prioridadeChamado,
        imagemChamado: chamado.imagemChamado // Preserva a imagem enviando-a no PUT
      });

      notify('success', 'Histórico atualizado com sucesso.');
      setDescricaoAtualizacao('');
      await carregarDados();
    } catch (error) {
      notify('error', "Erro ao atualizar histórico: " + error.message);
    }
  };

  const handleMudarPrioridade = async (e) => {
    const novaPrioridade = e.target.value;
    if (!window.confirm(`Deseja alterar a prioridade para ${novaPrioridade}?`)) return;

    setAtualizando(true);

    try {
      const novaLinha = `${user?.name}: Prioridade alterada de ${chamado.prioridadeChamado} para ${novaPrioridade}`;

      await chamadoApi.atualizar(id, {
        id: Number(id),
        tituloChamado: chamado.tituloChamado,
        ocorrenciaChamado: chamado.ocorrenciaChamado,
        descricaoChamado: novaLinha,
        prioridadeChamado: novaPrioridade,
        imagemChamado: chamado.imagemChamado // Preserva a imagem enviando-a no PUT
      });

      await carregarDados();
      notify('success', `Prioridade atualizada para ${novaPrioridade}.`);
    } catch (error) {
      notify('error', "Erro ao mudar prioridade: " + error.message);
    } finally {
      setAtualizando(false);
    }
  };

  const handleComentarioSubmit = (e) => {
    e.preventDefault();
    if (!descricaoAtualizacao.trim()) return;
    registrarHistorico(descricaoAtualizacao);
  };

  const executarAcao = (acao) => {
    registrarHistorico(`Ferramenta utilizada: ${acao}`);
  };

  const handleEscalar = async (proximoNivel) => {
    if (!window.confirm(`Escalonar para ${proximoNivel}?`)) return;
    try {
      const status = atendimento.status === 'EM_TRIAGEM'
        ? 'EM_ATENDIMENTO'
        : atendimento.status;
      await atualizarAtendimento({ status, nivelSuporte: proximoNivel });
      await registrarHistorico(`Chamado escalonado para ${proximoNivel}`);
    } catch (error) {
      notify('error', "Erro ao escalonar: " + error.message);
    }
  };

  const handleResolver = async () => {
    if (!window.confirm('Marcar chamado como Resolvido?')) return;
    try {
      await atualizarAtendimento({ status: 'RESOLVIDO' });
      await registrarHistorico("Chamado marcado como resolvido.");
    } catch (error) {
      notify('error', "Erro ao resolver: " + error.message);
    }
  };

  const handleTransicao = async (proximaEtapa) => {
    if (!proximaEtapa) return;

    try {
      await atualizarAtendimento(proximaEtapa);
      await registrarHistorico(proximaEtapa.mensagem);
    } catch (error) {
      notify('error', `Erro ao atualizar o chamado: ${error.message}`);
    }
  };

  const avancarFluxo = () => {
    const proximaEtapa = {
      ABERTO: { status: 'EM_TRIAGEM', nivelSuporte: 'N1', mensagem: 'Chamado em triagem.' },
      EM_TRIAGEM: { status: 'EM_ATENDIMENTO', nivelSuporte: 'N2', mensagem: 'Atendimento escalonado para o nível N2.' },
      EM_ATENDIMENTO: { status: 'PENDENTE_EVIDENCIA', nivelSuporte: atendimento.nivelSuporte, mensagem: 'Chamado colocado como pendente de evidência.' },
      PENDENTE_EVIDENCIA: { status: 'EM_ATENDIMENTO', nivelSuporte: atendimento.nivelSuporte, mensagem: 'Atendimento retomado após evidência.' },
      RESOLVIDO: { status: 'FECHADO', nivelSuporte: atendimento.nivelSuporte, mensagem: 'Chamado fechado.' },
    }[atendimento.status];

    handleTransicao(proximaEtapa);
  };

  const handleAssumirChamado = async () => {
    if (!window.confirm('Deseja assumir este chamado e iniciar o atendimento?')) return;
    try {
      await atualizarAtendimento({ 
        status: 'EM_TRIAGEM',
        tecnicoResponsavelId: user?.id || user?.sub || user?.userId || user?.idUsuario
      });
      await registrarHistorico("O técnico assumiu o chamado. Status alterado para Em Triagem.");
      await carregarDados(); 
    } catch (error) {
      notify('error', `Erro ao assumir chamado: ${error.message}`);
    }
  };
  
  if (loading) return <p className="loading-text">Carregando detalhes do chamado...</p>;
  if (!chamado || !atendimento) return <p className="error-text">Não foi possível carregar o chamado.</p>;

  const isResolvido = atendimento.status === 'RESOLVIDO' || atendimento.status === 'FECHADO';
  
  // Leitura do equipamento vindo da descrição ou do atendimento
  const equipamentoDaDescricao = chamado.descricaoChamado?.match(/\[Equipamento:\s*(.*?)\s*\|/)?.[1]?.trim();
  const equipamentoExibido = atendimento.equipamentoVinculado || equipamentoDaDescricao;

  // Lógica de recuperação de anexo local / banco de dados
  const imagemArmazenada = localStorage.getItem(`helpdesk:chamado:${chamado.id}:imagem`);
  let anexoLocal = null;

  if (imagemArmazenada) {
    try {
      const anexo = JSON.parse(imagemArmazenada);
      anexoLocal = anexo.data ? anexo : { data: imagemArmazenada, nome: 'Arquivo anexado' };
    } catch {
      anexoLocal = { data: imagemArmazenada, nome: 'Arquivo anexado' };
    }
  }

  const anexo = chamado.imagemChamado
    ? { data: chamado.imagemChamado, nome: 'Arquivo anexado' }
    : anexoLocal;

  return (
    <div className="ticket-details-page">
      <div className="header-actions">
        <button onClick={() => navigate('/')} className="btn-voltar">← Voltar para o Painel</button>
        <div className="detalhe__heading">
          <h2>Chamado #{chamado.id} - {chamado.tituloChamado}</h2>
          <span className={`status-badge ${isResolvido ? 'resolvido' : 'aberto'}`}>
            {atendimento.status}
          </span>
        </div>
      </div>

      <div className="details-grid">
        <div className="main-content">
          <div className="card">
            <h3>Ocorrência Original</h3>
            <p className="ocorrencia-texto">{chamado.ocorrenciaChamado}</p>
          </div>

          <div className="card">
            <h3>Histórico e Diagnósticos</h3>
            <pre className="detalhe__history">{chamado.descricaoChamado || "Nenhum histórico registrado."}</pre>
            
            {!isResolvido && (
              <form className="detalhe__panel add-comment-form" onSubmit={handleComentarioSubmit}>
                <h3>Adicionar atualização</h3>
                <textarea 
                  rows="4" 
                  value={descricaoAtualizacao} 
                  onChange={e => setDescricaoAtualizacao(e.target.value)} 
                  placeholder="Descreva o diagnóstico, evidência ou nota técnica..."
                />
                <button type="submit" className="btn-enviar-nota">Registrar no histórico</button>
              </form>
            )}
          </div>

          <div className="card">
            <h3>Evidências e Anexos (Fotografias)</h3>
            <div className="attachments-grid">
              {anexo ? (
                <div className="attachment-item">
                  <span className="icon">📸</span>
                  <span 
                    onClick={() => abrirModal(anexo.data)} 
                    className="attachment-link"
                    style={{ cursor: 'pointer', color: '#0056b3', textDecoration: 'underline' }}
                  >
                    Ver imagem anexada
                  </span>
                </div>
              ) : (
                <p style={{ fontSize: '14px', color: '#666' }}>Nenhuma evidência anexada neste chamado.</p>
              )}
              
              {atendimento.status === 'PENDENTE_EVIDENCIA' && (
                <div className="upload-section">
                  <label className="upload-label">
                    Anexar nova evidência solicitada pelo usuário:
                  </label>
                  <div className="upload-controls">
                    <input type="file" accept="image/*, .pdf" className="file-input" />
                    <button type="button" className="btn-upload">
                      Enviar Arquivo
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="card info-card">
            <h3>Informações Gerais</h3>
            <dl className="detalhe__data">
              <div><dt>Status</dt><dd>{atendimento.status}</dd></div>
              <div><dt>Nível Atual</dt><dd>{atendimento.nivelSuporte}</dd></div>
              
              <div>
                <dt>Prioridade</dt>
                <dd>
                  {isResolvido ? (
                    <span className={`badge-prio ${chamado.prioridadeChamado?.toLowerCase()}`}>
                      {chamado.prioridadeChamado}
                    </span>
                  ) : (
                    <select 
                      value={chamado.prioridadeChamado} 
                      onChange={handleMudarPrioridade}
                      disabled={atualizando}
                      className="select-prioridade"
                    >
                      <option value="BAIXA">BAIXA</option>
                      <option value="MEDIA">MÉDIA</option>
                      <option value="ALTA">ALTA</option>
                      <option value="URGENTE">URGENTE</option>
                    </select>
                  )}
                </dd>
              </div>
              
              <hr className="data-divider"/>
              <div><dt>Solicitante</dt><dd>{atendimento.solicitanteNome || 'Não informado'}</dd></div>
              <div><dt>Usuário Vinculado</dt><dd>{atendimento.usuarioVinculado || 'Não vinculado'}</dd></div>
              <div><dt>Equipamento</dt><dd>{equipamentoExibido || 'Não vinculado'}</dd></div>
              <div><dt>Técnico Responsável</dt><dd>{atendimento.tecnicoResponsavelNome || 'Não atribuído'}</dd></div>
            </dl>
          </div>

          {!isResolvido && (
            <div className="card action-card">
              <h3>Ferramentas de Suporte</h3>
              
              <div className="tool-group">
                <span className="tool-label">N1: Soluções Básicas</span>
                <button onClick={() => executarAcao('Reset de Senha')} className="btn-tool n1">Reset de Senha</button>
                <button onClick={() => executarAcao('Acesso Remoto')} className="btn-tool n1">Acesso Remoto Básico</button>
              </div>

              {(user?.role === 'TECNICO' || user?.role === 'ADMINISTRADOR') && (
                <div className="tool-group">
                  <span className="tool-label">N2: Especializado</span>
                  <button onClick={() => executarAcao('Análise de Logs')} className="btn-tool n2">Analisar Logs de Rede</button>
                  <button onClick={() => executarAcao('Reiniciar IIS')} className="btn-tool n2">Reiniciar Servidor (IIS)</button>
                  {atendimento.nivelSuporte === 'N2' && atendimento.status === 'EM_ATENDIMENTO' && (
                    <button onClick={() => handleEscalar('N3')} className="btn-escalar" disabled={atualizando}>
                      Escalonar para N3
                    </button>
                  )}
                </div>
              )}

              {(user?.role === 'TECNICO' || user?.role === 'ADMINISTRADOR') && (
                <div className="tool-group">
                  <span className="tool-label">N3: Engenharia</span>
                  <button onClick={() => executarAcao('Query BD')} className="btn-tool n3">Executar Query no BD</button>
                  <button onClick={() => executarAcao('Deploy de Patch')} className="btn-tool n3">Aplicar Patch / Deploy</button>
                </div>
              )}

              {atendimento.status === 'ABERTO' && (
                <button onClick={handleAssumirChamado} className="btn-avancar btn-assumir" disabled={atualizando}>
                  {atualizando ? 'Atualizando...' : 'Assumir Chamado'}
                </button>
              )}

              {['EM_TRIAGEM', 'EM_ATENDIMENTO', 'PENDENTE_EVIDENCIA', 'RESOLVIDO'].includes(atendimento.status) && (
                <button onClick={avancarFluxo} className="btn-avancar" disabled={atualizando}>
                  {atualizando ? 'Atualizando...' : {
                    EM_TRIAGEM: 'Escalonar para N2',
                    EM_ATENDIMENTO: 'Solicitar evidência',
                    PENDENTE_EVIDENCIA: 'Retomar atendimento',
                    RESOLVIDO: 'Fechar chamado',
                  }[atendimento.status]}
                </button>
              )}
              {['EM_ATENDIMENTO', 'PENDENTE_EVIDENCIA'].includes(atendimento.status) && (
                <button onClick={handleResolver} className="btn-resolver" disabled={atualizando}>
                  Marcar como Resolvido
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {modalAberto && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}
          onClick={fecharModal}
        >
          <div 
            style={{ position: 'relative', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              style={{ position: 'absolute', top: '-40px', right: '0px', fontSize: '30px', color: '#fff', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={fecharModal}
            >
              &times;
            </button>
            <img 
              src={imagemSelecionada} 
              alt="Evidência do Chamado" 
              style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}