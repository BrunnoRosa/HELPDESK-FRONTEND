import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chamadoApi, atendimentoApi } from '../../../services/api';
import Notification from '../../../components/Notification';
import './style.css';

export default function TechDashboard() {
  const [chamados, setChamados] = useState([]);
  const [atendimentos, setAtendimentos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [listaChamados, listaAtendimentos] = await Promise.all([
          chamadoApi.listar(),
          atendimentoApi.listar()
        ]);
        setChamados(Array.isArray(listaChamados) ? listaChamados : []);
        setAtendimentos(Array.isArray(listaAtendimentos) ? listaAtendimentos : []);
      } catch (error) {
        setErro(error.message || 'Não foi possível carregar os chamados.');
      }
    };

    carregarDados();
  }, []);

  const stats = useMemo(() => ({
    total: chamados.length,
    urgentes: chamados.filter((c) => c?.prioridadeChamado === 'URGENTE').length,
    altas: chamados.filter((c) => c?.prioridadeChamado === 'ALTA').length,
    medias: chamados.filter((c) => c?.prioridadeChamado === 'MEDIA').length,
  }), [chamados]);

  // Proteção: Filtra itens nulos ou sem chamadoId antes de criar o objeto
  const porChamado = useMemo(() => 
    Object.fromEntries(
      atendimentos
        .filter(item => item && item.chamadoId)
        .map((item) => [item.chamadoId, item])
    ), 
  [atendimentos]);

  // Proteção: Garante que o texto seja convertido para String antes do .split()
  const formatarResumo = (texto) => {
    if (!texto) return 'Descrição não informada.';
    const ocorrenciaOriginal = String(texto).split('[')[0];
    return ocorrenciaOriginal.length > 80 
      ? ocorrenciaOriginal.substring(0, 80) + '...' 
      : ocorrenciaOriginal;
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2 className="page-title">Painel Operacional Técnico</h2>
        <p className="page-subtitle">Visão consolidada dos chamados em atendimento.</p>
      </div>

      {erro && <Notification type="error" message={erro} />}

      <div className="dashboard__stats">
        <article>
          <strong>{stats.total}</strong>
          <span>Total de chamados</span>
        </article>
        <article className="stat-urgente">
          <strong>{stats.urgentes}</strong>
          <span>Urgentes</span>
        </article>
        <article>
          <strong>{stats.altas}</strong>
          <span>Prioridade alta</span>
        </article>
        <article>
          <strong>{stats.medias}</strong>
          <span>Prioridade média</span>
        </article>
      </div>

      <div className="table-wrapper">
        <table className="tech-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Nível</th>
              <th>Ocorrência</th>
              <th>Descrição (Resumo)</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {chamados.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state-td">
                  Nenhum chamado atribuído no momento.
                </td>
              </tr>
            ) : (
              chamados.map((chamado, index) => {
                const statusAtual = chamado?.statusChamado || porChamado[chamado?.id]?.status || 'ABERTO';
                const isResolvido = statusAtual.toUpperCase() === 'RESOLVIDO';

                return (
                  <tr key={chamado?.id ?? index} style={{ opacity: isResolvido ? 0.6 : 1 }}>
                    <td><strong>#{chamado?.id ?? '---'}</strong></td>
                    <td>{chamado?.tituloChamado ?? 'Sem título'}</td>
                    <td>
                      <span className={`badge-nivel ${porChamado[chamado?.id]?.nivelSuporte?.toLowerCase() || 'n1'}`}>
                        {porChamado[chamado?.id]?.nivelSuporte ?? 'N1'}
                      </span>
                    </td>
                    <td>{chamado?.ocorrenciaChamado ?? 'Não informada'}</td>
                    <td title={chamado?.descricaoChamado}>{formatarResumo(chamado?.descricaoChamado)}</td>
                    <td>
                      <span className={`badge-prioridade ${(chamado?.prioridadeChamado ?? 'MEDIA').toLowerCase()}`}>
                        {chamado?.prioridadeChamado ?? 'MEDIA'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${isResolvido ? 'resolvido' : 'aberto'}`}>
                        {statusAtual}
                      </span>
                    </td>
                    <td>
                      <Link to={`/tecnico/chamado/${chamado?.id ?? ''}`} className="btn-action">
                        {isResolvido ? 'Visualizar' : 'Atender'}
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