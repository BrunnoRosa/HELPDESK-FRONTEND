import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { chamadoApi } from '../../../services/api';
import './style.css';

export default function AdminDashboard() {
  const [filaAtiva, setFilaAtiva] = useState('N1'); 
  const [filtroStatus, setFiltroStatus] = useState('TODOS'); 
  const [chamados, setChamados] = useState([]);

  useEffect(() => {
    carregarChamados();
  }, []);

  const carregarChamados = async () => {
    try {
      const response = await chamadoApi.listar();
      setChamados(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Erro ao carregar chamados', error);
    }
  };

  const chamadosFiltrados = useMemo(() => {
    return chamados.filter(c => {
      const nivelMatch = (c.nivelSuporte || 'N1') === filaAtiva;
      let statusMatch = true;
      if (filtroStatus === 'ABERTO') {
        statusMatch = ['ABERTO', 'EM_ANDAMENTO'].includes(c.statusChamado);
      } else if (filtroStatus === 'ESCALONADO') {
        statusMatch = ['ALTA', 'URGENTE'].includes(c.prioridadeChamado); 
      }
      return nivelMatch && statusMatch;
    });
  }, [chamados, filaAtiva, filtroStatus]);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Painel Administrativo - Gestão de Chamados</h2>
      </div>

      <div className="admin-panel white-panel">
        <div className="queue-tabs">
          {['N1', 'N2', 'N3'].map(fila => (
            <button 
              key={fila} 
              className={`queue-btn ${filaAtiva === fila ? 'active' : ''}`} 
              onClick={() => setFilaAtiva(fila)}
            >
              Fila {fila}
            </button>
          ))}
        </div>

        <div className="filter-group-admin">
          {['TODOS', 'ABERTO', 'ESCALONADO'].map(filtro => (
            <button 
              key={filtro} 
              className={`filter-btn ${filtroStatus === filtro ? 'active' : ''}`} 
              onClick={() => setFiltroStatus(filtro)}
            >
              {filtro}
            </button>
          ))}
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Título</th>
                <th>Prioridade</th>
                <th>Responsável</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {chamadosFiltrados.length === 0 ? (
                <tr><td colSpan="6" className="empty-state">Nenhum chamado nesta fila/filtro.</td></tr>
              ) : (
                chamadosFiltrados.map(c => (
                  <tr key={c.id}>
                    <td><strong>#{c.id}</strong></td>
                    <td><span className={`badge badge-${c.statusChamado?.toLowerCase() || 'gray'}`}>{c.statusChamado}</span></td>
                    <td>{c.tituloChamado}</td>
                    <td><span className={`badge badge-${c.prioridadeChamado?.toLowerCase() || 'gray'}`}>{c.prioridadeChamado}</span></td>
                    <td>{c.tecnicoResponsavel?.nome || 'Não Atribuído'}</td>
                    <td><Link to={`/admin/chamado/${c.id}`} className="btn-outline-small">Gerenciar</Link></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}