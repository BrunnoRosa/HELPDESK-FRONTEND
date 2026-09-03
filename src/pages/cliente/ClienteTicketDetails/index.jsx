import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { chamadoApi } from "../../../services/api";
import './style.css';

export default function ClienteTicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarChamado();
  }, [id]);

  const carregarChamado = async () => {
    try {
      setLoading(true);
      const data = await chamadoApi.buscar(id);
      setChamado(data);
    } catch (error) {
      toast.error(error.message || 'Erro ao carregar detalhes do chamado.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="loading-text">Carregando chamado #{id}...</p>;
  }

  if (!chamado) {
    return (
      <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
        <h3>Chamado não encontrado</h3>
        <button onClick={() => navigate('/')} className="btn-action" style={{ marginTop: '10px' }}>
          Voltar para meus chamados
        </button>
      </div>
    );
  }

  const status = chamado.statusChamado || chamado.status || 'Aberto';
  const prio = chamado.prioridadeChamado || chamado.prioridade || 'Médio';

  return (
    <div className="ticket-details-page">
      <button onClick={() => navigate('/')} className="btn-voltar" style={{ marginBottom: '15px', background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>
        &larr; Voltar para Meus Chamados
      </button>

      <div className="detalhe__heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Chamado #{chamado.id} - {chamado.tituloChamado || chamado.titulo}</h2>
        <span className="status-badge">{status}</span>
      </div>

      <div className="details-grid">
        <div className="main-content">
          <div className="card" style={{ marginBottom: '20px', padding: '20px' }}>
            <h3>Descrição da Ocorrência</h3>
            <p style={{ marginTop: '10px', lineHeight: '1.5', color: '#334155' }}>
              {chamado.ocorrenciaChamado || chamado.ocorrencia || 'Sem descrição.'}
            </p>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3>Histórico e Atualizações do Suporte</h3>
            <pre style={{ 
              backgroundColor: '#f1f5f9', 
              padding: '15px', 
              borderRadius: '6px', 
              whiteSpace: 'pre-wrap', 
              fontSize: '0.9rem',
              marginTop: '10px'
            }}>
              {chamado.descricaoChamado || chamado.descricao || 'Nenhuma atualização informada até o momento.'}
            </pre>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="card" style={{ padding: '20px' }}>
            <h3>Informações do Chamado</h3>
            <dl className="detalhe__data" style={{ display: 'grid', gap: '10px', marginTop: '15px' }}>
              <div>
                <dt style={{ fontWeight: '600', color: '#64748b', fontSize: '0.85rem' }}>Prioridade</dt>
                <dd style={{ marginTop: '2px' }}><span className={`badge-prio ${prio.toLowerCase()}`}>{prio}</span></dd>
              </div>
              <div>
                <dt style={{ fontWeight: '600', color: '#64748b', fontSize: '0.85rem' }}>Data de Abertura</dt>
                <dd style={{ marginTop: '2px' }}>{chamado.dataCriacao || chamado.data || new Date().toLocaleDateString('pt-BR')}</dd>
              </div>
              <div>
                <dt style={{ fontWeight: '600', color: '#64748b', fontSize: '0.85rem' }}>Solicitante</dt>
                <dd style={{ marginTop: '2px' }}>{chamado.empresa || 'Cliente'}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}