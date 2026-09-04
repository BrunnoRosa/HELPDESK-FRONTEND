import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { atendimentoApi, chamadoApi } from '../../../services/api';
import './style.css';

export default function ClientTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados principais baseados na estrutura do 'frontend'
    const [chamado, setChamado] = useState(null);
    const [atendimento, setAtendimento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Efeito para carregar os dados assim que o componente montar (Inspirado no 'frontend')
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
      setChamado(dadosChamado);
      setAtendimento(dadosAtendimento);
    } catch (error) {
      setErro(error.message || 'Erro ao carregar os detalhes do chamado.');
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="details-container">
        <div className="details-card">
          <p style={{ textAlign: 'center', color: '#667085' }}>Carregando detalhes do chamado...</p>
        </div>
      </div>
    );
  }

  // Renderização do estado de Erro (Ex: ID inválido)
    if (erro || !chamado || !atendimento) {
    return (
      <div className="details-container">
          <button onClick={() => navigate('/')} className="btn-back">
          &larr; Voltar para Meus Chamados
        </button>
        <div className="error-box" style={{ marginTop: '20px' }}>
          {erro || 'Chamado não encontrado.'}
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
            <span className={`badge status-${atendimento.status.toLowerCase()}`}>
              {atendimento.status}
            </span>
            {chamado.prioridadeChamado && (
              <span className={`badge badge-${chamado.prioridadeChamado.toLowerCase()}`}>
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
            <p>{atendimento.equipamentoVinculado || 'Não informado'}</p>
          </div>
          <div className="info-item">
            <label>Ocorrência</label>
            <p>{chamado.ocorrenciaChamado || 'Não classificado'}</p>
          </div>
          <div className="info-item">
            <label>Data de Abertura</label>
            <p>Nível {atendimento.nivelSuporte}</p>
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