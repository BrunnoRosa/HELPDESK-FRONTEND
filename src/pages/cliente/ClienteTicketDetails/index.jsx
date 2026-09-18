import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { atendimentoApi, chamadoApi } from '../../../services/api';
import { notify } from '../../../components/Notification';
import './style.css';

export default function ClientTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados principais
  const [chamado, setChamado] = useState(null);
  const [atendimento, setAtendimento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

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
        <button onClick={() => navigate('/')} className="btn-back">
          &larr; Voltar para Meus Chamados
        </button>
        <div className="details-card loading-state">
          <p>{erro || 'Chamado não encontrado.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <button onClick={() => navigate('/')} className="btn-back">
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
          <label>Descrição do Problema</label>
          <pre className="description-text">{chamado.descricaoChamado}</pre>
        </div>
      </div>
    </div>
  );
}