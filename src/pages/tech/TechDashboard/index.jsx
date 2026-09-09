import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { chamadoApi, atendimentoApi } from '../../../services/api';
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
    urgentes: chamados.filter((chamado) => chamado?.prioridadeChamado === 'URGENTE').length,
    altas: chamados.filter((chamado) => chamado?.prioridadeChamado === 'ALTA').length,
    medias: chamados.filter((chamado) => chamado?.prioridadeChamado === 'MEDIA').length,
  }), [chamados]);

  const porChamado = useMemo(() => 
    Object.fromEntries(atendimentos.map((item) => [item.chamadoId, item])), 
  [atendimentos]);

  const formatarResumo = (texto) => {
    if (!texto) return 'Descrição não informada.';
    const ocorrenciaOriginal = texto.split('[')[0];
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

      {erro && <div className="error-box">{erro}</div>}

      <div className="dashboard__stats">
        <article><strong>{stats.total}</strong><span>Total de chamados</span></article>
        <article className="stat-urgente"><strong>{stats.urgentes}</strong><span>Urgentes</span></article>
        <article><strong>{stats.altas}</strong><span>Prioridade alta</span></article>
        <article><strong>{stats.medias}</strong><span>Prioridade média</span></article>
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
              <th>Status</th> {/* NOVA COLUNA AQUI */}
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {chamados.map((chamado, index) => {
              // Verifica o status do chamado (pega do chamado ou do atendimento)
              const statusAtual = chamado?.statusChamado || porChamado[chamado?.id]?.status || 'ABERTO';
              const isResolvido = statusAtual.toUpperCase() === 'RESOLVIDO';

              return (
                // Se estiver resolvido, deixa a linha levemente transparente para destacar os pendentes
                <tr key={chamado?.id ?? index} style={{ opacity: isResolvido ? 0.6 : 1 }}>
                  <td><strong>#{chamado?.id ?? '---'}</strong></td>
                  <td>{chamado?.tituloChamado ?? 'Sem título'}</td>
                  <td>
                    <span className={`badge-nivel ${porChamado[chamado?.id]?.nivelSuporte?.toLowerCase()}`}>
                      {porChamado[chamado?.id]?.nivelSuporte ?? 'N1'}
                    </span>
                  </td>
                  <td>{chamado?.ocorrenciaChamado ?? 'Não informada'}</td>
                  <td title={chamado?.descricaoChamado}>{formatarResumo(chamado?.descricaoChamado)}</td>
                  <td>{chamado?.prioridadeChamado ?? 'MEDIA'}</td>
                  
                  {/* NOVA CÉLULA DE STATUS */}
                  <td>
                    <span className={`status-badge ${isResolvido ? 'resolvido' : 'aberto'}`}>
                      {statusAtual}
                    </span>
                  </td>
                  
                  <td>
                    <Link to={`/tecnico/chamado/${chamado?.id ?? ''}`} className="btn-action">
                      {isResolvido ? 'Visualizar' : 'Atender'} {/* MUDA O TEXTO DO BOTÃO */}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}