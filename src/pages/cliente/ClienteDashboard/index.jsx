import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { chamadoApi } from '../../../services/api';
import './style.css';

export default function ClienteDashboard() {
  const [meusChamados, setMeusChamados] = useState([]);
  const [filtroAtivo, setFiltroAtivo] = useState('TODOS');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarChamados = async () => {
      try {
        const response = await chamadoApi.listar();
        setMeusChamados(Array.isArray(response) ? response : []);
      } catch (error) {
        setErro(error.message || 'Não foi possível carregar os chamados.');
      }
    };
    carregarChamados();
  }, []);

  // Ajuste na filtragem: agrupando EM_TRIAGEM dentro de EM_ANDAMENTO para a visão do Cliente
  const chamadosFiltrados = useMemo(() => {
    if (filtroAtivo === 'TODOS') return meusChamados;
    
    if (filtroAtivo === 'EM_ANDAMENTO') {
      return meusChamados.filter(
        c => c?.statusChamado === 'EM_ANDAMENTO' || c?.statusChamado === 'EM_TRIAGEM'
      );
    }

    return meusChamados.filter(c => c?.statusChamado === filtroAtivo);
  }, [meusChamados, filtroAtivo]);

  const getClassePrioridade = (prioridade) => {
    const map = { BAIXA: 'badge-gray', MEDIA: 'badge-blue', ALTA: 'badge-orange', URGENTE: 'badge-red' };
    return map[prioridade] || 'badge-gray';
  };

  // Mapeamento atualizado para incluir EM_TRIAGEM
  const getClasseStatus = (status) => {
    const map = { 
      ABERTO: 'badge-blue', 
      EM_TRIAGEM: 'badge-orange', 
      EM_ANDAMENTO: 'badge-orange', 
      RESOLVIDO: 'badge-green', 
      FECHADO: 'badge-green' 
    };
    return map[status] || 'badge-gray';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Meus Chamados</h2>
          <p>Acompanhe o andamento das suas solicitações.</p>
        </div>
      </div>

      {erro && <div className="error-box">{erro}</div>}

      <div className="filter-group">
        {['TODOS', 'ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO'].map(status => (
          <button 
            key={status}
            className={`filter-btn ${filtroAtivo === status ? 'active' : ''}`}
            onClick={() => setFiltroAtivo(status)}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Equipamento</th>
              <th>Título</th>
              <th>Prioridade</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {chamadosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">Nenhum chamado encontrado para este filtro.</td>
              </tr>
            ) : (
              chamadosFiltrados.map((chamado) => (
                <tr key={chamado.id}>
                  <td><strong>#{chamado.id}</strong></td>
                  <td>
                    <span className={`badge ${getClasseStatus(chamado.statusChamado)}`}>
                      {chamado.statusChamado?.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{chamado.equipamento ?? 'Não informado'}</td>
                  <td>{chamado.tituloChamado}</td>
                  <td><span className={`badge ${getClassePrioridade(chamado.prioridadeChamado)}`}>{chamado.prioridadeChamado}</span></td>
                  <td><Link to={`/cliente/chamado/${chamado.id}`} className="btn-outline">Visualizar</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}