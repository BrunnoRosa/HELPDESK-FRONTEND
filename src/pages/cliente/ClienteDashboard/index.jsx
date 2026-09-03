import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { chamadoApi } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import './style.css';

export default function ClienteDashboard() {
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  useEffect(() => {
    carregarChamados();
  }, []);

  const carregarChamados = async () => {
    try {
      setLoading(true);
      const data = await chamadoApi.listar();
      setChamados(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || 'Erro ao carregar seus chamados.');
    } finally {
      setLoading(false);
    }
  };

  const chamadosFiltrados = useMemo(() => {
    if (filtroStatus === 'TODOS') return chamados;
    return chamados.filter((c) => {
      const st = (c.statusChamado || c.status || '').toUpperCase();
      if (filtroStatus === 'ABERTO') return ['ABERTO', 'EM_ANDAMENTO', 'EM TRIAGEM'].includes(st);
      if (filtroStatus === 'RESOLVIDO') return ['RESOLVIDO', 'FECHADO'].includes(st);
      return st === filtroStatus;
    });
  }, [chamados, filtroStatus]);

  if (loading) {
    return <div className="dashboard-content"><p className="loading-text">Carregando seus chamados...</p></div>;
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 className="page-title">Meus Chamados</h2>
          <p className="page-subtitle">Acompanhe e gerencie suas solicitações de suporte técnico.</p>
        </div>
        <Link to="/cliente/novo-chamado" className="btn-primary" style={{ padding: '10px 16px', borderRadius: '6px', textDecoration: 'none' }}>
          + Novo Chamado
        </Link>
      </div>

      <div className="chamados__filters" style={{ marginBottom: '20px' }}>
        <select 
          value={filtroStatus} 
          onChange={(e) => setFiltroStatus(e.target.value)} 
          className="status-select"
        >
          <option value="TODOS">Todos os Chamados ({chamados.length})</option>
          <option value="ABERTO">Em Aberto / Em Andamento</option>
          <option value="RESOLVIDO">Resolvidos / Concluídos</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="tech-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Data de Abertura</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {chamadosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  Nenhum chamado encontrado.
                </td>
              </tr>
            ) : (
              chamadosFiltrados.map((chamado) => {
                const status = chamado.statusChamado || chamado.status || 'Aberto';
                const prio = chamado.prioridadeChamado || chamado.prioridade || 'Baixa';
                return (
                  <tr key={chamado.id}>
                    <td><strong>#{chamado.id}</strong></td>
                    <td>{chamado.tituloChamado || chamado.titulo}</td>
                    <td><span className={`badge-prio ${prio.toLowerCase()}`}>{prio}</span></td>
                    <td><span className="status-badge">{status}</span></td>
                    <td>{chamado.dataCriacao || chamado.data || new Date().toLocaleDateString('pt-BR')}</td>
                    <td>
                      <Link to={`/cliente/chamado/${chamado.id}`} className="btn-action">
                        Ver Detalhes
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