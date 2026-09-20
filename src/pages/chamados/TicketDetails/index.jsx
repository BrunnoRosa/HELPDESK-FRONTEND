import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { atendimentoApi, chamadoApi } from '../../../services/api';
import { notify } from '../../../components/Notification';
import './style.css';

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados principais
  const [chamado, setChamado] = useState(null);
  const [atendimento, setAtendimento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Estados do chat de diagnóstico (histórico do chamado)
  const [comentario, setComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  // Estados do envio de evidência solicitada pelo técnico
  const [novaEvidencia, setNovaEvidencia] = useState('');
  const [nomeNovaEvidencia, setNomeNovaEvidencia] = useState('');
  const [enviandoEvidencia, setEnviandoEvidencia] = useState(false);

  useEffect(() => {
    carregarChamado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const carregarChamado = async () => {
    try {
      setCarregando(true);
      setErro('');
      
      const [dadosChamado, dadosAtendimento] = await Promise.all([
        chamadoApi.buscar(id),
        atendimentoApi.buscarPorChamado(id),
      ]);

      if (!dadosChamado || !dadosAtendimento) {
        const mensagem = 'Chamado não encontrado.';
        notify('error', mensagem);
        setErro(mensagem);
        return;
      }

      setChamado(dadosChamado);
      setAtendimento(dadosAtendimento);
    } catch (error) {
      const mensagem = error.message || 'Erro ao carregar os detalhes do chamado.';
      notify('error', mensagem);
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  // Monta o payload preservando os campos atuais do chamado, já que o
  // backend substitui o registro inteiro a cada PUT (o mesmo padrão usado
  // na tela do técnico).
  const montarPayloadPreservado = (alteracoes = {}) => ({
    id: Number(id),
    tituloChamado: chamado.tituloChamado,
    ocorrenciaChamado: chamado.ocorrenciaChamado,
    descricaoChamado: chamado.descricaoChamado,
    prioridadeChamado: chamado.prioridadeChamado,
    imagemChamado: chamado.imagemChamado,
    ...alteracoes,
  });

  const handleComentarioSubmit = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    setEnviandoComentario(true);
    try {
      await chamadoApi.atualizar(id, montarPayloadPreservado({
        descricaoChamado: `${atendimento.solicitanteNome || 'Usuário'}: ${comentario.trim()}`,
      }));
      setComentario('');
      notify('success', 'Mensagem enviada.');
      await carregarChamado();
    } catch (error) {
      notify('error', error.message || 'Erro ao enviar a mensagem.');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleEvidenciaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      notify('error', 'A imagem deve ter no máximo 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNovaEvidencia(reader.result);
      setNomeNovaEvidencia(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleEnviarEvidencia = async (e) => {
    e.preventDefault();
    if (!novaEvidencia) {
      notify('error', 'Selecione um arquivo antes de enviar.');
      return;
    }

    setEnviandoEvidencia(true);
    try {
      // Endpoint dedicado: adiciona a nova foto sem apagar a de abertura
      // nem evidências anteriores.
      await chamadoApi.adicionarEvidencia(id, {
        imagem: novaEvidencia,
        nomeArquivo: nomeNovaEvidencia || 'arquivo-anexado',
      });
      await chamadoApi.atualizar(id, montarPayloadPreservado({
        descricaoChamado: `${atendimento.solicitanteNome || 'Usuário'}: Nova evidência anexada (${nomeNovaEvidencia}).`,
      }));
      setNovaEvidencia('');
      setNomeNovaEvidencia('');
      notify('success', 'Evidência enviada com sucesso.');
      await carregarChamado();
    } catch (error) {
      notify('error', error.message || 'Erro ao enviar a evidência.');
    } finally {
      setEnviandoEvidencia(false);
    }
  };

  // Mapeamento dinâmico de cores dos badges
  const getStatusBadgeClass = (status) => {
    if (!status) return 'badge-gray';
    const s = status.toLowerCase();
    if (s.includes('aberto') || s.includes('novo')) return 'badge-blue';
    if (s.includes('andamento') || s.includes('atendimento') || s.includes('pendente')) return 'badge-orange';
    if (s.includes('conclu') || s.includes('resolv') || s.includes('fechado')) return 'badge-green';
    if (s.includes('cancel')) return 'badge-red';
    return 'badge-gray';
  };

  const getPriorityBadgeClass = (prioridade) => {
    if (!prioridade) return 'badge-gray';
    const p = prioridade.toLowerCase();
    if (p.includes('alta') || p.includes('urgente') || p.includes('crítica')) return 'badge-red';
    if (p.includes('média') || p.includes('media')) return 'badge-orange';
    if (p.includes('baixa')) return 'badge-blue';
    return 'badge-gray';
  };

  const extrairEquipamento = (descricao) => {
    if (!descricao) return '';
    const match = descricao.match(/\[Equipamento:\s*(.*?)\s*\|/);
    return match?.[1]?.trim() || '';
  };

  if (carregando) {
    return (
      <div className="details-container">
        <div className="details-card loading-state">
          <p>Carregando detalhes do chamado...</p>
        </div>
      </div>
    );
  }

  if (erro || !chamado || !atendimento) {
    return (
      <div className="details-container">
        <button onClick={() => navigate('/chamados')} className="btn-back">
          &larr; Voltar para Meus Chamados
        </button>
        <div className="details-card loading-state">
          <p>{erro || 'Chamado não encontrado.'}</p>
        </div>
      </div>
    );
  }

  // Lista de todas as fotos do chamado (a de abertura + cada evidência
  // enviada depois). Cai para o legado em localStorage só se o chamado for
  // antigo o bastante para nem ter a foto de abertura salva no backend.
  let evidencias = chamado.evidencias || [];
  if (evidencias.length === 0) {
    const evidenciaLocal = localStorage.getItem(`helpdesk:chamado:${chamado.id}:imagem`);
    if (evidenciaLocal) {
      try {
        const anexo = JSON.parse(evidenciaLocal);
        evidencias = [{ id: 'local', imagem: anexo?.data || evidenciaLocal, nomeArquivo: anexo?.nome }];
      } catch {
        evidencias = [{ id: 'local', imagem: evidenciaLocal, nomeArquivo: null }];
      }
    }
  }

  return (
    <div className="details-container">
      <button onClick={() => navigate('/chamados')} className="btn-back">
        &larr; Voltar para Meus Chamados
      </button>

      {/* Cartão de Detalhes Principais */}
      <div className="details-card">
        <div className="details-header">
          <div>
            <span className="ticket-id">Chamado #{chamado.id}</span>
            <h2>{chamado.tituloChamado}</h2>
          </div>
          <div className="badges-group">
            <span className={`badge ${getStatusBadgeClass(atendimento.status)}`}>
              {atendimento.status}
            </span>
            {chamado.prioridadeChamado && (
              <span className={`badge ${getPriorityBadgeClass(chamado.prioridadeChamado)}`}>
                Prioridade: {chamado.prioridadeChamado}
              </span>
            )}
          </div>
        </div>

        <div className="details-grid">
          <div className="info-item">
            <label>Solicitante / Setor</label>
            <p>{atendimento.solicitanteNome || 'Não informado'}</p>
          </div>
          <div className="info-item">
            <label>Equipamento / Ativo</label>
            <p>{atendimento.equipamentoVinculado || extrairEquipamento(chamado.descricaoChamado) || 'Não informado'}</p>
          </div>
          <div className="info-item">
            <label>Ocorrência</label>
            <p>{chamado.ocorrenciaChamado || 'Não classificado'}</p>
          </div>
          <div className="info-item">
            <label>Data de Abertura</label>
            <p>
              {chamado.dataAberturaChamado
                ? new Date(chamado.dataAberturaChamado).toLocaleString('pt-BR')
                : 'Não informada'}
            </p>
          </div>
        </div>

        <div className="details-section">
          <label>Histórico e Chat do Chamado</label>
          <pre className="description-text">{chamado.descricaoChamado}</pre>

          {atendimento.status !== 'FECHADO' && (
            <form className="chat-form" onSubmit={handleComentarioSubmit}>
              <textarea
                rows="3"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escreva uma mensagem para o técnico responsável..."
              />
              <button type="submit" className="btn-enviar-chat" disabled={enviandoComentario}>
                {enviandoComentario ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </form>
          )}
        </div>

        {evidencias.length > 0 && (
          <div className="details-section">
            <label>Evidências Fotográficas ({evidencias.length})</label>
            <div className="evidence-gallery">
              {evidencias.map((ev) => (
                <div key={ev.id ?? ev.imagem} className="evidence-container">
                  <img src={ev.imagem} alt={ev.nomeArquivo || 'Evidência anexada ao chamado'} />
                  {ev.nomeArquivo && <span className="evidence-caption">{ev.nomeArquivo}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {atendimento.status === 'PENDENTE_EVIDENCIA' && (
          <div className="details-section evidence-request">
            <label>O técnico solicitou uma nova evidência</label>
            <p className="evidence-request-note">
              Anexe uma foto ou arquivo com mais detalhes do problema para o atendimento continuar.
            </p>
            <form className="evidence-form" onSubmit={handleEnviarEvidencia}>
              <input type="file" accept="image/*,.pdf" onChange={handleEvidenciaChange} />
              {novaEvidencia && (
                <div className="image-preview-container">
                  <img src={novaEvidencia} alt="Pré-visualização da evidência" />
                </div>
              )}
              <button type="submit" className="btn-enviar-evidencia" disabled={enviandoEvidencia}>
                {enviandoEvidencia ? 'Enviando...' : 'Enviar Arquivo'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}