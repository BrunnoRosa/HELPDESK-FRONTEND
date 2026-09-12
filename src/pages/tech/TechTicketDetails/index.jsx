import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { atendimentoApi, chamadoApi } from '../../../services/api'; 
import './style.css';

export default function TechTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [chamado, setChamado] = useState(null);
  const [atendimento, setAtendimento] = useState(null);
  const [descricaoAtualizacao, setDescricaoAtualizacao] = useState('');
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

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
      setErro(error.message || "Erro ao carregar os dados do chamado.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const atualizarAtendimento = async (alteracoes) => {
    setErro('');
    setMensagem('');
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
      
      // Força a interface a atualizar com o payload enviado
      setAtendimento(prev => ({ ...prev, ...payload })); 
      
      return atendimentoAtualizado;
    } finally {
      setAtualizando(false);
    }
  };

  const registrarHistorico = async (textoComplementar) => {
    setErro('');
    setMensagem('');
    try {
      const dataHora = new Date().toLocaleString();
      const novaLinha = `[${dataHora}] ${user?.name}: ${textoComplementar}`;
      await chamadoApi.atualizar(id, {
        id: Number(id),
        tituloChamado: chamado.tituloChamado,
        ocorrenciaChamado: chamado.ocorrenciaChamado,
        descricaoChamado: novaLinha,
        prioridadeChamado: chamado.prioridadeChamado
      });
      
      setMensagem('Histórico atualizado com sucesso.');
      setDescricaoAtualizacao('');
      setChamado((chamadoAtual) => ({
        ...chamadoAtual,
        descricaoChamado: chamadoAtual.descricaoChamado
          ? `${chamadoAtual.descricaoChamado}\n${novaLinha}`
          : novaLinha,
      }));
    } catch (error) {
      setErro("Erro ao atualizar histórico: " + error.message);
    }
  };

  const handleMudarPrioridade = async (e) => {
    const novaPrioridade = e.target.value;
    if (!window.confirm(`Deseja alterar a prioridade para ${novaPrioridade}?`)) return;

    setErro('');
    setMensagem('');
    setAtualizando(true);

    try {
      const dataHora = new Date().toLocaleString();
      const novaLinha = `[${dataHora}] ${user?.name}: Prioridade alterada de ${chamado.prioridadeChamado} para ${novaPrioridade}`;
      const novaDescricao = chamado.descricaoChamado ? `${chamado.descricaoChamado}\n${novaLinha}` : novaLinha;

      await chamadoApi.atualizar(id, {
        id: Number(id),
        tituloChamado: chamado.tituloChamado,
        ocorrenciaChamado: chamado.ocorrenciaChamado,
        descricaoChamado: novaDescricao,
        prioridadeChamado: novaPrioridade
      });

      setChamado((prev) => ({
        ...prev,
        prioridadeChamado: novaPrioridade,
        descricaoChamado: novaDescricao
      }));
      setMensagem(`Prioridade atualizada para ${novaPrioridade}.`);
    } catch (error) {
      setErro("Erro ao mudar prioridade: " + error.message);
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
      setErro("Erro ao escalonar: " + error.message);
    }
  };

  const handleResolver = async () => {
    if (!window.confirm('Marcar chamado como Resolvido?')) return;
    try {
      await atualizarAtendimento({ status: 'RESOLVIDO' });
      await registrarHistorico("Chamado marcado como resolvido.");
    } catch (error) {
      setErro("Erro ao resolver: " + error.message);
    }
  };

  const handleTransicao = async (proximaEtapa) => {
    if (!proximaEtapa) return;

    try {
      await atualizarAtendimento(proximaEtapa);
      await registrarHistorico(proximaEtapa.mensagem);
    } catch (error) {
      setErro(`Erro ao atualizar o chamado: ${error.message}`);
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
      setErro(`Erro ao assumir chamado: ${error.message}`);
    }
  };
  
  if (loading) return <p className="loading-text">Carregando detalhes do chamado...</p>;
  if (!chamado || !atendimento) return <div className="error-box">{erro}</div>;

  const isResolvido = atendimento.status === 'RESOLVIDO' || atendimento.status === 'FECHADO';

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

      {erro && <div className="error-box">{erro}</div>}
      {mensagem && <div className="success-box">{mensagem}</div>}

      <div className="details-grid">
        <div className="main-content">
          <div className="card">
            <h3>Ocorrência Original</h3>
            <p>{chamado.ocorrenciaChamado}</p>
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
            <div className="attachments-grid" style={{ marginTop: '10px' }}>
              <div className="attachment-item" style={{ marginBottom: '15px' }}>
                <span className="icon">📄</span>
                <a href="#" target="_blank" rel="noreferrer" style={{ marginLeft: '8px' }}>
                  evidencia_tela_erro.jpg
                </a>
              </div>
              
              {atendimento.status === 'PENDENTE_EVIDENCIA' && (
                <div className="upload-section" style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Anexar nova evidência solicitada pelo usuário:
                  </label>
                  <input type="file" accept="image/*, .pdf" />
                  <button type="button" className="btn-upload" style={{ marginLeft: '10px', padding: '5px 10px' }}>
                    Enviar Arquivo
                  </button>
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
                    <span className={`badge-prio ${chamado.prioridadeChamado?.toLowerCase()}`}>{chamado.prioridadeChamado}</span>
                  ) : (
                    <select 
                      value={chamado.prioridadeChamado} 
                      onChange={handleMudarPrioridade}
                      disabled={atualizando}
                      style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f9fafb', width: '100%', fontWeight: '600' }}
                    >
                      <option value="BAIXA">BAIXA</option>
                      <option value="MEDIA">MÉDIA</option>
                      <option value="ALTA">ALTA</option>
                      <option value="URGENTE">URGENTE</option>
                    </select>
                  )}
                </dd>
              </div>
              
              <hr style={{ gridColumn: '1 / -1', borderTop: '1px solid #e2e8f0', margin: '10px 0' }}/>
              <div><dt>Solicitante</dt><dd>{atendimento.solicitanteNome || 'Não informado'}</dd></div>
              <div><dt>Usuário Vinculado</dt><dd>{atendimento.usuarioVinculado || 'Não vinculado'}</dd></div>
              <div><dt>Equipamento</dt><dd>{atendimento.equipamentoVinculado || 'Não vinculado'}</dd></div>
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
                <button onClick={handleAssumirChamado} className="btn-avancar" style={{ backgroundColor: '#10b981' }} disabled={atualizando}>
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
    </div>
  );
}