import { Link } from 'react-router-dom';
import './style.css';

export default function Dashboard() {
  // Simulando dados que viriam do Banco de Dados
  const chamadosFalsos = [
    { id: 1, titulo: "Sistema ERP travando no login", empresa: "Matriz - Financeiro", equipamento: "Patrimônio 004512", status: "ABERTO", prioridade: "ALTA", data: "24/08/2026" },
    { id: 2, titulo: "Impressora mastigando papel", empresa: "Filial Sul - RH", equipamento: "Imp. HP LaserJet", status: "EM ANDAMENTO", prioridade: "NORMAL", data: "23/08/2026" },
    { id: 3, titulo: "Queda de internet em todo o andar", empresa: "Matriz - Operações", equipamento: "Switch Principal", status: "ABERTO", prioridade: "CRÍTICA", data: "24/08/2026" },
    { id: 4, titulo: "Mouse com duplo clique", empresa: "Filial Norte - Vendas", equipamento: "Patrimônio 009877", status: "RESOLVIDO", prioridade: "BAIXA", data: "20/08/2026" },
    { id: 5, titulo: "Instalação do AutoCAD", empresa: "Matriz - Engenharia", equipamento: "Patrimônio 005533", status: "EM ANDAMENTO", prioridade: "NORMAL", data: "22/08/2026" },
  ];

  // Função para retornar a classe CSS correta baseada na prioridade
  const getClassePrioridade = (prioridade) => {
    switch(prioridade) {
      case 'BAIXA': return 'badge-baixa';
      case 'NORMAL': return 'badge-normal';
      case 'ALTA': return 'badge-alta';
      case 'CRÍTICA': return 'badge-critica';
      default: return 'badge-normal';
    }
  };

  // Função para retornar a classe CSS baseada no status
  const getClasseStatus = (status) => {
    switch(status) {
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
          <h2>Dashboard de Chamados</h2>
          <p>Visão geral dos incidentes e solicitações recentes.</p>
        </div>
        <Link to="/new" className="btn-novo-chamado">
          + Novo Chamado
        </Link>
      </div>

      <div className="table-container">
        <table className="chamados-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título / Incidente</th>
              <th>Solicitante (Setor)</th>
              <th>Status</th>
              <th>Prioridade</th>
              <th>Data</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {chamadosFalsos.map((chamado) => (
              <tr key={chamado.id}>
                <td><strong>#{chamado.id}</strong></td>
                <td>{chamado.titulo}</td>
                <td>{chamado.empresa}</td>
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
                  {/* Este link vai levar para a tela que a sua dupla está construindo! */}
                  <Link to={`/ticket/${chamado.id}`} className="btn-detalhes">
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