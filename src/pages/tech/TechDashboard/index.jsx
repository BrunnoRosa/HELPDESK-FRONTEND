import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { chamadoApi } from '../../../services/api';
import './style.css';

export default function TechDashboard() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarChamados();
  }, []);

  const carregarChamados = async () => {
    try {
      setLoading(true);
      const data = await chamadoApi.listar();
      setChamados(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || 'Erro ao carregar a lista de chamados.');
    } finally {
      setLoading(false);
    }
  };

  const alterarPrioridade = async (id, novaPrioridade) => {
    try {
      const chamadoAlvo = chamados.find((c) => c.id === id);
      if (!chamadoAlvo) return;

      await chamadoApi.atualizar(id, {
        ...chamadoAlvo,
        prioridadeChamado: novaPrioridade
      });

      setChamados((prev) =>
        prev.map((c) => (c.id === id ? { ...c, prioridadeChamado: novaPrioridade } : c))
      );
      toast.success(`Prioridade do chamado #${id} alterada para ${novaPrioridade}.`);
    } catch (error) {
      toast.error(error.message || 'Erro ao alterar prioridade.');
    }
  };

  const getCorSelect = (prioridade) => {
    const prio = (prioridade || '').toLowerCase();
    if (prio === 'alto' || prio === 'alta') return '#b91c1c';
    if (prio === 'médio' || prio === 'medio' || prio === 'media') return '#b45309';
    return '#047857';
  };

  const stats = useMemo(() => {
    return {
      total: chamados.length,
      emFluxo: chamados.filter((c) => ['Aberto', 'Em Andamento', 'NOVO', 'EM_ANDAMENTO'].includes(c.status || c.statusChamado)).length,
      urgentes: chamados.filter((c) => ['Alto', 'ALTA', 'CRITICA', 'CRÍTICA'].includes(c.prioridadeChamado || c.prioridade)).length,
      resolvidos: chamados.filter((c) => ['Resolvido', 'RESOLVIDO'].includes(c.status || c.statusChamado)).length
    };
  }, [chamados]);

  if (loading) {
    return <div className="dashboard-content"><p className="loading-text">Carregando painel operacional...</p></div>;
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2 className="page-title">Painel Operacional Técnico</h2>
        <p className="page-subtitle">Visão consolidada do atendimento técnico N1, N2 e N3.</p>
      </div>

      <div className="dashboard__stats">
        <article>
          <strong>{stats.total}</strong>
          <span>Total de chamados</span>
        </article>
        <article>
          <strong>{stats.emFluxo}</strong>
          <span>Em fluxo</span>
        </article>
        <article className="stat-urgente">
          <strong>{stats.urgentes}</strong>
          <span>Urgentes (Alto)</span>
        </article>
        <article>
          <strong>{stats.resolvidos}</strong>
          <span>Resolvidos</span>
        </article>
      </div>

      <div className="table-wrapper">
        <table className="tech-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente / Setor</th>
              <th>Incidente</th>
              <th>Status</th>
              <th>Grau de Solicitação</th>
              <th>Data</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {chamados.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>Nenhum chamado na fila.</td>
              </tr>
            ) : (
              chamados.map((chamado) => {
                const prioAtual = chamado.prioridadeChamado || chamado.prioridade || 'Médio';
                return (
                  <tr key={chamado.id}>
                    <td><strong>#{chamado.id}</strong></td>
                    <td>{chamado.cliente || chamado.solicitanteNome || chamado.empresa || 'N/A'}</td>
                    <td>{chamado.tituloChamado || chamado.titulo}</td>
                    <td><span className="status-badge">{chamado.statusChamado || chamado.status}</span></td>
                    <td>
                      <select 
                        className="priority-select"
                        style={{ borderColor: getCorSelect(prioAtual), color: getCorSelect(prioAtual) }}
                        value={prioAtual}
                        onChange={(e) => alterarPrioridade(chamado.id, e.target.value)}
                      >
                        <option value="Baixo">Baixo</option>
                        <option value="Médio">Médio</option>
                        <option value="Alto">Alto</option>
                      </select>
                    </td>
                    <td>{chamado.dataCriacao || chamado.data || new Date().toLocaleDateString('pt-BR')}</td>
                    <td>
                      <Link to={`/tecnico/chamado/${chamado.id}`} className="btn-action">
                        Atender
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}