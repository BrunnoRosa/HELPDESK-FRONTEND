import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { chamadoApi } from '../../../services/api';
import Notification from '../../../components/Notification';
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

  const chamadosFiltrados = useMemo(() => {
    if (filtroAtivo === 'TODOS') return meusChamados;
    
    return meusChamados.filter(c => {
      // Garante que chamados antigos sem status sejam tratados como ABERTO
      const status = c?.statusChamado || 'ABERTO';
      
      if (filtroAtivo === 'EM_ANDAMENTO') {
        return status === 'EM_ANDAMENTO' || status === 'EM_TRIAGEM';
      }
      return status === filtroAtivo;
    });
  }, [meusChamados, filtroAtivo]);

  const getClassePrioridade = (prioridade) => {
    const map = { BAIXA: 'badge-gray', MEDIA: 'badge-blue', ALTA: 'badge-orange', URGENTE: 'badge-red' };
    return map[prioridade] || 'badge-gray';
  };

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

  // Extrai o equipamento que concatenamos na descrição (ex: [Equipamento: Notebook | ...])
  const extrairEquipamento = (descricao) => {
    if (!descricao) return 'Não informado';
    const match = descricao.match(/\[Equipamento:\s*(.*?)\s*\|/);
    return match ? match[1] : 'Não informado';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Meus Chamados</h2>
          <p>Acompanhe o andamento das suas solicitações.</p>
        </div>
      </div>

      {erro && <Notification type="error" message={erro} />}

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
              chamadosFiltrados.map((chamado) => {
                const status = chamado.statusChamado || 'ABERTO';
                
                return (
                  <tr key={chamado.id}>
                    <td><strong>#{chamado.id}</strong></td>
                    <td>
                      <span className={`badge ${getClasseStatus(status)}`}>
                        {status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>{extrairEquipamento(chamado.descricaoChamado)}</td>
                    <td>{chamado.tituloChamado}</td>
                    <td>
                      <span className={`badge ${getClassePrioridade(chamado.prioridadeChamado)}`}>
                        {chamado.prioridadeChamado}
                      </span>
                    </td>
                    <td>
                      <Link to={`/cliente/chamado/${chamado.id}`} className="btn-outline">
                        Visualizar
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