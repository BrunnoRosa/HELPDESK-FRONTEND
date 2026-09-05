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
        // Presume-se que o backend já filtre os chamados pelo token do cliente logado
        const response = await chamadoApi.listar();
        setMeusChamados(Array.isArray(response) ? response : []);
      } catch (error) {
        setErro(error.message || 'Não foi possível carregar os chamados.');
      }
    };

    carregarChamados();
  }, []);

  // -------------------------------------------------------------------------
  // Estatísticas focadas no Status (Aberto, Em Andamento, Resolvido)
  // -------------------------------------------------------------------------
  const estatisticas = useMemo(() => {
    return {
      total: meusChamados.length,
      abertos: meusChamados.filter(c => c?.statusChamado === 'ABERTO').length,
      emAndamento: meusChamados.filter(c => c?.statusChamado === 'EM_ANDAMENTO').length,
      resolvidos: meusChamados.filter(c => c?.statusChamado === 'RESOLVIDO' || c?.statusChamado === 'FECHADO').length
    };
  }, [meusChamados]);

  // -------------------------------------------------------------------------
  // Helpers para estilização e formatação
  // -------------------------------------------------------------------------
  const getClassePrioridade = (prioridade) => {
    switch (prioridade) {
      case 'BAIXA': return 'badge-baixa';
      case 'MEDIA': return 'badge-normal';
      case 'ALTA': return 'badge-alta';
      case 'URGENTE': return 'badge-critica';
      default: return 'badge-normal';
    }
  };

  const getClasseStatus = (status) => {
    switch (status) {
      case 'ABERTO': return 'badge-status-aberto';
      case 'RESOLVIDO': 
      case 'FECHADO': return 'badge-status-fechado';
      default: return 'badge-status-andamento';
    }
  };

  // Identifica visualmente em qual nível de atendimento o chamado está (N1, N2, N3)
  const getNivelDescricao = (nivel) => {
    switch (nivel) {
      case 'N1': return 'N1 (Triagem)';
      case 'N2': return 'N2 (Especializado)';
      case 'N3': return 'N3 (Engenharia)';
      default: return 'N1 (Triagem)';
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

      {/* SESSÃO DE ESTATÍSTICAS */}
      <div className="dashboard__stats">
        <article>
          <strong>{estatisticas.total}</strong>
          <span>Total de chamados</span>
        </article>
        <article>
          <strong>{estatisticas.abertos}</strong>
          <span>Aguardando Atendimento</span>
        </article>
        <article>
          <strong>{estatisticas.emAndamento}</strong>
          <span>Em Andamento</span>
        </article>
        <article>
          <strong>{estatisticas.resolvidos}</strong>
          <span>Resolvidos</span>
        </article>
      </div>

      {/* LISTAGEM EM TABELA */}
      <div className="table-container">
        <table className="chamados-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Nível</th>
              <th>Equipamento</th>
              <th>Título</th>
              <th>Prioridade</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {meusChamados.map((chamado, index) => (
              <tr key={chamado?.id ?? index}>
                <td><strong>#{chamado?.id ?? '---'}</strong></td>
                
                {/* Coluna de Status */}
                <td>
                  <span className={`badge ${getClasseStatus(chamado?.statusChamado)}`}>
                    {chamado?.statusChamado ?? 'ABERTO'}
                  </span>
                </td>

                {/* Coluna de Nível (N1, N2, N3) */}
                <td>
                  <span className="badge badge-normal">
                    {getNivelDescricao(chamado?.nivel)}
                  </span>
                </td>

                {/* Coluna de Equipamento */}
                <td>{chamado?.equipamento ?? 'Não informado'}</td>
                
                {/* Coluna de Título */}
                <td>{chamado?.tituloChamado ?? 'Sem título'}</td>
                
                {/* Coluna de Prioridade */}
                <td>
                  <span className={`badge ${getClassePrioridade(chamado?.prioridadeChamado)}`}>
                    {chamado?.prioridadeChamado ?? 'MEDIA'}
                  </span>
                </td>
                
                {/* Coluna de Ações */}
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