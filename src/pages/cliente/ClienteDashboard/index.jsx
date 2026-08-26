import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function ClienteDashboard() {
  const [meusChamados, setMeusChamados] = useState([]);

  // Lista padrão para exibição caso o localStorage esteja vazio
  const chamadosIniciais = [
    { id: 1, titulo: "Sistema ERP travando no login", equipamento: "Patrimônio 004512", status: "ABERTO", prioridade: "ALTA", data: "24/08/2026" },
    { id: 2, titulo: "Impressora mastigando papel", equipamento: "Imp. HP LaserJet", status: "EM ANDAMENTO", prioridade: "NORMAL", data: "23/08/2026" },
  ];

  useEffect(() => {
    // 1. Busca os dados salvos no localStorage
    const salvos = JSON.parse(localStorage.getItem('@glpi:tickets'));

    if (salvos && salvos.length > 0) {
      // Mapeia os dados do formulário para garantir compatibilidade com as colunas da tabela
      const formatados = salvos.map(item => ({
        id: item.id,
        titulo: item.titulo,
        equipamento: item.equipamento || 'N/A',
        status: item.status || 'NOVO',
        prioridade: item.prioridade,
        data: item.createdAt || new Date().toLocaleDateString('pt-BR')
      }));

      setMeusChamados(formatados);
    } else {
      setMeusChamados(chamadosIniciais);
    }
  }, []);

  const getClassePrioridade = (prioridade) => {
    switch (prioridade) {
      case 'BAIXA': return 'badge-baixa';
      case 'NORMAL': return 'badge-normal';
      case 'ALTA': return 'badge-alta';
      case 'CRÍTICA': return 'badge-critica';
      default: return 'badge-normal';
    }
  };

  const getClasseStatus = (status) => {
    switch (status) {
      case 'NOVO':
      case 'ABERTO': return 'status-aberto';
      case 'EM ANDAMENTO': return 'status-andamento';
      case 'RESOLVIDO': return 'status-resolvido';
      default: return 'status-aberto';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Meus Chamados</h2>
          <p>Acompanhe o andamento das suas solicitações de suporte.</p>
        </div>
        <Link to="/cliente/novo-chamado" className="btn-novo-chamado">
          + Novo Chamado
        </Link>
      </div>

      <div className="table-container">
        <table className="chamados-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título / Incidente</th>
              <th>Equipamento</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Data</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {meusChamados.map((chamado) => (
              <tr key={chamado.id}>
                <td><strong>#{chamado.id}</strong></td>
                <td>{chamado.titulo}</td>
                <td>{chamado.equipamento}</td>
                <td>
                  <span className={`badge ${getClasseStatus(chamado.status)}`}>
                    {chamado.status}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getClassePrioridade(chamado.prioridade)}`}>
                    {chamado.prioridade}
                  </span>
                </td>
                <td>{chamado.data}</td>
                <td>
                  <Link to={`/cliente/chamado/${chamado.id}`} className="btn-detalhes">
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}