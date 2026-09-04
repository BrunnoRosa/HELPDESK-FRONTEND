import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { chamadoApi } from '../../../services/api';
import './style.css';

export default function ClienteDashboard() {
  const [meusChamados, setMeusChamados] = useState([]);
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

  // -------------------------------------------------------------------------
  // NOVA FUNCIONALIDADE MESCLADA DO 'frontend'
  // Cálculos de estatísticas baseados apenas nos chamados do cliente atual
  // Utilizamos useMemo para não recalcular a não ser que os chamados mudem
  // -------------------------------------------------------------------------
  const estatisticas = useMemo(() => {
    return {
      total: meusChamados.length,
      urgentes: meusChamados.filter(c => ['ALTA', 'URGENTE'].includes(c?.prioridadeChamado)).length,
      medias: meusChamados.filter(c => c?.prioridadeChamado === 'MEDIA').length,
      baixas: meusChamados.filter(c => c?.prioridadeChamado === 'BAIXA').length
    };
  }, [meusChamados]);

  // Helpers para estilização de badges (Mantidos do HELPDESK-FRONT)
  const getClassePrioridade = (prioridade) => {
    switch (prioridade) {
      case 'BAIXA': return 'badge-baixa';
      case 'MEDIA': return 'badge-normal';
      case 'ALTA': return 'badge-alta';
      case 'URGENTE': return 'badge-critica';
      default: return 'badge-normal';
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

      {erro && <div className="error-box">{erro}</div>}

      {/* SESSÃO DE ESTATÍSTICAS (Implementada a partir do 'frontend') */}
      <div className="dashboard__stats">
        <article>
          <strong>{estatisticas.total}</strong>
          <span>Total de chamados</span>
        </article>
        <article>
          <strong>{estatisticas.urgentes}</strong>
          <span>Alta ou urgente</span>
        </article>
        <article>
          <strong>{estatisticas.medias}</strong>
          <span>Prioridade média</span>
        </article>
        <article>
          <strong>{estatisticas.baixas}</strong>
          <span>Prioridade baixa</span>
        </article>
      </div>

      {/* LISTAGEM EM TABELA (Mantida do HELPDESK-FRONT) */}
      <div className="table-container">
        <table className="chamados-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Ocorrência</th>
              <th>Prioridade</th>
              <th>Descrição</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {meusChamados.map((chamado, index) => (
              <tr key={chamado?.id ?? index}>
                <td><strong>#{chamado?.id ?? '---'}</strong></td>
                <td>{chamado?.tituloChamado ?? 'Sem título'}</td>
                <td>{chamado?.ocorrenciaChamado ?? 'Não informada'}</td>
                <td>
                  <span className={`badge ${getClassePrioridade(chamado?.prioridadeChamado)}`}>
                    {chamado?.prioridadeChamado ?? 'MEDIA'}
                  </span>
                </td>
                <td>{chamado?.descricaoChamado ?? 'Descrição não informada.'}</td>
                <td>
                  <Link to={`/cliente/chamado/${chamado?.id ?? ''}`} className="btn-detalhes">
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
