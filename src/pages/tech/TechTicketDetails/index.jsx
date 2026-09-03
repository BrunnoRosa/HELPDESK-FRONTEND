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

  const carregarDados = async () => {
    try {
      setLoading(true);
      const dadosChamado = await chamadoApi.buscar(id);
      let dadosAtendimento = null;

      try {
        dadosAtendimento = await atendimentoApi.buscarPorChamado(id);
      } catch {
        dadosAtendimento = {
          id: id,
          chamadoId: Number(id),
          status: dadosChamado.status || 'ABERTO',
          nivelSuporte: 'N1',
          solicitanteNome: dadosChamado.empresa || 'Cliente'
        };
      }

      setChamado(dadosChamado);
      setAtendimento(dadosAtendimento);
    } catch (error) {
      setErro(error.message || 'Erro ao carregar os dados do chamado.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [id]);

  const registrarHistorico = async (textoComplementar) => {
    setErro('');
    setMensagem('');
    try {
      const dataHora = new Date().toLocaleString();
      const nomeAutor = user?.name || user?.nome || 'Técnico';
      const novaLinha = `[${dataHora}] ${nomeAutor}: ${textoComplementar}`;
      
      const descAntiga = chamado.descricaoChamado || chamado.descricao || '';
      const novaDescricao = descAntiga ? `${descAntiga}\n${novaLinha}` : novaLinha;

      await chamadoApi.atualizar(id, {
        ...chamado,
        id: Number(id),
        descricaoChamado: novaDescricao,
        descricao: novaDescricao
      });
      
      setMensagem('Histórico atualizado com sucesso.');
      setDescricaoAtualizacao('');
      await carregarDados();
    } catch (error) {
      setErro('Erro ao atualizar histórico: ' + error.message);
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
      await atendimentoApi.atualizar(id, {
        ...atendimento,
        nivelSuporte: proximoNivel
      });
      await registrarHistorico(`Chamado escalonado para ${proximoNivel}`);
    } catch (error) {
      setErro('Erro ao escalonar: ' + error.message);
    }
  };

  const handleResolver = async () => {
    if (!window.confirm('Marcar chamado como Resolvido?')) return;
    try {
      await atendimentoApi.atualizar(id, {
        ...atendimento,
        status: 'RESOLVIDO'
      });
      await registrarHistorico('Chamado marcado como resolvido.');
    } catch (error) {
      setErro('Erro ao resolver: ' + error.message);
    }
  };

  if (loading) return <p className="loading-text">Carregando detalhes do chamado...</p>;
  if (!chamado) return <div className="error-box">{erro || 'Chamado não encontrado.'}</div>;

  const statusAtual = atendimento?.status || chamado?.status || 'ABERTO';
  const isResolvido = statusAtual === 'RESOLVIDO' || statusAtual === 'FECHADO';

  return (
    <div className="ticket-details-page">
      <div className="header-actions">
        <button onClick={() => navigate('/tecnico')} className="btn-voltar">&larr; Voltar para o Painel</button>
        <div className="detalhe__heading">
          <h2>Chamado #{chamado.id} - {chamado.tituloChamado || chamado.titulo}</h2>
          <span className={`status-badge status-${statusAtual.toLowerCase()}`}>{statusAtual}</span>
        </div>
      </div>

      {erro && <div className="error-box">{erro}</div>}
      {mensagem && <div className="success-box">{mensagem}</div>}

      <div className="details-grid">
        <div className="main-content">
          <div className="card">
            <h3>Ocorrência Original</h3>
            <p>{chamado.ocorrenciaChamado || chamado.ocorrencia || 'Sem ocorrência informada.'}</p>
          </div>

          <div className="card">
            <h3>Histórico e Diagnósticos</h3>
            <pre className="detalhe__history">{chamado.descricaoChamado || chamado.descricao || 'Nenhum histórico registrado.'}</pre>
            
            {!isResolvido && (
              <form className="detalhe__panel add-comment-form" onSubmit={handleComentarioSubmit}>
                <h3>Adicionar atualização</h3>
                <textarea 
                  rows="4" 
                  value={descricaoAtualizacao} 
                  onChange={(e) => setDescricaoAtualizacao(e.target.value)} 
                  placeholder="Descreva o diagnóstico, evidência ou nota técnica..."
                />
                <button type="submit" className="btn-enviar-nota">Registrar no histórico</button>
              </form>
            )}
          </div>
        </div>

        <div className="sidebar-content">
          <div className="card info-card">
            <h3>Informações Gerais</h3>
            <dl className="detalhe__data">
              <div><dt>Status</dt><dd>{statusAtual}</dd></div>
              <div><dt>Nível Atual</dt><dd>{atendimento?.nivelSuporte || 'N1'}</dd></div>
              <div>
                <dt>Prioridade</dt>
                <dd>
                  <span className={`badge-prio ${(chamado.prioridadeChamado || chamado.prioridade || 'NORMAL').toLowerCase()}`}>
                    {chamado.prioridadeChamado || chamado.prioridade || 'NORMAL'}
                  </span>
                </dd>
              </div>
              <hr style={{ gridColumn: '1 / -1', borderTop: '1px solid #e2e8f0', margin: '10px 0' }}/>
              <div><dt>Solicitante</dt><dd>{atendimento?.solicitanteNome || chamado.empresa || 'Não informado'}</dd></div>
              <div><dt>Usuário Vinculado</dt><dd>{atendimento?.usuarioVinculado || 'Não vinculado'}</dd></div>
              <div><dt>Equipamento</dt><dd>{atendimento?.equipamentoVinculado || chamado.equipamento || 'Não vinculado'}</dd></div>
              <div><dt>Técnico Responsável</dt><dd>{atendimento?.tecnicoResponsavelNome || 'Não atribuído'}</dd></div>
            </dl>
          </div>

          {!isResolvido && (
            <div className="card action-card">
              <h3>Ferramentas de Suporte</h3>
              
              <div className="tool-group">
                <span className="tool-label">N1: Soluções Básicas</span>
                <button onClick={() => executarAcao('Reset de Senha')} className="btn-tool n1">Reset de Senha</button>
                <button onClick={() => executarAcao('Acesso Remoto')} className="btn-tool n1">Acesso Remoto Básico</button>
                {(user?.role === 'N1' || !user?.role) && atendimento?.nivelSuporte === 'N1' && (
                  <button onClick={() => handleEscalar('N2')} className="btn-escalar">Escalonar para N2</button>
                )}
              </div>

              {(user?.role === 'N2' || user?.role === 'N3' || !user?.role) && (
                <div className="tool-group">
                  <span className="tool-label">N2: Especializado</span>
                  <button onClick={() => executarAcao('Análise de Logs')} className="btn-tool n2">Analisar Logs de Rede</button>
                  <button onClick={() => executarAcao('Reiniciar IIS')} className="btn-tool n2">Reiniciar Servidor (IIS)</button>
                  {user?.role === 'N2' && atendimento?.nivelSuporte === 'N2' && (
                    <button onClick={() => handleEscalar('N3')} className="btn-escalar">Escalonar para N3</button>
                  )}
                </div>
              )}

              {(user?.role === 'N3' || !user?.role) && (
                <div className="tool-group">
                  <span className="tool-label">N3: Engenharia</span>
                  <button onClick={() => executarAcao('Query BD')} className="btn-tool n3">Executar Query no BD</button>
                  <button onClick={() => executarAcao('Deploy de Patch')} className="btn-tool n3">Aplicar Patch / Deploy</button>
                </div>
              )}

              <button onClick={handleResolver} className="btn-resolver">Marcar como Resolvido</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}