import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.css';

export default function ClientTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados principais baseados na estrutura do 'frontend'
  const [chamado, setChamado] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  
  // Estados de feedback visual
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Efeito para carregar os dados assim que o componente montar (Inspirado no 'frontend')
  useEffect(() => {
    carregarChamado();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const carregarChamado = async () => {
    try {
      setCarregando(true);
      setErro('');
      
      // Simula o tempo de resposta de uma API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Busca no localStorage (Mesma fonte de dados do NewTicket)
      const chamadosSalvos = JSON.parse(localStorage.getItem('@glpi:tickets')) || [];
      const chamadoEncontrado = chamadosSalvos.find(c => String(c.id) === String(id));

      if (!chamadoEncontrado) {
        setErro('Chamado não encontrado.');
        return;
      }

      setChamado(chamadoEncontrado);
      
      // Carrega o histórico salvo ou inicia com uma mensagem padrão de sistema
      setHistorico(chamadoEncontrado.historico || [
        {
          id: 'sys-1',
          autor: 'Sistema',
          mensagem: 'Chamado aberto com sucesso. Aguardando triagem da equipe técnica.',
          data: chamadoEncontrado.createdAt || new Date().toLocaleString('pt-BR'),
          tipo: 'tech',
        }
      ]);
    } catch (error) {
      setErro('Erro ao carregar os detalhes do chamado.');
    } finally {
      setCarregando(false);
    }
  };

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    if (!novoComentario.trim()) return;

    setSalvando(true);

    try {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));

      const novaMensagem = {
        id: Date.now(),
        autor: 'Você',
        mensagem: novoComentario,
        data: new Date().toLocaleString('pt-BR'),
        tipo: 'client', // Define a cor/alinhamento no CSS
      };

      const novoHistorico = [...historico, novaMensagem];
      setHistorico(novoHistorico);
      setNovoComentario('');

      // Persiste o novo comentário no localStorage para não sumir ao recarregar
      const chamadosSalvos = JSON.parse(localStorage.getItem('@glpi:tickets')) || [];
      const index = chamadosSalvos.findIndex(c => String(c.id) === String(id));
      
      if (index !== -1) {
        chamadosSalvos[index].historico = novoHistorico;
        localStorage.setItem('@glpi:tickets', JSON.stringify(chamadosSalvos));
      }
    } catch (error) {
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  // Renderização do estado de Loading
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
  if (erro || !chamado) {
    return (
      <div className="details-container">
        <button onClick={() => navigate('/cliente')} className="btn-back">
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
      <button onClick={() => navigate('/cliente')} className="btn-back">
        &larr; Voltar para Meus Chamados
      </button>

      {/* Cartão de Detalhes Principais */}
      <div className="details-card">
        <div className="details-header">
          <div>
            <span className="ticket-id">Chamado #{chamado.id}</span>
            <h2>{chamado.titulo}</h2>
          </div>
          <div className="badges-group">
            <span className={`badge status-${chamado.status?.toLowerCase().replace(' ', '-') || 'novo'}`}>
              {chamado.status || 'NOVO'}
            </span>
            {/* Ocultado badge de prioridade caso tenha removido no passo anterior, ou mantido se a prioridade for gerada via triagem */}
            {chamado.prioridade && (
              <span className={`badge badge-${chamado.prioridade.toLowerCase()}`}>
                Prioridade: {chamado.prioridade}
              </span>
            )}
          </div>
        </div>

        <div className="details-grid">
          <div className="info-item">
            <label>Solicitante / Setor</label>
            <p>{chamado.empresa}</p>
          </div>
          <div className="info-item">
            <label>Equipamento / Ativo</label>
            <p>{chamado.equipamento}</p>
          </div>
          <div className="info-item">
            <label>Ocorrência</label>
            <p>{chamado.ocorrencia || 'Não classificado'}</p>
          </div>
          <div className="info-item">
            <label>Data de Abertura</label>
            <p>{chamado.createdAt || chamado.dataCriacao}</p>
          </div>
        </div>

        <div className="details-section">
          <label>Descrição do Problema</label>
          <pre className="description-text">{chamado.descricao}</pre>
        </div>

        {/* Anexo de Foto / Evidência */}
        {chamado.imagemUrl && (
          <div className="details-section">
            <label>Evidência Fotográfica Anexada</label>
            <div className="evidence-container">
              <img src={chamado.imagemUrl} alt="Evidência do problema" />
            </div>
          </div>
        )}
      </div>

      {/* Seção de Histórico de Interações / Comentários */}
      <div className="comments-card">
        <h3>Histórico do Atendimento</h3>

        <div className="comments-list">
          {historico.map((item) => (
            <div key={item.id} className={`comment-item ${item.tipo}`}>
              <div className="comment-header">
                <strong>{item.autor}</strong>
                <span>{item.data}</span>
              </div>
              <p>{item.mensagem}</p>
            </div>
          ))}
        </div>

        {/* Formulário para Enviar Nova Mensagem */}
        <form onSubmit={handleEnviarComentario} className="comment-form">
          <textarea
            rows="3"
            placeholder="Digite uma mensagem, dúvida ou resposta para a equipe técnica..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            disabled={chamado.status === 'FECHADO' || chamado.status === 'RESOLVIDO'}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={salvando || !novoComentario.trim() || chamado.status === 'FECHADO' || chamado.status === 'RESOLVIDO'}
            >
              {salvando ? 'Enviando...' : 'Enviar Mensagem'}
            </button>
          </div>
        </form>
        
        {(chamado.status === 'FECHADO' || chamado.status === 'RESOLVIDO') && (
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#667085', marginTop: '10px' }}>
            Este chamado está encerrado. Não é possível enviar novas mensagens.
          </p>
        )}
      </div>
    </div>
  );
}