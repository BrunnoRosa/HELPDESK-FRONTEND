import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function TechDashboard() {
  // Estado original mantido com dados simulados para facilitar o desenvolvimento
  const [chamados, setChamados] = useState([
    { id: 101, cliente: "Tech Corp - Setor Financeiro", titulo: "Erro 500 no ERP", status: "Aberto", prioridade: "Alto", data: "26/08/2026" },
    { id: 102, cliente: "Logística SA", titulo: "Impressora offline", status: "Em Andamento", prioridade: "Médio", data: "25/08/2026" },
    { id: 103, cliente: "Clínica Vida", titulo: "Mouse com duplo clique", status: "Aberto", prioridade: "Baixo", data: "26/08/2026" },
    { id: 104, cliente: "Advocacia Lima", titulo: "Falha no backup diário", status: "Aberto", prioridade: "Alto", data: "24/08/2026" },
  ]);

  // Função original para edição rápida na tabela
  const alterarPrioridade = (id, novaPrioridade) => {
    setChamados(chamados.map(chamado => 
      chamado.id === id ? { ...chamado, prioridade: novaPrioridade } : chamado
    ));
  };

  // Cores dinâmicas para o seletor de prioridade
  const getCorSelect = (prioridade) => {
    if (prioridade === 'Alto') return '#b91c1c'; // Vermelho
    if (prioridade === 'Médio') return '#b45309'; // Laranja
    return '#047857'; // Verde
  };

  // LÓGICA IMPORTADA DO 'frontend': Cálculo dinâmico de estatísticas usando useMemo
  const stats = useMemo(() => {
    return {
      total: chamados.length,
      emFluxo: chamados.filter(c => c.status === 'Aberto' || c.status === 'Em Andamento').length,
      urgentes: chamados.filter(c => c.prioridade === 'Alto').length,
      resolvidos: chamados.filter(c => c.status === 'Resolvido').length
    };
  }, [chamados]);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2 className="page-title">Painel Operacional Técnico</h2>
        <p className="page-subtitle">Visão consolidada do atendimento técnico N1, N2 e N3.</p>
      </div>

      {/* SESSÃO IMPORTADA DO 'frontend': Cards de métricas */}
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

      {/* SESSÃO MANTIDA DO 'HELPDESK-FRONT': Tabela operacional de alta produtividade */}
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
            {chamados.map((chamado) => (
              <tr key={chamado.id}>
                <td><strong>#{chamado.id}</strong></td>
                <td>{chamado.cliente}</td>
                <td>{chamado.titulo}</td>
                <td><span className="status-badge">{chamado.status}</span></td>
                <td>
                  <select 
                    className="priority-select"
                    style={{ borderColor: getCorSelect(chamado.prioridade), color: getCorSelect(chamado.prioridade) }}
                    value={chamado.prioridade}
                    onChange={(e) => alterarPrioridade(chamado.id, e.target.value)}
                  >
                    <option value="Baixo">Baixo</option>
                    <option value="Médio">Médio</option>
                    <option value="Alto">Alto</option>
                  </select>
                </td>
                <td>{chamado.data}</td>
                <td>
                  <Link to={`/tecnico/chamado/${chamado.id}`} className="btn-action">
                    Atender
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